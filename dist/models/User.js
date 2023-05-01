"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        require: true,
    },
    apiKey: {
        type: String,
        require: true,
    },
});
exports.User = mongoose_1.connection.model("User", schema);
//# sourceMappingURL=User.js.map