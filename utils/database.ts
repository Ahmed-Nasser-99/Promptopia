import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: process.env.MONGODB_DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    isConnected = true;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB: ", error);
  }
};
