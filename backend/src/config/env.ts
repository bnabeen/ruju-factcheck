import dotenv from 'dotenv';
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    gemini: {
        apiKey: string;
    };
    cors: {
        origin: string;
    };
    upload: {
        maxFileSize: number;
        uploadDir: string;
    };
}

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'ruju_factcheck',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '82731c5331b0c542a9422ad9278fd25b0cd90b38be86d3b11fa649c97ee991ca',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
    },
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
        uploadDir: process.env.UPLOAD_DIR || './uploads',
    },
};

export default config;
