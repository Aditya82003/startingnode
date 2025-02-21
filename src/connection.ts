import mongoose from 'mongoose';

async function mongoDbConnection(url:string){
    return mongoose.connect(url) 
}

export {
    mongoDbConnection
}