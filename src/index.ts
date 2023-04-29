import express from 'express';
import mongoose from 'mongoose';
import EventEmitter from 'events';
import { auth } from 'express-oauth2-jwt-bearer';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const app = express();
const port = process.env.PORT || 8080; // default port to listen

const db = 'mongodb://gw2pvp-database:27018/ssp';
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));


const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });

// enforce on all endpoints
app.use(checkJwt);

// This route doesn't need authentication
app.get('/api/public', (req, res) => {
    res.json({
        message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
    });
});

// This route needs authentication
app.get('/api/private', checkJwt, (req, res) => {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
});

//peridoically query ArenaNet gw2 api for information
const requestAnetEmitter = new EventEmitter(); // instantiate an emitter
const requestResults = requestAnetResults(requestAnetEmitter);
let socketConnections = 0;

const io = require('socket.io')(app);
io.on('connection', () => { 
    socketConnections += 1;

    if (socketConnections === 1) {
        requestResults('start');
    }

    // listen for events
    requestAnetEmitter.on('update', (ret) => {
        // if (!(ret.serverId in lastEquipmentUpdate)) {
        //   lastEquipmentUpdate[ret.serverId] = null;
        // }
        // lastEquipmentUpdate[ret.serverId] = ret;
    
        io.emit('update_' + ret._id, ret);
    });
    
    io.on('disconnect', () => {
        socketConnections = Math.max(0, socketConnections - 1);
        if (socketConnections < 1) {
            requestResults('stop');
        }
    });
});