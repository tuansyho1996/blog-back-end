import express from 'express'
import routes from './routes/index.js'
import connectDB from './dbs/db.init.blog.js'
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

// import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

// app.use(cookieParser())

// init middleware
const allowedOrigins = ['http://localhost:3001', 'http://localhost:5174'];
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH,OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,X-Client-Id');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    // Pass to next layer of middleware
    next();
});
app.use(morgan('combined'))

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// init db
connectDB()

// init router
app.use('/', routes)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        stack: error.stack,
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

// handling error

export default app