import {Body, Post, Route} from "tsoa";
import sqlite3 from "sqlite3";
import {TodoAddRequest} from "../../models/messages/TodoAddRequest";
import {TodoAddResponse} from "../../models/messages/TodoAddResponse";
import {Todo} from "../../models/Todo";
import {TodoListRequest} from "../../models/messages/TodoListRequest";
import {TodoListResponse} from "../../models/messages/TodoListResponse";
import {TodoRemoveRequest} from "../../models/messages/TodoRemoveRequest";
import {TodoRemoveResponse} from "../../models/messages/TodoRemoveResponse";
import {TodoUpdateRequest} from "../../models/messages/TodoUpdateRequest";
import {TodoUpdateResponse} from "../../models/messages/TodoUpdateResponse";

interface UserRow {
    user_id: number;
    username: string;
    password: string;
    email: string;
    is_confirmed: boolean;
    confirmation_uuid: string;
    created: string;
    session_token: string | null;
}

@Route("todos")
export class ControllerTodos {
    private database: sqlite3.Database;

    constructor() {
        this.database = new sqlite3.Database("./database/database.sqlite");
    }

    private async getUserIdFromSessionToken(session_token: string): Promise<number | null> {
        let selectQuery =
            "SELECT user_id FROM users WHERE session_token = ?";

        return new Promise<number | null>((resolve, reject) => {
            this.database.get(selectQuery, [session_token], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    const userId = (row as { user_id?: number })?.user_id;
                    resolve(userId);
                }
            });
        });
    }

    private async saveTodoInDatabase(todo: Todo): Promise<void> {
        let insertQuery =
            "INSERT INTO todos (task, user_id, updated, is_deleted) VALUES (?, ?, ?, ?)";

        return new Promise<void>((resolve, reject) => {
            this.database.run(
                insertQuery,
                [
                    todo.task,
                    todo.user_id,
                    todo.updated,
                    todo.is_deleted ? 1 : 0
                ],
                function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    private async getTodosFromDatabase(sessionToken: string): Promise<Todo[]> {
        let selectUserQuery =
            "SELECT * FROM users WHERE session_token = ?";
        let selectTodosQuery =
            "SELECT * FROM todos WHERE user_id = ?";

        return new Promise<Todo[]>((resolve, reject) => {
            this.database.get(selectUserQuery, [sessionToken], (error, userRow: UserRow) => {
                if (error) {
                    reject(error);
                } else {
                    if (userRow) {
                        const userId = userRow.user_id;

                        this.database.all(selectTodosQuery, [userId], (error, todoRows: { todo_id: number; task: string; user_id: number; updated: string; is_deleted: number }[]) => {
                            if (error) {
                                reject(error);
                            } else {
                                const todos: Todo[] = todoRows.map((row) => ({
                                    todo_id: row.todo_id,
                                    task: row.task,
                                    user_id: row.user_id,
                                    updated: row.updated,
                                    is_deleted: row.is_deleted === 1,
                                }));

                                resolve(todos);
                            }
                        });
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    }

    private async markTodoAsDeleted(todoId: number, userId: number): Promise<{ success: boolean; error?: string }> {
        let updateQuery =
            "UPDATE todos SET is_deleted = 1, updated = CURRENT_TIMESTAMP WHERE todo_id = ? AND user_id = ?";

        return new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
            this.database.run(updateQuery, [todoId, userId], function (error) {
                if (error) {
                    resolve({ success: false, error: error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    private async updateTodoInDatabase(todoId: number, userId: number, newTask: string): Promise<string | null> {
        let selectQuery =
            "SELECT task FROM todos WHERE todo_id = ? AND user_id = ?";

        return new Promise<string | null>((resolve, reject) => {
            this.database.get(selectQuery, [todoId, userId], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    const currentTask = (row as { task?: string })?.task;

                    if (currentTask !== null && currentTask !== undefined) {
                        let updateQuery =
                            'UPDATE todos SET task = ?, updated = CURRENT_TIMESTAMP WHERE todo_id = ? AND user_id = ?';

                        this.database.run(updateQuery, [newTask, todoId, userId], function (updateError) {
                            if (updateError) {
                                reject(updateError);
                            } else {
                                resolve(newTask);
                            }
                        });
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    @Post("add")
    public async addTodo(@Body() request: TodoAddRequest): Promise<TodoAddResponse> {
        let result: TodoAddResponse = {
            is_success: false,
            task: "",
            session_id: ""
        };

        try {
            let user_id = await this.getUserIdFromSessionToken(request.session_token);

            if(user_id !== null) {
                let todo: Todo = {
                    todo_id: 0,
                    task: request.task,
                    user_id: user_id,
                    updated: null,
                    is_deleted: false
                };

                await this.saveTodoInDatabase(todo);

                result.is_success = true;
                result.task = todo.task
                result.session_id = request.session_token;

            }
        }catch (e) {
            console.log("Add todo error: ", e);
        }

        return result;
    }

    @Post("list")
    public async getTodoList(@Body() request: TodoListRequest): Promise<TodoListResponse> {
        let result: TodoListResponse = {
            is_success: false,
            todos: [],
        };

        try {
            const todos: Todo[] = await this.getTodosFromDatabase(request.session_token);

            if (todos){
                result.is_success = true;
                result.todos = todos;
            }

            result.is_success = false;
        } catch (e) {
            console.error("Get todo list error: ", e);
        }

        return result;
    }

    @Post("remove")
    public async removeTodo(@Body() request: TodoRemoveRequest): Promise<TodoRemoveResponse> {
        let result: TodoRemoveResponse = {
            is_success: false,
            todo_id: request.todo_id
        };

        try {
            const userId = await this.getUserIdFromSessionToken(request.session_token);

            if (userId !== null) {
                let success = await this.markTodoAsDeleted(request.todo_id, userId);
                console.log(success.success)
                if (success.success) {
                    result.is_success = true;
                }
            }
        } catch (e) {
            console.log("Remove todo error: ", e);
        }

        return result;
    }

    @Post('update')
    public async updateTodo(@Body() request: TodoUpdateRequest): Promise<TodoUpdateResponse> {
        let result: TodoUpdateResponse = {
            is_success: false,
            updated_task: "",
        };

        try {
            const userId = await this.getUserIdFromSessionToken(request.session_token);

            if (userId !== null) {
                let updatedTask = await this.updateTodoInDatabase(request.todo_id, userId, request.task);

                if (updatedTask !== null) {
                    result.is_success = true;
                    result.updated_task = updatedTask;
                }
            }
        } catch (e) {
            console.log("Update  todo error: ", e);
        }

        return result;
    }

}