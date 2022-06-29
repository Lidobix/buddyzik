import { fetchOne, updateUno } from "./manageDatas.js";
import { checkHash, createToken, hash } from "./security.js";

export async function loginProcess(request) {
  const user = {
    mailAddress: request.mailAddress,
    password: request.password,
  };
  try {
    const buddy = await fetchOne({ mailAddress: user.mailAddress });

    const newToken = createToken(buddy.uuid, hash(buddy.password)).toString();

    await updateUno(
      { mailAddress: user.mailAddress },
      { $set: { token: newToken } }
    );

    if (buddy === null || !checkHash(user.password, buddy.password)) {
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
  }
}
