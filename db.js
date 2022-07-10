import mongoose from 'mongoose';


const CONNECT_DB = async(DATABASE_URL) =>{
    try {
        const DB_OPTION = {
            dbName : "practice"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTION);
        console.log("connected to mongoose successfully");
    } catch (error) {
        console.log(error.message);
    }
}
export default CONNECT_DB;
