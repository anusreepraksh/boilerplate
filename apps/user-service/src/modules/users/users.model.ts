import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema;

const User = new Schema({
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  gender: String,
});

export const UserModel = mongoose.model("User", User, "User");
