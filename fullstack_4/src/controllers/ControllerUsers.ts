import {Body, Controller, Post, Get, Route, Path, FormField, Query} from "tsoa";
import {UserLoginRequest} from "../../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../../models/messages/UserLoginResponse";
import moment from "moment";
import * as _ from "lodash";
import sqlite3 from "sqlite3";
import nodemailer from "nodemailer";
import {User} from "../../models/User";
import {generateUuid} from "../../models/Util";
import {UserRegisterRequest} from "../../models/messages/UserRegisterRequest";
import {UserRegisterResponse} from "../../models/messages/UserRegisterResponse";


@Route("users")
export class ControllerUsers {
    private database: sqlite3.Database;
    private transporter: nodemailer.Transporter;

    constructor() {
        this.database = new sqlite3.Database("./database/database.sqlite");

        this.transporter = nodemailer.createTransport({
            host: "mail.inbox.lv",
            port: 587,
            secure: false,
            auth: {
                user: "s20saforolatest@inbox.lv",
                pass: "7wSsT4NMg2",
            },
        });
    }

    private async newUserSessionToken(user_id: number, newSession_token: string): Promise<void> {
        const updateQuery = "UPDATE users SET session_token = ? WHERE user_id = ?";

        return new Promise<void>((resolve, reject) => {
            this.database.run(updateQuery, [newSession_token, user_id], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public async changeIsConfirmed(uuid: string): Promise<{ is_success: boolean; error?: string }> {
        let updateQuery =
            "UPDATE users SET is_confirmed = 1 WHERE confirmation_uuid = ?";

        return new Promise<{ is_success: boolean; error?: string }>((resolve, reject) => {
            this.database.run(updateQuery, [uuid], function (error) {
                if (error) {
                    resolve({ is_success: false, error: error.message });
                } else {
                    resolve({ is_success: true });
                }
            });
        });
    }

    private async sendConfirmationEmail(email: string, confirmationUrl: string): Promise<void> {
        let mailOptions = {
            from: "s20saforolatest@inbox.lv",
            to: email,
            subject: "Apstipriniet savu reģistrāciju priekš MD4_3",
            text: `Lūdzu, apstipriniet savu reģistrāciju: ${confirmationUrl}`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    private generateConfirmationUrl(uuid: string): string {
        let baseUrl = "http://localhost:8000";
        return `${baseUrl}/user/new/conf/${uuid}`;
    }

    public async getUserByConfirmationUuid(uuid: string): Promise<User | null> {
        let selectQuery =
            "SELECT * FROM users WHERE confirmation_uuid = ?";

        return new Promise<User | null>((resolve, reject) => {
            this.database.get(selectQuery, [uuid], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row as User | null);
                }
            });
        });
    }

    private async getUserByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        let selectQuery =
            "SELECT * FROM users WHERE username = ? AND password = ?";

        return new Promise<User | null>((resolve, reject) => {
            this.database.get(selectQuery, [username, password], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row as User | null);
                }
            });
        });
    }

    private async saveUserInDatabase(user: User): Promise<User | null> {
        let insertQuery =
            "INSERT INTO users (username, password, email, is_confirmed, confirmation_uuid, session_token) VALUES (?, ?, ?, ?, ?, ?)";

        return new Promise<User | null>((resolve, reject) => {
            this.database.run(
                insertQuery,
                [
                    user.username,
                    user.password,
                    user.email,
                    user.is_confirmed ? 1 : 0,
                    user.confirmation_uuid,
                    user.session_token
                ],
                function (error) {
                    if (error) {
                        reject(error);
                    } else {

                        const userId = this.lastID;

                        resolve({ user_id: userId, username: user.username, password: user.password, email: user.email, is_confirmed: user.is_confirmed, confirmation_uuid: user.confirmation_uuid, session_token: user.session_token });
                    }
                }
            );
        });
    }

    @Post('register')
    public async register(@Body() request: UserRegisterRequest): Promise<UserRegisterResponse> {
        let result: UserRegisterResponse = {
            is_success: false,
            confirmationUrl: "",
            error: "No errors"
        };

        let user: User = {
            user_id: 0,
            username: request.username,
            password: request.password,
            email: request.email,
            is_confirmed: false,
            confirmation_uuid: generateUuid(),
            session_token: null,
        };

        try{
            let registrationResult = await this.saveUserInDatabase(user);

            if (registrationResult) {
                let confirmUrl = this.generateConfirmationUrl(user.confirmation_uuid);
                await this.sendConfirmationEmail(user.email, confirmUrl);

                result.is_success = true;
                result.confirmationUrl = confirmUrl;
            }
        } catch (e) {
            result.error = e.message || "Unknown error";
        }

        return result;
    }

    @Get("confirmation/{uuid}")
    public async getUserConfirmation(@Path() uuid: string): Promise<{ is_confirmed: boolean }> {
        let user: User | null = await this.getUserByConfirmationUuid(uuid);

        return { is_confirmed: user !== null && user.is_confirmed };
    }

    @Post("login")
    public async login(@Body() request: UserLoginRequest): Promise<UserLoginResponse> {
        let result: UserLoginResponse = {
            session_token: "",
            is_success: false
        };

        try {
            let user: User | null = await this.getUserByUsernameAndPassword(request.username, request.password);

            if(user && user.is_confirmed) {
                let timeNow = moment();
                result.session_token = timeNow.utc().unix().toString();
                result.is_success = true;

                await this.newUserSessionToken(user.user_id, result.session_token);
            }
        } catch (e) {
            console.error("Login error: ", e);
        }

        return result;
    }
}
