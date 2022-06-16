import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const key = process.env.JWT_PRIVATE_KEY;

export const hash = (toHash) => {
  // console.log("password à crypter: ", toHash);
  return bcrypt.hashSync(toHash, 10);
};

export const checkHash = (toCheck, reference) => {
  // console.log("password à checker: ", toCheck);
  // console.log("password de ref: ", reference);
  return bcrypt.compareSync(toCheck, reference);
};

export const createToken = (buddy) => {
  // Création du token CSRF
  // const xsrfToken = crypto.randomBytes(64).toString("hex");
  // console.log(xsrfToken);
  return jwt.sign(
    {
      mailAddress: buddy.password,
    },
    key,
    {
      // expiresIn: 3600,
      subject: buddy.uuid,
    }
  );
};

export const authToken = (token) => {
  // console.log("je checke le token)");
  // console.log(token != undefined);
  if (token != undefined) {
    try {
      if (jwt.verify(token, key)) {
        // console.log("le token est valide");
        return true;
      } else {
        // console.log("le token est non valide");
        return false;
      }
    } catch (error) {
      console.log("problème de token");
      return false;
    }
  } else {
    console.log("le token est undefined");
    return false;
  }
};
