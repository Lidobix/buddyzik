import bcrypt from "bcrypt";
import "dotenv/config";

import jwt from "jsonwebtoken";

export const hash = (toHash) => {
  return bcrypt.hashSync(toHash, 10);
};

export const checkHash = (toCheck, reference) => {
  return bcrypt.compareSync(toCheck, reference);
};

export const createToken = (uuid, password) => {
  return jwt.sign(
    {
      id: uuid,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      subject: password,
    }
  );
};

export function authToken(token) {
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
