"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMatch = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user_ref: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    match_ref: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },
    map_id: {
        type: String,
        require: true,
    },
    started: {
        type: Date,
        require: true,
    },
    ended: {
        type: Date,
        require: true,
    },
    result: {
        type: String,
        require: true,
    },
    team: {
        type: String,
        require: true,
    },
    profession: {
        type: String,
        require: true,
    },
    scores: {
        red: {
            type: String,
            require: true,
        },
        blue: {
            type: String,
            require: true,
        },
    },
    rating_type: {
        type: String,
        require: true,
    },
    rating_change: {
        type: Number,
        require: true,
    },
    season: {
        type: String,
        require: true,
    },
});
exports.PlayerMatch = mongoose_1.connection.model("PlayerMatch", schema);
//# sourceMappingURL=PlayerMatch.js.map