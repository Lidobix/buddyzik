import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoClient = new MongoClient(process.env.DB_URL);
const collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.DB_COL_USER);

export async function fetchOne(query, projection) {
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
export async function counter(query) {
  try {
    await mongoClient.connect();
    return new Promise((resolve, reject) => {
      collection.count(query).then((datas) => {
        resolve(datas);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
