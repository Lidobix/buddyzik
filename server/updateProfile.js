// console.log("dans le middleware updateprofile");

import { counter, fetchOne, updateSome, updateUno } from "./manageDatas.js";
import { checkHash, createToken, hash } from "./security.js";
import cloudinary from "cloudinary";

async function checkInformations(myPreviousInfos, myNewInfos) {
  try {
    const isMailValid = await checkMailAddress(
      myNewInfos.mailAddress.toLowerCase(),
      myPreviousInfos.mailAddress
    );

    const isPasswordValid = checkPassword(
      myNewInfos.password,
      myPreviousInfos.password
    );

    return { mailAddress: isMailValid, password: isPasswordValid };
  } catch (error) {
    console.log("Pas d'utilisateur trouvé", error);
  }
}

const checkPassword = function (toCheck, reference) {
  if (!checkHash(toCheck, reference)) {
    return false;
  } else {
    return true;
  }
};

const checkMailAddress = async function (toCheck, reference) {
  const check = await counter({
    mailAddress: toCheck,
  });

  if (toCheck != reference && check >= 1) {
    return false;
  } else {
    return true;
  }
};

async function updateProfile(myNewInfos, headers) {
  if (myNewInfos.passwordModif != "") {
    myNewInfos.password = myNewInfos.passwordModif;
  }

  myNewInfos.password = hash(myNewInfos.password);
  const newToken = createToken(headers.uuid, myNewInfos.password);

  const toUpdate = {
    login: myNewInfos.login,
    password: myNewInfos.password,
    mailAddress: myNewInfos.mailAddress.toLowerCase(),
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
  };

  if (myNewInfos.profilePicture != null) {
    await cloudinary.v2.uploader
      .upload(myNewInfos.profilePicture, {
        ressource: "image",
        eager: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
      })
      .then((result) => {
        toUpdate.profilePicture = result.eager[0].secure_url;
      })
      .catch((error) => {
        console.log("error", JSON.stringify(error, null, 2));
      });
  }

  await updateUno(
    {
      uuid: headers.uuid,
    },
    {
      $set: toUpdate,
    }
  );

  await updateSome(
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
        "friends.$.profilePicture": myNewInfos.profilePicture,
      },
    }
  );

  return { message: "Modifications enregistrées!", token: newToken };
}

export async function updateProfileProcess(myNewInfos, headers) {
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

  const validation = await checkInformations(myPreviousInfos, myNewInfos);

  if (validation.mailAddress && validation.password) {
    const response = await updateProfile(myNewInfos, headers);
    response.success = true;
    return { status: 200, content: response };
  }

  if (!validation.password || !validation.mailAddress) {
    const response = {
      message:
        "Mot de passe ou adresse mail incorrect, veuillez vérifier vos informations",
      success: false,
    };
    return { status: 200, content: response };
  }
}
