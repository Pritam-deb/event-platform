CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255),
	`ticket_sold` int unsigned NOT NULL DEFAULT 0,
	`total_tickets` int unsigned NOT NULL,
	`event_status` varchar(50) NOT NULL,
	`event_type` varchar(50) NOT NULL,
	`event_tag` varchar(50),
	`event_attendees` int unsigned NOT NULL DEFAULT 0,
	`event_revenue` decimal(12,2) NOT NULL DEFAULT '0.00',
	`start_at` datetime NOT NULL,
	`end_at` datetime NOT NULL,
	`is_published` boolean NOT NULL DEFAULT false,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
