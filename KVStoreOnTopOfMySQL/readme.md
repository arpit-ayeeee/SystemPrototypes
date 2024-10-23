## SQL
    CREATE TABLE IF NOT EXISTS Store (
        `key` VARCHAR(128) NOT NULL PRIMARY KEY,  -- Primary key with max length of 128 characters
        `value` TEXT,                             -- Store value as BLOB, or use TEXT if the data is textual
        expiresAt DATETIME                        -- Expiration datetime for each key
    );

## Work left
- Write cron job, to implement ttl, delete the entires from db in bacthes, whose expiresAr is less than cuuTime