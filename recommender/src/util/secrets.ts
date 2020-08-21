import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

//export const SESSION_SECRET = process.env["SESSION_SECRET"];
//export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
export const DB_HOST = process.env["DB_HOST"];
export const DB_USER = process.env["DB_USER"];
export const DB_PWD = process.env["DB_PWD"];
export const DB_NAME = process.env["DB_NAME"];
export const DB_PORT = process.env["DB_PORT"];

/*if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}*/

if (!DB_HOST) {
    if (prod) {
        logger.error("No  connection string. Set DB_* environment variables.");
    } else {
        logger.error("No  connection string. Set DB_* environment variable.");
    }
    process.exit(1);
}
