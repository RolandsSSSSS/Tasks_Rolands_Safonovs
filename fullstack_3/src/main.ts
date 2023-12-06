import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";

const PORT = 8000;
const main = async () => {
    try {
        const app: Application = express();
        const mult = multer();
        app.use(express.json());
        app.use(express.urlencoded({extended: true})); // get data from HTML forms
        app.use(mult.array("data"));

        await ControllerDatabase.instance.connect();

        app.get('/test', (_req, res) => {
            console.log('GET request received');
            res.send('Hello!');
        });

        app.post('/login', async (req, res) => {
            let response = {
                session_token: "",
                success: false
            };

            let request = req.body;
            let session = await ControllerDatabase.instance.login(
                request.email.trim(),
                request.pass.trim(),
            )
            if(session) {
                response.session_token = session.token;
                response.success = true;
            }

            res.json(response);
        });

        app.post('/addHabit', async (req, res) => {
            let response = {
                habit: null,
                success: false,
            };

            let request = req.body;
            let habit = await ControllerDatabase.instance.addHabit(
                request.session_token.trim(),
                request.label.trim()
            )
            if (habit) {
                response.habit = habit;
                response.success = true;
            }

            res.json(response);
        });

        app.listen(
            PORT,
            () => {
                // http://127.0.0.1:PORT
                console.log(`Server started ${PORT}`);
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}
main();

