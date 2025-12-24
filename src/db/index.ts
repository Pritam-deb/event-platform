import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

function firstDefined(...values: Array<string | undefined>) {
    return values.find((value) => value != null && value !== "");
}

function requireEnv(...names: string[]) {
    for (const name of names) {
        const value = process.env[name];
        if (value != null && value !== "") return value;
    }
    throw new Error(`Missing environment variable: ${names[0] ?? "UNKNOWN"}`);
}

function resolvePoolConfig(): mysql.PoolOptions {
    const databaseUrl = firstDefined(
        process.env.DATABASE_URL,
        process.env.MYSQL_PUBLIC_URL,
        process.env.MYSQL_URL
    );
    const enableSsl = process.env.DB_SSL === "true";
    const sslCa = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
    const ssl = enableSsl
        ? {
            ...(sslCa ? { ca: sslCa } : {}),
            rejectUnauthorized: true,
        }
        : undefined;
    if (databaseUrl) {
        if (databaseUrl.includes("${{")) {
            throw new Error(
                "DATABASE_URL/MYSQL_PUBLIC_URL/MYSQL_URL contains Railway template placeholders; copy the rendered value from Railway"
            );
        }
        const url = new URL(databaseUrl);
        if (url.hostname.endsWith(".railway.internal") && !process.env.RAILWAY_ENVIRONMENT) {
            throw new Error(
                `DB host ${url.hostname} is only reachable from inside Railway services`
            );
        }
        const database = url.pathname.replace(/^\//, "");
        if (!database) throw new Error("DATABASE_URL is missing a database name");

        return {
            host: url.hostname,
            port: url.port ? Number(url.port) : 3306,
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database,
            ssl,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 5),
            enableKeepAlive: true,
        };
    }

    const host = requireEnv("DB_HOST", "MYSQLHOST");
    if (host.endsWith(".railway.internal") && !process.env.RAILWAY_ENVIRONMENT) {
        throw new Error(
            `DB_HOST=${host} is only reachable from inside Railway services`
        );
    }

    return {
        host,
        port: Number(firstDefined(process.env.DB_PORT, process.env.MYSQLPORT) ?? 3306),
        user: requireEnv("DB_USER", "MYSQLUSER"),
        password: requireEnv("DB_PASSWORD", "MYSQLPASSWORD"),
        database: requireEnv("DB_NAME", "MYSQLDATABASE"),
        ssl,
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 5),
        enableKeepAlive: true,
    };
}

type Db = ReturnType<typeof drizzle<Record<string, never>, Pool>>;

let pool: Pool | null = null;
let db: Db | null = null;

export function getDb() {
    if (!pool) pool = mysql.createPool(resolvePoolConfig());
    if (!db) db = drizzle<Record<string, never>, Pool>(pool);
    return db;
}
