import mongoose from "mongoose";
import "dotenv/config";
const dbConnection = async()=>{
  try{
    // await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database ${mongoose.connection.name} connected.`);
  }catch(err){
    console.error("Error while connecting to database :",err);  
    process.exit(1);
  }
}

export default dbConnection;