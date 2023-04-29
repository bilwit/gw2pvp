import { Schema, connection } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  apiKey: {
    type: String,
    require: true,
  },
})

export const User = connection.model("User", schema);