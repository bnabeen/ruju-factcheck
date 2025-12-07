import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
import config from '../config/env';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export class UserModel {
    static async create(email: string, password: string, fullName: string): Promise<User> {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, email, full_name, role, created_at, updated_at`,
            [email, passwordHash, fullName]
        );

        return result.rows[0];
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT id, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );

        return result.rows[0] || null;
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateToken(user: User): string {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const secret = config.jwt.secret || 'default_secret_key';
        
        return jwt.sign(payload, secret, {
            expiresIn: config.jwt.expiresIn || '7d',
        } as SignOptions);
    }
}
