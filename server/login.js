import { fetchOne, updateUno } from "./manageDatas.js";
import { checkHash, createToken, hash } from "./security.js";

export async function loginProcess(request) {
  try {
    const buddy = await fetchOne(
      { mailAddress: request.mailAddress },
      { projection: { _id: 0, uuid: 1, password: 1 } }
    );

    const newToken = createToken(buddy.uuid, hash(buddy.password)).toString();

    await updateUno(
      { mailAddress: request.mailAddress },
      { $set: { token: newToken } }
    );

    if (buddy === null || !checkHash(request.password, buddy.password)) {
      return {
        status: 200,
        content: {
          success: false,
          message: "Login ou password erroné",
        },
      };
    } else {
      delete buddy.password;
      delete buddy.mailAddress;
      delete buddy.token;

      return {
        status: 200,
        content: {
          success: true,
          user: buddy,
          message: "Vous êtes connecté, bonne navigation!",
          token: newToken,
        },
      };
    }
  } catch (error) {
    console.log("Pas d'utilisateur trouvé, error: ", error);
    return {
      status: 200,
      content: {
        success: false,
        message: "Adresse mail inconnue",
      },
    };
  }
}
