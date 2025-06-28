/** A notification in the server. */
export interface Notification {
    /** Category code for this notification. */
    code?: number;
    /** Content of the notification in JSON. */
    content?: {};
    /** The UNIX time when the notification was created. */
    create_time?: string;
    /** ID of the Notification. */
    id?: string;
    /** True if this notification was persisted to the database. */
    persistent?: boolean;
    /** ID of the sender, if a user. Otherwise 'null'. */
    sender_id?: string;
    /** Subject of the notification. */
    subject?: string;
}
