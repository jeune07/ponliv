const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;
const connectToDb = async ()=>{
    if(db) return db;
    const client =new MongoClient(process.env.MONGOURL);
    try{
        await client.connect();
        db=client.db(process.env.PON_LIV);
        console.log('connected to Atlas');
        return db;
    }catch(err){
        console.error('MongoDB Atlas connection erro', err.message);
        throw err;
    }
}

module.exports= connectToDb