import { fetchOne, insertUno } from "./manageDatas.js";
import { createToken, hash } from "./security.js";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import { registerMail } from "./mailing.js";

export async function registrationProcess(newUser) {
  try {
    const testPresence = await fetchOne({
      mailAddress: newUser.mailAddress.toLowerCase(),
    });

    if (testPresence === null) {
      const newBuddy = {
        uuid: uuidv4(),
        login: newUser.login,
        mailAddress: newUser.mailAddress.toLowerCase(),
        firstName: newUser.firstName,
        password: hash(newUser.password),
        lastName: newUser.lastName,
        gender: newUser.gender,
        birthDate: newUser.birthDate,
        location: newUser.location,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
        role: "user",
        connected: true,
        status: "unknown",
        friends: [],
        friends_list: [],
        wall: [],
        messager: {},
        instrument: newUser.instrument,
        style: newUser.style,
        group: newUser.group,
        singer: newUser.singer,
        pro: newUser.pro,
        recommendedBy: [],
        recommends: [],
      };

      await cloudinary.v2.uploader
        .upload(newUser.profilePicture, {
          ressource: "image",
          eager: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
        })
        .then((result) => {
          newBuddy.profilePicture = result.eager[0].secure_url;
        })
        .catch((error) => {
          console.log("error", JSON.stringify(error, null, 2));
        });

      const newToken = createToken(newBuddy.uuid, newBuddy.password).toString();
      newBuddy.token = newToken;

      registerMail(newBuddy.mailAddress, newBuddy.firstName);

      await insertUno(newBuddy);

      delete newBuddy.password;
      delete newBuddy.mailAddress;
      delete newBuddy.token;

      return {
        status: 200,
        content: {
          success: true,
          user: newBuddy,
          token: newToken,
          expiresIn: 3600,
          message: "Vous êtes bien inscrit, bonne navigation!",
        },
      };
    } else {
      return {
        status: 200,
        content: {
          success: false,
          message: "Données incorrectes, impossible de vous inscrire!",
        },
      };
    }
  } catch (error) {
    console.log("Pas d'utilisateur trouvé", error);
  }
}
