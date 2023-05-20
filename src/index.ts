import express from 'express';
import mongoose from 'mongoose';
import EventEmitter from 'events';
import helmet from 'helmet';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { requestAnet } from './services/requestAnet';
import cors from 'cors';
import { userRouter } from './routes/user';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { auth } from 'express-oauth2-jwt-bearer';

// load .env variables
dotenv.config();

if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

// start mongo database
const db = 'mongodb://gw2pvp-database:27017/gw2pvp';
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// start express backend server
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080; // default port to listen

const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

app.use(
    auth({
        audience: process.env.AUDIENCE,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
    })
);

app.set("json spaces", 2);
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use((req, res, next) => {
    res.contentType("application/json; charset=utf-8");
    next();
});

app.use("/api/user", userRouter);

// start the Express server (HTTP)
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${ PORT }`);
});

// peridoically query ArenaNet gw2 api for match information
const requestAnetEmitter = new EventEmitter(); // instantiate an emitter
const requestAnetWrapper = requestAnet(requestAnetEmitter);
requestAnetWrapper('start');

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', () => {
    // listen for events
    requestAnetEmitter.on('update', (ret) => {
        io.emit(ret.user_id, ret);
    });

    io.on('disconnect', () => {
        console.log('disconnect');
    });
});