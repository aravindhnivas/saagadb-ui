// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
const DB_HOST = env.DB_HOST;
const DB_PORT = env.DB_PORT;
export const DB_URL = `http://${DB_HOST}:${DB_PORT}/api/data`;
