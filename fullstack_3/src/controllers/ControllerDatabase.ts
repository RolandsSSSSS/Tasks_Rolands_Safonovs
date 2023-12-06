import { DataSource } from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {query} from "express";
import {DbHabit} from "../models/db/DbHabit";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./src/database/databasemd.sqlite",
            logging: false,
            synchronize: false,
            entities: []
        })
    }

    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();
        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async login(
        email: string,
        pass: string
    ): Promise<DbSession> {
        let session: DbSession = null;

        let passwordHashed = sha1(pass);

        let rows = await this.dataSource.query(
            "SELECT * FROM user WHERE email = :email AND pass = :pass AND is_deleted = 0 LIMIT 1",
            [
                    email, passwordHashed
            ]
        )
        if(rows.length > 0) {
            let row = rows[0];
            let user: DbUser = row as DbUser;

            let token = uuidv4();
            await this.dataSource.query(
                "INSERT INTO session (user_id, token, created) VALUES (?, ?, CURRENT_TIMESTAMP)",
                [user.user_id, token]
            );

            let rowlast = await this.dataSource.query("SELECT last_insert_rowid() as session_id");
            session = {
                session_id: rowlast.session_id,
                user_id: user.user_id,
                token: token,
                is_valid: true,
                created: rowlast.created,
                user: user
            }
        }

        return session;
    }

    public async addHabit(
        session_token: string,
        label: string
    ): Promise<DbHabit> {
        let habit: DbHabit = null
        let rows = await this.dataSource.query(
            "SELECT * FROM session WHERE token = :token AND is_valid = 1 LIMIT 1",
            [
                session_token
            ]
        )
        if (rows.length > 0) {
            let user_id = rows[0].user_id;

            let exHabit = await this.dataSource.query(
                "SELECT * FROM habit WHERE user_id = :user_id AND label = :label AND is_deleted = 0 LIMIT 1",
                [
                    user_id, label
                ]
            );

            if (exHabit.length > 0) {
                return exHabit[0];
            }else{
                await this.dataSource.query(
                    "INSERT INTO habit (user_id, label, created) VALUES (?, ?, CURRENT_TIMESTAMP)",
                    [
                        user_id, label
                    ]
                );

                let rowlast = await this.dataSource.query("SELECT last_insert_rowid() as habit_id");
                habit = {
                    habit_id: rowlast[0].habit_id,
                    user_id: rows[0].user_id,
                    label: label,
                    is_deleted: false,
                    created: rowlast[0].created
                }

                return habit;
            }
        }else{
            return habit;
        }

    }

    public async deleteHabit(
        session_token: string,
        label: string
    ): Promise<boolean> {
        let success = false;
        let rows = await this.dataSource.query(
            "SELECT * FROM session WHERE token = :token AND is_valid = 1 LIMIT 1",
            [
                session_token
            ]
        );

        if (rows.length > 0) {
            let user_id = rows[0].user_id;

            let exHabit = await this.dataSource.query(
                "SELECT * FROM habit WHERE user_id = :user_id AND label = :label AND is_deleted = 0 LIMIT 1",
                [
                    user_id, label
                ]
            );

            if (exHabit.length > 0){
                await this.dataSource.query(
                    "UPDATE habit SET is_deleted = 1 WHERE habit_id = ?",
                    [
                        exHabit[0].habit_id
                    ]
                );
                success = true;
            }
        }
        return success;
    }

    public async listHabits(
        session_token: string
    ): Promise<DbHabit[]>{
        let habits: DbHabit[] = null;

        let rows = await this.dataSource.query(
            "SELECT h.* FROM session s JOIN user u ON s.user_id = u.user_id JOIN habit h ON u.user_id = h.user_id " +
            "WHERE s.token = :token AND s.is_valid = 1 AND h.is_deleted = 0",
            [
                session_token
            ]
        );
        if (rows.length > 0){
            habits = rows;
        }

        return habits;
    }
}