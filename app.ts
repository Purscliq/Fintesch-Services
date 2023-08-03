import { config } from 'dotenv';
import express, { json, urlencoded, Application } from 'express';
import cors from 'cors';

import { connectToDatabase } from './config/connect';
import { AppRoutes } from './src/routes/appRoutes';

config();

export class App {
    private app: Application;
    private port: string | number;

    constructor() {
        this.port = process.env.port || 8000;
        this.app = express();
        this.app.use(json());
        this.app.use(urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(new AppRoutes().mount());
    }

    public start = async () => {
        try {
            await connectToDatabase();
            this.app.listen(this.port, () => console.log(`Server is running on port ${this.port}`));
        } catch (error: any) { 
            console.error(error.message);
        }
    }
};
