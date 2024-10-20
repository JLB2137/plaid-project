import { MongoClient, MongoClientOptions } from "mongodb";

const uri: string = String(process.env.MONGODB_URI)

const options: MongoClientOptions = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

//need to add line for check for env variables

client = new MongoClient(uri,options)
//console.log('client',client)
clientPromise = client.connect()
//console.log('clientPromise',clientPromise)

export default clientPromise




