import express from 'express';
import cors from 'cors';
//import xss from 'xss-clean';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

export default [
    express.json({ limit: '2mb' }),
    express.urlencoded({ extended: true, limit: '2mb' }),
    compression(),
    cookieParser(),
    cors({
        origin: true,
        methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
            'x-now-id',
            'x-now-trace',
            'x-powered-by',
            'Origin',
            'Accept',
            'Content-Type',
            'Set-Cookie',
            'Authorization',
        ],
        credentials: true,
    }),
    helmet(),
    morgan('tiny'),
    //xss(),
];
