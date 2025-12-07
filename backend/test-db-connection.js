// Quick database connection test
// Run with: node test-db-connection.js

const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...\n');

    // Show connection details (without password)
    console.log('Connection Details:');
    console.log('- Host:', process.env.DB_HOST || 'localhost');
    console.log('- Port:', process.env.DB_PORT || '5432');
    console.log('- Database:', process.env.DB_NAME);
    console.log('- User:', process.env.DB_USER);
    console.log('- Password:', process.env.DB_PASSWORD ? '***SET***' : '❌ NOT SET');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '***SET***' : '❌ NOT SET');
    console.log('');

    // Try connection
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ DATABASE CONNECTION SUCCESSFUL!\n');
        console.log('Current Time:', result.rows[0].current_time);
        console.log('PostgreSQL Version:', result.rows[0].pg_version.split(',')[0]);

        // Test tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        console.log('\n📋 Tables in database:');
        if (tables.rows.length === 0) {
            console.log('❌ No tables found! Run migrations: npm run migrate');
        } else {
            tables.rows.forEach(row => console.log('  -', row.table_name));
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ DATABASE CONNECTION FAILED!\n');
        console.error('Error:', error.message);
        console.error('\nPossible issues:');
        console.error('1. PostgreSQL is not running');
        console.error('2. Wrong credentials in .env file');
        console.error('3. Database does not exist');
        console.error('4. Firewall blocking connection');

        await pool.end();
        process.exit(1);
    }
}

testConnection();
