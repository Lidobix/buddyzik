import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoClient = new MongoClient(process.env.DB_URL);
const collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.DB_COL_USER);

export async function fetchOne(query, projection) {
  console.log("on va chercher les infos....");
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection.findOne(query, projection).then((datas) => {
        resolve(datas);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateOne(query, update) {
  console.log("ça va promettre un update....");
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection.updateOne(query, update).then((datas) => {
        resolve(datas);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
