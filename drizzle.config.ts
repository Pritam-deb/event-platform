import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });
dotenv.config();

const databaseUrl =
    process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
const enableSsl = process.env.DB_SSL === 'true';
const sslCa = process.env.DB_SSL_CA?.replace(/\\n/g, '\n');

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/**/*.ts',
    dialect: 'mysql',
    dbCredentials: databaseUrl
        ? { url: databaseUrl }
        : {
            host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
            port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
            user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
            password:
                process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'root',
            database:
                process.env.DB_NAME || process.env.MYSQLDATABASE || 'events_db',
            ssl: enableSsl
                ? {
                    ...(sslCa ? { ca: sslCa } : {}),
                    rejectUnauthorized: true,
                }
                : undefined,
        },
});
