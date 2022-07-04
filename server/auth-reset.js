import { fetchOne, updateUno } from "./manageDatas.js";
import { passwordGenerator } from "./auth-gen.js";
import { lostPasswordMail } from "./mailing.js";
import { hash, createToken } from "./security.js";

export async function resetPasswordProcess(mailAddress) {
  const response = {};
  try {
    const uuid = await fetchOne(
      { mailAddress: mailAddress },
      { projection: { _id: 0, uuid: 1 } }
    );

    if (null != uuid) {
      const newRawPwd = passwordGenerator();
      const newPwd = hash(newRawPwd);

      const newToken = createToken(uuid, newPwd);

      await updateUno(
        { mailAddress: mailAddress },
        {
          $set: {
            password: newPwd,
            token: newToken,
          },
        }
      );

      lostPasswordMail(mailAddress, newRawPwd);

      response.status = 200;
      response.message =
        "Un mail contenant votre nouveau de passe vous a été envoyé.";

      return response;
    } else {
      response.status = 200;
      response.message = "aucun compte associé à ce mail";
      return response;
    }
  } catch (error) {
    console.log(error);
    response.status = 200;
    response.message = "Une erreur s'est produite";
    return response;
  }
}
