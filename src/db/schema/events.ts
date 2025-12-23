import {
    mysqlTable,
    varchar,
    text,
    datetime,
    boolean,
    int,
    decimal,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const events = mysqlTable("events", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    location: varchar("location", { length: 255 }),

    ticketSold: int("ticket_sold", { unsigned: true }).default(0).notNull(),
    totalTickets: int("total_tickets", { unsigned: true }).notNull(),

    eventStatus: varchar("event_status", { length: 50 }).notNull(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    eventTag: varchar("event_tag", { length: 50 }),

    eventAttendees: int("event_attendees", { unsigned: true }).default(0).notNull(),

    eventRevenue: decimal("event_revenue", { precision: 12, scale: 2 })
        .default("0.00")
        .notNull(),

    startAt: datetime("start_at", { mode: "date" }).notNull(),
    endAt: datetime("end_at", { mode: "date" }).notNull(),

    isPublished: boolean("is_published").default(false).notNull(),

    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .default(sql`(CURRENT_TIMESTAMP(3))`)
        .notNull(),

    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .default(sql`(CURRENT_TIMESTAMP(3))`)
        .$onUpdate(() => new Date())
        .notNull(),
});