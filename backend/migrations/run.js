const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function runMigrations() {
    const client = await pool.connect();

    try {
        console.log('Running migrations...');

        // Path to the folder that contains .sql files
        const migrationsDir = __dirname;

        // Read all .sql files in alphabetical order
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // ensures 001_ runs before 002_

        await client.query('BEGIN');

        for (const file of migrationFiles) {
            const fullPath = path.join(migrationsDir, file);
            console.log(`Running: ${file}`);

            const sql = fs.readFileSync(fullPath, 'utf8');
            await client.query(sql);
        }

        await client.query('COMMIT');

        console.log('All migrations completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
