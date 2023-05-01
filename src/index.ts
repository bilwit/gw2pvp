import express from 'express';
import mongoose from 'mongoose';
import EventEmitter from 'events';
import helmet from 'helmet';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { requestAnet } from './services/requestAnet';
import cors from 'cors';
import { userRouter } from './routes/user';

// load .env variables
dotenv.config();

// start mongo database
const db = 'mongodb://gw2pvp-database:27018/ssp';
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// start express backend server
const app = express();
const port = process.env.PORT || 8080; // default port to listen

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
        // origin: CLIENT_ORIGIN_URL,
        methods: ["GET"],
        allowedHeaders: ["Authorization", "Content-Type"],
        maxAge: 86400,
    })
);

app.use((req, res, next) => {
    res.contentType("application/json; charset=utf-8");
    next();
});

const apiRouter = express.Router();
app.use("/api", apiRouter);
userRouter.use("/user", userRouter);

// start the Express server (HTTP)
app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
});

// peridoically query ArenaNet gw2 api for match information
const requestAnetEmitter = new EventEmitter(); // instantiate an emitter
const requestAnetWrapper = requestAnet(requestAnetEmitter);
requestAnetWrapper('start');

const io = require('socket.io')(app);
io.on('connection', () => { 
    // listen for events
    requestAnetEmitter.on('update', (ret) => {
        io.emit(ret.user_id, ret);
    });
    
    io.on('disconnect', () => {
        null;
    });
});