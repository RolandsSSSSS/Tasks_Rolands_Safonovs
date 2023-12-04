import * as express from "express";
import { Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import { ApiRequest } from "./interfaces/APIRequest";
import { ApiResponse } from "./interfaces/APIResponse";
import * as path from "path";
import {StatsResponse} from "./interfaces/StatsResponse";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cacheDir: string = "./files";

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

const multerStor = multer.memoryStorage();
const multerUpl = multer({ storage: multerStor });

app.post('/calculate_stats', multerUpl.single('file'), async (req, res) => {
    try {
        const species : ApiRequest = req.body.species;

        if (!species) {
            return res.json({ error: "Please provide the 'species' parameter.", isSuccess: false });
        }

        if (!req.file) {
            return res.json({ error: "Please upload file.", isSuccess: false });
        }


        const cacheKey: string = `${species}_${req.file.originalname}`;
        const cacheFilePath: string = path.join(cacheDir, `${cacheKey}.json`);

        let response: StatsResponse = null;

        if (!fs.existsSync(cacheFilePath)) {
            const dataset = JSON.parse(req.file.buffer.toString());

            const filteredData = dataset.filter((item: any): boolean => item.species === species);

            if (filteredData.length === 0) {
                res.json({error: `Nothing found with species: ${species}`, isSuccess: false});
            } else {
                response = createStatsResponse(filteredData);
                saveDataToCache(cacheFilePath, response);
            }
        } else {
            let cacheData: any;
            cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
            response = cacheData;
        }

        res.json(response);
    } catch (error) {
        res.json({ error: error.message, isSuccess: false });
    }
});

function createStatsResponse(filteredData: any[]): StatsResponse {
    const sepalLengthValues = filteredData.map((item: any) => item.sepalLength);
    const sepalWidthValues = filteredData.map((item: any) => item.sepalWidth);
    const petalLengthValues = filteredData.map((item: any) => item.petalLength);
    const petalWidthValues = filteredData.map((item: any) => item.petalWidth);


    return {
        sepalLengthAvg: findAvg(sepalLengthValues),
        sepalWidthAvg: findAvg(sepalWidthValues),
        petalLengthAvg: findAvg(petalLengthValues),
        petalWidthAvg: findAvg(petalWidthValues),
        sepalLengthMin: findMin(sepalLengthValues),
        sepalWidthMin: findMin(sepalWidthValues),
        petalLengthMin: findMin(petalLengthValues),
        petalWidthMin: findMin(petalWidthValues),
        sepalLengthMax: findMax(sepalLengthValues),
        sepalWidthMax: findMax(sepalWidthValues),
        petalLengthMax: findMax(petalLengthValues),
        petalWidthMax: findMax(petalWidthValues),
        isSuccess: true
    };
}

function saveDataToCache(cacheFilePath: string, data: ApiResponse): void {
    fs.writeFileSync(cacheFilePath, JSON.stringify(data));
}

function findAvg(arr: number[]): number {
    const sum = arr.reduce((acc , val) => acc + val, 0);
    return sum / arr.length;
}

function findMin(arr: number[]): number {
    if (arr.length == 0) {
        return null;
    }

    let min = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if(arr[i] < min){
            min = arr[i];
        }
    }
    return min;
}

function findMax(arr: number[]): number {
    if (arr.length == 0) {
        return null;
    }

    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if(arr[i] > max){
            max = arr[i]
        }
    }
    return max;
}

app.listen(
    8000,
    () => {
        console.log('Server started http://localhost:8000');
    }
);

