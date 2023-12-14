import {Application} from "express";
import express from "express";
import moment from "moment";

import cluster from "cluster";
import os from "os";
import nodemailer from "nodemailer";
import fs from "fs";
import * as _ from "lodash";
import {RegisterRoutes} from "./routers/routes";
import swaggerUi from "swagger-ui-express";


// All APIs that need to be included must be imported in app.ts
import {ControllerDummy} from "./controllers/ControllerDummy";
import {ControllerUsers} from "./controllers/ControllerUsers";
import {ControllerTodos} from "./controllers/ControllerTodos";


const PORT = 8000;
const IS_PRODUCTION = process.env.IS_PRODUCTION;

if(cluster.isPrimary && IS_PRODUCTION){
    // fork process
    let cpu_count = os.cpus().length;
    for(let i = 0; i < cpu_count; i++) {
        cluster.fork();
    }
} else {
    const app: Application = express();

    app.use(express.json());
    app.use(express.static("public")); // from this directory you can load files directly

    RegisterRoutes(app);

    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: "/swagger.json",
            },
        }),
    );

    app.get("/user/new/conf/:uuid", async (req, res) => {
        let uuid = req.params.uuid;

        let confirmResult = await confirmUserByUUID(uuid);

        if (confirmResult) {
            res.send("Your account is confirmed, WoHooo!  You can log in now!");
        } else {
            res.send("Invalid link!");
        }
    });

    app.listen(PORT, () => {
        console.log('server running');
    })
}

async function confirmUserByUUID(uuid: string): Promise<boolean> {
    try {
        const controllerUsers = new ControllerUsers();

        let user = await controllerUsers.getUserByConfirmationUuid(uuid);

        if (user && !user.is_confirmed) {
            let updateResult = await controllerUsers.changeIsConfirmed(uuid);

            if (updateResult.is_success) {
                console.log("User confirmed:", user.username);
                return true;
            } else {
                console.error("Error confirming user:", updateResult.error);
                return false;
            }
        } else {
            console.log("Invalid confirmation link.");
            return false;
        }
    } catch (error) {
        console.error("Error confirming user:", error);
        return false;
    }
}
