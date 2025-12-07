// Quick script to create admin user - run in backend directory
// Usage: node create-admin-quick.js

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
    const email = 'admin@ruju.com';
    const password = 'admin123';
    const fullName = 'Admin User';
    const role = 'admin';

    try {
        console.log('Hashing password...');
        const passwordHash = await bcrypt.hash(password, 10);

        console.log('Creating admin user...');
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, role)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) 
             DO UPDATE SET password_hash = $2, role = $4
             RETURNING id, email, full_name, role`,
            [email, passwordHash, fullName, role]
        );

        console.log('\n✅ SUCCESS! Admin user created/updated!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Email:    ', result.rows[0].email);
        console.log('Password: ', password);
        console.log('Role:     ', result.rows[0].role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        await pool.end();
        process.exit(1);
    }
}

createAdmin();
