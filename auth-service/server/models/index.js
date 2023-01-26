import mongoose from "mongoose";
import User from "./user.model";

const connectDB = () => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

  const connectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

  mongoose.set("strictQuery", false);

  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const models = { User };

export { connectDB };

export default models;
