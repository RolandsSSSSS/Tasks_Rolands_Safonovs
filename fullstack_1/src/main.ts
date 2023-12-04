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

        let response: StatsResponse;

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
    const calculateStats = (data: any[]) => ({
        avg: (prop: string) => +(data.reduce((sum, item) => sum + item[prop], 0) / data.length),
        min: (prop: string) => +Math.min(...data.map(item => item[prop])),
        max: (prop: string) => +Math.max(...data.map(item => item[prop])),
    });

    return {
        sepalLengthAvg: calculateStats(filteredData).avg('sepalLength'),
        sepalWidthAvg: calculateStats(filteredData).avg('sepalWidth'),
        petalLengthAvg: calculateStats(filteredData).avg('petalLength'),
        petalWidthAvg: calculateStats(filteredData).avg('petalWidth'),
        sepalLengthMin: calculateStats(filteredData).min('sepalLength'),
        sepalWidthMin: calculateStats(filteredData).min('sepalWidth'),
        petalLengthMin: calculateStats(filteredData).min('petalLength'),
        petalWidthMin: calculateStats(filteredData).min('petalWidth'),
        sepalLengthMax: calculateStats(filteredData).max('sepalLength'),
        sepalWidthMax: calculateStats(filteredData).max('sepalWidth'),
        petalLengthMax: calculateStats(filteredData).max('petalLength'),
        petalWidthMax: calculateStats(filteredData).max('petalWidth'),
        isSuccess: true
    };
}

function saveDataToCache(cacheFilePath: string, data: ApiResponse): void {
    fs.writeFileSync(cacheFilePath, JSON.stringify(data));
}

app.listen(
    8000,
    () => {
        console.log('Server started http://localhost:8000');
    }
);

