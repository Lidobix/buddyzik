// console.log("dans le middleware updateprofile");

import { counter, fetchOne, updateSome, updateUno } from "./manageDatas.js";
import { checkHash, createToken, hash } from "./security.js";

// console.log("new profile:", req.body);
// const myNewInfos = req.body;
// console.log("newInformations:", myNewInfos);
// const auth = await authToken(req.headers.token, req.headers.uuid)

async function checkInformations(myNewInfos, headers) {
  try {
    console.log("check des infos...");
    // await mongoClient.connect();
    const myPreviousInfos = await fetchOne(
      {
        uuid: headers.uuid,
      },
      {
        projection: {
          _id: 0,
          uuid: 1,
          password: 1,
          mailAddress: 1,
          friends_list: 1,
        },
      }
    );
    // console.log("myPreviousInfos: ", myPreviousInfos);

    const isMailValid = await checkMailAddress(
      myNewInfos.mailAddress,
      myPreviousInfos.mailAddress
    );

    // console.log("isMailValid: ", isMailValid);

    const isPasswordValid = checkPassword(
      myNewInfos.password,
      myPreviousInfos.password
    );
    // console.log("isPasswordValid: ", isPasswordValid);
    return { mailAddress: isMailValid, password: isPasswordValid };
  } catch (error) {
    console.log("Pas d'utilisateur trouvé", error);
  }
}

// const checkPassword = function () {
const checkPassword = function (toCheck, reference) {
  console.log("test pwd");

  if (!checkHash(toCheck, reference)) {
    // res.json(
    //   "Mot de passe incorrect , on ne peut pas faire la modification du profil"
    // );
    return false;
  } else {
    console.log("pasword ok");
    return true;
  }
};

const checkMailAddress = async function (toCheck, reference) {
  console.log("dans le check address");

  //   await mongoClient.connect();
  const check = await counter({
    mailAddress: toCheck,
  });
  console.log("check", check);
  if (toCheck != reference && check >= 1) {
    // res.json("adresse dejà utilisée sur un autre compte");
    console.log("mail nok");
    return false;
  } else {
    console.log("mail ok");
    return true;
  }
};

async function updateProfile(myNewInfos, headers) {
  // si le nouveau mdp est présent, on le crypte, on récupère la dats et on l'envoie en base
  if (myNewInfos.passwordModif != "") {
    console.log("nouveau mot de passe détecté");
    myNewInfos.password = myNewInfos.passwordModif;

    // console.log("new pwd : ", myNewInfos);
  }

  myNewInfos.password = hash(myNewInfos.password);
  const newToken = createToken(headers.uuid, myNewInfos.password);

  updateUno(
    {
      uuid: headers.uuid,
    },
    {
      $set: {
        login: myNewInfos.login,
        password: myNewInfos.password,
        mailAddress: myNewInfos.mailAddress,
        firstName: myNewInfos.firstName,
        lastName: myNewInfos.lastName,
        birthDate: myNewInfos.birthDate,
        location: myNewInfos.location,
        gender: myNewInfos.gender,
        instrument: myNewInfos.instrument,
        singer: myNewInfos.singer,
        pro: myNewInfos.pro,
        style: myNewInfos.style,
        group: myNewInfos.group,
        bio: myNewInfos.bio,
        token: newToken,
      },
    }
  );

  updateSome(
    { $and: [{}, { "friends.uuid": headers.uuid }] },
    {
      $set: {
        "friends.$.login": myNewInfos.login,
        "friends.$.firstName": myNewInfos.firstName,
        "friends.$.lastName": myNewInfos.lastName,
        "friends.$.instrument": myNewInfos.instrument,
        "friends.$.singer": myNewInfos.singer,
        "friends.$.pro": myNewInfos.pro,
        "friends.$.style": myNewInfos.style,
        "friends.$.group": myNewInfos.group,
      },
    }
  );

  return { message: "Modifications enregistrées!", token: newToken };
  //   res
  //     .status(200)
  //     .json({ message: "Modifications enregistrées!", token: newToken });
  // console.log("infos à jour : ", myNewInfos);
  //

  //
}

export async function updateProfileProcess(myNewInfos, headers) {
  const validation = await checkInformations(myNewInfos, headers);

  if (validation.mailAddress && validation.password) {
    console.log("c'est tout bon!!!! on peut soumettre");
    const response = await updateProfile(myNewInfos, headers);
    return { status: 200, content: response };
  }

  if (!validation.password || !validation.mailAddress) {
    const response =
      "Mot de passe ou adresse mail incorrect, veuillez vérifier vos informations";
    return { status: 200, content: response };
  }
  //   if (!validation.mailAddress) {
  //     const content = "adresse dejà utilisée sur un autre compte";
  //   }
}
