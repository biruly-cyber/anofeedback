import mongoose from "mongoose";

type ConnectionObject = {
    isConnect?: number
}


const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    if(connection.isConnect){
        console.log("Already connected to database");
        return
    }

    try {
       const db =  await mongoose.connect(process.env.MONGO_URI || '', {})

       console.log(db)
       connection.isConnect = db.connections[0].readyState
       console.log("DB connected successfully")
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }

}


export  default dbConnect