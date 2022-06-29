import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoClient = new MongoClient(process.env.DB_URL);
const collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.DB_COL_USER);

export async function fetchOne(query, projection) {
  console.log("fetchOne on va chercher les infos....");
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
export async function fetchSome(query, projection) {
  console.log("fetchSome, on va chercher les infos....");
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection
        .find(query, projection)
        .toArray()
        .then((datas) => {
          resolve(datas);
        });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUno(query, update) {
  console.log("ça va promettre un updateUno....");
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

export async function updateSome(query, update) {
  console.log("ça va promettre un updateSome....");
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection.updateMany(query, update).then((datas) => {
        resolve(datas);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function insertUno(document) {
  console.log("ça va promettre un insertUno....");
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection.insertOne(document).then((datas) => {
        resolve(datas);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
