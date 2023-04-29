import { Schema, connection } from "mongoose";

const schema = new Schema({
  match_id: {
    type: String,
    require: true,
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  started: {
    type: String,
    require: true,
  },
  ended: {
    type: String,
    require: true,
  },
})

export const Match = connection.model("Match", schema);