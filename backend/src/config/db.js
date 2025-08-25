import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();
export const connectDb=async()=>{
    try{
    const url=process.env.MONGO_URI;
     const connection=await mongoose.connect(url);
     console.log("mongodb connected");

    }
    catch(error){
        console.log("not connected");
    }

}