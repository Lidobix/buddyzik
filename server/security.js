import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const key =
  "MIIFljCCBH6gAwIBAgIIIP7GMO9cWzYwDQYJKoZIhvcNAQELBQAwgZYxCzAJBgNVBAYTAlVTMRMwEQYDVQQKDApBcHBsZSBJbmMuMSwwKgYDVQQLDCNBcHBsZSBXb3JsZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9uczFEMEIGA1UEAww7QXBwbGUgV29ybGR3aWRlIERldmVsb3BlciBSZWxhdGlvbnMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMTcwNDI5MDMzMDA4WhcNMTgwNDI5MDMzMDA4WjCBiTEaMBgGCgmSJomT8ixkAQEMCk1ENFA0UTg1WlExMzAxBgNVBAMMKmlQaG9uZSBEZXZlbG9wZXI6IGFtbW1pIGFtbW1pIChXM1BSS1JDVDRRKTETMBEGA1UECwwKVktRNTZVQ0c4ODEUMBIGA1UECgwLYW1tbWkgYW1tbWkxCzAJBgNVBAYTAlVTMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwudboPuPnImOssBCw9vISRnnivreVwOuDAu77u47zIU8uTagbzktX6pF54YToSLQHeOaNNQfZ7idccU2DKVBr3etz/++ca4HNadeUaEm2VWW4kEq3iKIo1wZZhJJR6bQl4q797U0+f7eEXLKD4fjfidEF+ceAxAsX5YIuokq3K/B+XW3tKk7D4nCaaCyJ9";

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
    process.env.KEY || key,
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
      if (jwt.verify(token, process.env.KEY || key)) {
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
