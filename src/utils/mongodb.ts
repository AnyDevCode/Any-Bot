import mongoose from "mongoose";
const { MONGODB_URL } = process.env;
if(MONGODB_URL === undefined) throw new Error("MONGODB_URL is not defined");
import path from "node:path";

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URL)

import settings from "./models/settings";
import users from "./models/users";
import warns from "./models/warns";

// Load all models
export = {
    settings,
    users,
    warns
}
