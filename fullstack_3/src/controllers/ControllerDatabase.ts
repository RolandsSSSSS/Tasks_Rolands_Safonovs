import { DataSource } from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {query} from "express";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
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
        username: string,
        password: string
    ): Promise<DbSession> {
        let session: DbSession = null;

        let passwordHashed = sha1(password);

        let rows = await this.dataSource.query(
            "SELECT * FROM users WHERE username = :username AND password = :password AND is_deleted = 0 LIMIT 1",
            [
                    username, passwordHashed
            ]
        )
        if(rows.length > 0) {
            let row = rows[0];
            let user: DbUser = row as DbUser;

            let token = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, device_uuid, token) VALUES (?, ?, ?)",
                [user.user_id, "", token]
            );

            let rowlast = await this.dataSource.query("SELECT last_insert_rowid() as session_id");
            session = {
                session_id: rowlast.session_id,
                user_id: user.user_id,
                device_uuid: "",
                token: token,
                is_valid: true,
                user: user
            }
        }

        return session;
    }
}