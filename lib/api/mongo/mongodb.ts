import { MongoClient, MongoClientOptions } from "mongodb";

declare global {
    var mongoClient: MongoClient | undefined;
}

const mongoCache = global

let mongoClient = mongoCache.mongoClient
let clientPromise: Promise<MongoClient> | MongoClient

if(mongoClient){

    clientPromise = mongoClient
    
}else{
    const uri: string = String(process.env.MONGODB_URI)

    const options: MongoClientOptions = {}

    let client: MongoClient
    

    //need to add line for check for env variables


    client = new MongoClient(uri,options)
    //console.log('client',client)
    clientPromise = client.connect()
    //console.log('clientPromise',clientPromise)

}


export default clientPromise




