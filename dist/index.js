"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = __importDefault(require("events"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const requestAnet_1 = require("./services/requestAnet");
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
// load .env variables
dotenv.config();
// start mongo database
const db = 'mongodb://gw2pvp-database:27017/gw2pvp';
mongoose_1.default
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));
// start express backend server
const app = (0, express_1.default)();
const port = process.env.PORT || 8080; // default port to listen
app.use((0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
}));
app.set("json spaces", 2);
app.use((0, helmet_1.default)({
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
}));
app.use((0, cors_1.default)({
    // origin: CLIENT_ORIGIN_URL,
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
}));
app.use((req, res, next) => {
    res.contentType("application/json; charset=utf-8");
    next();
});
const apiRouter = express_1.default.Router();
app.use("/api", apiRouter);
user_1.userRouter.use("/user", user_1.userRouter);
// start the Express server (HTTP)
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
// peridoically query ArenaNet gw2 api for match information
const requestAnetEmitter = new events_1.default(); // instantiate an emitter
const requestAnetWrapper = (0, requestAnet_1.requestAnet)(requestAnetEmitter);
requestAnetWrapper('start');
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
io.on('connection', () => {
    // listen for events
    requestAnetEmitter.on('update', (ret) => {
        io.emit(ret.user_id, ret);
    });
    io.on('disconnect', () => {
        console.log('disconnect');
    });
});
//# sourceMappingURL=index.js.map