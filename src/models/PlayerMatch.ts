import { Schema, connection } from "mongoose";

const schema = new Schema({
  user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  match_ref: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  map_id: {
    type: String,
    require: true,
  },
  started: {
    type: String,
    require: true,
  },
  ended: {
    type: String,
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
})

export const PlayerMatch = connection.model("PlayerMatch", schema);
