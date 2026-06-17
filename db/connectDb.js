

import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/patreon');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    // ❌ NEVER USE process.exit() in Next.js
  }
};

export default connectDb;
