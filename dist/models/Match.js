"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    match_id: {
        type: String,
        require: true,
    },
    players: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
    started: {
        type: Date,
        require: true,
    },
    ended: {
        type: Date,
        require: true,
    },
});
exports.Match = mongoose_1.connection.model("Match", schema);
//# sourceMappingURL=Match.js.map