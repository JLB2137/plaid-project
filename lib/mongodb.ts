import { MongoClient, MongoClientOptions } from "mongodb";

const uri: string = String(process.env.MONGO_DB)

const options: MongoClientOptions = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

//need to add line for check for env variables

client = new MongoClient(uri,options)
clientPromise = client.connect()

export default clientPromise;

