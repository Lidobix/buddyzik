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
      // Le compte existe bien dans la DB
      //   const oldPWD = await fetchDatas(
      //     { mailAddress: mailAddress },
      //     { projection: { _id: 0, password: 1 } }
      //   );

      //   console.log("ancien pwd : ", oldPWD.password);
      // On génère un nouveau pwd
      const newRawPwd = passwordGenerator();
      const newPwd = hash(newRawPwd);

      console.log("newRawPwd", newRawPwd);
      console.log("newPwd", newPwd);
      // On génère un nouveau token
      const newToken = createToken(uuid, newPwd);
      // On update la sécu en base:
      await updateUno(
        { mailAddress: mailAddress },
        {
          $set: {
            password: newPwd,
            token: newToken,
          },
        }
      );

      // On envoie le mail
      lostPasswordMail(mailAddress, newRawPwd);

      response.status = 200;
      response.json = "Un mail vous a été envoyé.";

      return response;
    } else {
      response.status = 200;
      response.json = "aucun compte associé à ce mail";
      return response;
    }
  } catch (error) {
    console.log(error);
    response.status = 200;
    response.json = "Une erreur s'est produite";
    return response;
  } finally {
    // return response;
  }
}
