import mongoose from "mongoose";

// Define a connection object to track the state of the connection
const connection: { isConnected?: boolean } = {};

// Function to connect to MongoDB using Mongoose
export const connectToDB = async (): Promise<string> => {
  try {
    // Check if MongoDB URL is provided in environment variables
    const mongoUrl = process.env.MONGO_URL;
    console.log(mongoUrl);

    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    // Return early if already connected
    if (connection.isConnected) {
      return "Already connected to MongoDB";
    }

    // Connect to MongoDB
    const db = await mongoose.connect(mongoUrl);

    // Update the connection state
    connection.isConnected = db.connections[0].readyState === 1;

    // Log the connection object (for debugging purposes)
    console.log(connection);

    // Return success message
    return "Connected to MongoDB";
  } catch (error) {
    // Log and throw the error for further handling
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
};
