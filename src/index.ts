import express from 'express';
import mongoose from 'mongoose';
import EventEmitter from 'events';
import { auth } from 'express-oauth2-jwt-bearer';
// import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 8080; // default port to listen

const jwtCheck = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });

// enforce on all endpoints
app.use(jwtCheck);

// define a route handler for the default home page
app.get( '/', ( req, res ) => {
    res.send( 'Hello world!' );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
