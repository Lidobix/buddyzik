import bcrypt from "bcrypt";
import "dotenv/config";
import { fetchOne } from "./manageDatas.js";
import jwt from "jsonwebtoken";

export const hash = (toHash) => {
  // console.log("password à crypter: ", toHash);
  return bcrypt.hashSync(toHash, 10);
};

export const checkHash = (toCheck, reference) => {
  // console.log("password à checker: ", toCheck);
  // console.log("password de ref: ", reference);
  return bcrypt.compareSync(toCheck, reference);
};

export const createToken = (uuid, password) => {
  // le pwd est crypté quand il arrive ici
  return jwt.sign(
    {
      // mailAddress: buddy.password,
      id: uuid,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      // expiresIn: 3600,
      // subject: buddy.uuid,
      subject: password,
    }
  );
};

export function authToken(token, uuid) {
  try {
    if (jwt.verify(token, process.env.JWT_PRIVATE_KEY)) {
      return true;
    } else {
      console.log("le token est non valide");
      return false;
    }
  } catch (error) {
    console.log("problème de token");
    return false;
  }
}
