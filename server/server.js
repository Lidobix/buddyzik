import express from "express";
// import { Request, Response } from "express";
import bodyParser from "body-parser";
// import { authToken, createToken } from "./security.js";
// import { passwordGenerator } from "./auth-gen.js";
import { resetPasswordProcess } from "./auth-reset.js";
import { fetchSome } from "./manageDatas.js";
// import { fetchDatas } from "./fetchDatas.js";
import { invitationUpdateDataBase } from "./invitationBuddy.js";
import { invitationRecoUpdateDataBase } from "./invitationBuddyReco.js";
import {
  registerMail,
  invitationMail,
  recommendationMail,
  lostPasswordMail,
} from "./mailing.js";
import cors from "cors";
import { authToken, createToken, hash, checkHash } from "../server/security.js";

import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import path from "path";
// import cookieParser from "cookie-parser";
// import expressSession from "express-session";
// import sessionFileStore from "session-file-store";

import "dotenv/config";
// import { dirname } from "path";
import { fileURLToPath } from "url";
import { recommendationUpdateDataBase } from "./recommendationBuddy.js";
import cloudinary from "cloudinary";
import { deletionBuddyProcess } from "./deleteBuddy.js";
import { confirmationProcess } from "./confirmationInvitaionBuddy.js";
const app = express();
app.use(cors());

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

/////////////////////////////////////////////////
////////////////// POUR LA PROD //////////////////
/////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, "/../dist/buddyzik")));

app.use(
  "/images",
  express.static(
    path.join(__dirname, "..", "dist", "buddyzik", "assets", "images")
  )
);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/buddyzik/index.html"));
// });

///////////////////////////////////////////////////
///////////////// POUR LE DEV /////////////////////
///////////////////////////////////////////////////
// console.log(path.join(__dirname, "..", "src", "assets", "images"));
// app.use(express.static(path.join(__dirname, "/../src/app/assets")));

// app.use(
//   "/images",
//   express.static(path.join(__dirname, "..", "src", "assets", "images"))
// );

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

// app.use(cookieParser());

// const ExpressSessionFileStore = sessionFileStore(expressSession);
// const fileStore = new ExpressSessionFileStore({
//   path: "./sessions",
//   ttl: 3600,
//   retries: 10,
//   secret: "Mon super secret!",
// });

// app.use(
//   expressSession({
//     store: fileStore,
//     secret: "mon secret de session",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

const mongoClient = new MongoClient(process.env.DB_URL);
const collection = mongoClient
  .db(process.env.DB_NAME)
  .collection(process.env.DB_COL_USER);

const projectionBuddyCard = {
  _id: 0,
  login: 1,
  uuid: 1,
  firstName: 1,
  lastName: 1,
  instrument: 1,
  singer: 1,
  gender: 1,
  profilePicture: 1,
  status: 1,
  recommendedBy: 1,
  recommends: 1,
  group: 1,
  style: 1,
};
// await mongoClient.connect();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const distDir = __dirname + "/dist";
// app.use(express.static(distDir));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// console.log(path.join(__dirname, "src"));
// app.get("/favicon.ico", express.static(path.join(__dirname, "src")));
app.get("/favicon.ico", (req, res) => {
  // Use actual relative path to your .ico file here
  console.log("path : ", __dirname, "../favicon.ico");
  res
    // .header("Access-Control-Allow-Origin' 'http://localhost:3100' always;")
    .sendFile(path.resolve(__dirname, "../favicon.ico"));
});
//////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
/////////TEST///////////////////////////

app.get("/mailtest", (req, res) => {
  console.log("dans le middleware mail test");
  const mail = mailing();
  res.status(200).json("ok");
});

/////////////////////////////////////////////////////////
////////////////////// CHECK TOKEN //////////////////////
/////////////////////////////////////////////////////////
app.get("/auth", (req, res, next) => {
  console.log("dans le middleware auth");

  console.log("authToken: ", authToken(req.headers.token));

  res.status(200).json(authToken(req.headers.token));
});

/////////////////////////////////////////////////////////
///////////////////////// LOGIN /////////////////////////
/////////////////////////////////////////////////////////
// app.get("/auth/login", (req, res) => {
//   // res.json("coucou");
// });

app.post("/login", (req, res) => {
  console.log("login");
  const user = {
    mailAddress: req.body.mailAddress,
    password: req.body.password,
  };

  // console.log(user);
  // console.log(req.headers);

  async function userLoginCheck() {
    try {
      await mongoClient.connect();

      const buddy = await collection.findOne({ mailAddress: user.mailAddress });
      // console.log("buddy : ", buddy);
      const newToken = createToken(buddy.uuid, hash(buddy.password)).toString();
      // console.log("newtoken: ", newToken);
      await collection.updateOne(
        { mailAddress: user.mailAddress },
        { $set: { token: newToken } }
      );

      if (buddy === null || !checkHash(user.password, buddy.password)) {
        res.status(200).json({
          success: false,
          message: "Login ou password erroné",
        });
      } else {
        delete buddy.password;
        delete buddy.mailAddress;
        delete buddy.token;
        res.status(200).json({
          success: true,
          user: buddy,
          message: "Vous êtes connecté, bonne navigation!",
          token: newToken,
          // expiresIn: 3600,
        });
        // res.status(200).cookie("token", newToken).json({
        //   success: true,
        //   user: buddy,
        //   message: "Vous êtes connecté, bonne navigation!",
        //   token: newToken,
        //   // expiresIn: 3600,
        // });
      }
    } catch (error) {
      console.log("Pas d'utilisateur trouvé, error: ", error);
    } finally {
      // await mongoClient.close();
    }
  }

  userLoginCheck();
});
/////////////////////////////////////////////////////////
////////////////////// INSCRIPTION //////////////////////
/////////////////////////////////////////////////////////
app.post("/register", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  async function userRegistration() {
    try {
      await mongoClient.connect();
      // On checke si le mail n'est pas déjà existant dans la base:
      const result = await collection.findOne({
        mailAddress: newUser.mailAddress,
      });
      console.log("resultat de la recherche: ", result);
      console.log(cloudinary.config().buddyzik);

      if (result === null) {
        const newBuddy = {
          uuid: uuidv4(),
          login: newUser.login,
          mailAddress: newUser.mailAddress,
          firstName: newUser.firstName,
          password: hash(newUser.password),
          lastName: newUser.lastName,
          gender: newUser.gender,
          birthDate: newUser.birthDate,
          location: newUser.location,
          profilePicture: newUser.profilePicture,
          bannerPicture: newUser.bannerPicture,
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

        // const thumb = 3;
        // await cloudinary.image(newUser.profilePicture, {
        //   height: 200,
        //   width: 200,
        //   crop: "fit",
        // });

        // console.log("thumb = ", thumb);

        await cloudinary.v2.uploader
          .upload(newUser.profilePicture, {
            ressource: "image",
            eager: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
          })
          .then((result) => {
            newBuddy.profilePicture = result.eager[0].secure_url;
            // console.log("newBuddy.profilePicture", newBuddy.profilePicture);
          })
          .catch((error) => {
            console.log("error", JSON.stringify(error, null, 2));
          });
        const newToken = createToken(
          newBuddy.uuid,
          newBuddy.password
        ).toString();
        newBuddy.token = newToken;
        registerMail(newBuddy.mailAddress, newBuddy.firstName);

        // console.log("newBuddy: ", newBuddy);
        // console.log("newBuddyToClient: ", newBuddyToClient);
        // On colle les champs du euser vers la DB
        await collection.insertOne(newBuddy);
        // On lui attribue un jeton
        console.log(
          "j'efface les données confidentielles avant d'envoyer au client"
        );
        delete newBuddy.password;
        delete newBuddy.mailAddress;
        delete newBuddy.token;
        // console.log("nouveau buddy : ", newBuddy);
        res
          .status(200)
          // .cookie("token", newToken)
          // .cookie("token", newToken, { expires: new Date(Date.now() + 3600) })
          .send({
            success: true,
            user: newBuddy,
            token: newToken,
            expiresIn: 3600,
            message: "Vous êtes bien inscrit, bonne navigation!",
          });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Pas possible de vous inscrire!" });
        // console.log("result:", result);
      }
    } catch (error) {
      console.log("Pas d'utilisateur trouvé", error);
    } finally {
      // Ensures that the client will close when you finish/error
      // await mongoClient.close();
    }
  }
  userRegistration();
});
////////////////////////////////////////////////////////////////////////
//////////////////////////// UPDATE PROFILE ////////////////////////////
////////////////////////////////////////////////////////////////////////

app.post("/updateprofile", (req, res, next) => {
  // console.log("dans le middleware updateprofile");
  // console.log("new profile:", req.body);
  const myNewInfos = req.body;
  console.log("newInformations:", myNewInfos);
  // const auth = await authToken(req.headers.token, req.headers.uuid)
  if (authToken(req.headers.token)) {
    async function checkInformations() {
      try {
        console.log("check des infos...");
        await mongoClient.connect();
        const myPreviousInfos = await collection.findOne(
          {
            uuid: req.headers.uuid,
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

        console.log("isMailValid: ", isMailValid);

        const isPasswordValid = checkPassword(
          myNewInfos.password,
          myPreviousInfos.password
        );
        console.log("isPasswordValid: ", isPasswordValid);

        if (isMailValid && isPasswordValid) {
          console.log("c'est tout bon!!!! on peut soumettre");
          // si le nouveau mdp est présent, on le crypte, on récupère la dats et on l'envoie en base
          if (myNewInfos.passwordModif != "") {
            console.log("nouveau mot de passe détecté");
            myNewInfos.password = myNewInfos.passwordModif;

            // console.log("new pwd : ", myNewInfos);
          }
          myNewInfos.password = hash(myNewInfos.password);
          const newToken = createToken(req.headers.uuid, myNewInfos.password);

          collection.updateOne(
            {
              uuid: req.headers.uuid,
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

          collection.updateMany(
            { $and: [{}, { "friends.uuid": myPreviousInfos.uuid }] },
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
          res
            .status(200)
            .json({ message: "Modifications enregistrées!", token: newToken });
          // console.log("infos à jour : ", myNewInfos);
          //

          //
        }
      } catch (error) {
        console.log("Pas d'utilisateur trouvé", error);
      }
    }

    // const checkPassword = function () {
    const checkPassword = function (toCheck, reference) {
      console.log("test pwd");

      if (!checkHash(toCheck, reference)) {
        res.json(
          "Mot de passe incorrect , on ne peut pas faire la modification du profil"
        );
        return false;
      } else {
        console.log("pasword ok");
        return true;
      }
    };

    const checkMailAddress = async function (toCheck, reference) {
      console.log("dans le check address");
      await mongoClient.connect();
      const check = await collection.count({
        mailAddress: toCheck,
      });
      console.log("check", check);
      if (toCheck != reference && check >= 1) {
        res.json("adresse dejà utilisée sur un autre compte");
        console.log("mail nok");
        return false;
      } else {
        console.log("mail ok");
        return true;
      }
    };

    checkInformations();
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

///////////////////////////////////////////////////////////////////////////
////////////////////// FETCH INFOS POUR MODIF PROFIL//////////////////////
///////////////////////////////////////////////////////////////////////////
app.get("/myinformations", (req, res, next) => {
  console.log("dans le middleware myinformations");
  // console.log("reqbody", req.body);

  if (authToken(req.headers.token, req.headers.uuid)) {
    // console.log("token authentifié");
    async function fetchMyInformations() {
      try {
        await mongoClient.connect();
        console.log(req.headers.uuid);
        // On créé le tableau de uuid d'amis à exclure
        const informations = await collection.findOne(
          {
            uuid: req.headers.uuid,
          },
          {
            projection: projectionBuddyCard,
          }
        );

        if (informations === null) {
        } else {
          res.status(200).json(informations);
          // console.log("result:", result);
        }
      } catch (error) {
        console.log("Pas d'utilisateur trouvé", error);
      } finally {
        // Ensures that the client will close when you finish/error
        // await mongoClient.close();
      }
    }

    fetchMyInformations();
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

/////////////////////////////////////////////////////////
//////////////////////// SEND BY ID ////////////////////////
/////////////////////////////////////////////////////////
app.post("/buddybyid", (req, res, next) => {
  if (authToken(req.headers.token, req.headers.uuid)) {
    // console.log("req.body.buddyTarget : ", req.body.buddyTarget);
    async function sendBuddy(buddyTarget) {
      try {
        await mongoClient.connect();
        const buddyToSend = await fetchBuddy(
          { uuid: buddyTarget },
          { projection: projectionBuddyCard }
        );
        // console.log("buddyToSend = ", buddyToSend);
        res.status(200).json(buddyToSend);
      } catch (error) {
        console.log(error);
      }
    }

    sendBuddy(req.body.buddyTarget);
  }
});

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// ALL BUDDIES ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.get("/allbuddies", (req, res, next) => {
  console.log("dans le middleware allbuddies");
  // console.log("reqbody", req.body);
  // console.log("reqheaders", req.headers);

  if (authToken(req.headers.token, req.headers.uuid)) {
    console.log("token authentifié");
    async function fetchAllBuddies() {
      try {
        await mongoClient.connect();

        //https://www.mongodb.com/docs/manual/reference/operator/query/nin/
        // On créé le tableau de uuid d'amis à exclure
        const buddiesToExclude = await collection
          .find(
            {
              uuid: req.headers.uuid,
            },
            {
              projection: {
                friends_list: 1,
              },
            }
          )
          .toArray();

        console.log("buddy à exclure: ", buddiesToExclude);
        const allBuddies = await collection
          .find(
            {
              $and: [
                { uuid: { $nin: buddiesToExclude[0].friends_list } },
                { uuid: { $ne: req.headers.uuid } },
              ],
            },
            {
              projection: projectionBuddyCard,
            }
          )
          .toArray();

        // for (let each of allBuddies) {
        //   each.addable = true;
        // }
        // console.log("les gens: ", allBuddies);

        if (allBuddies === null) {
        } else {
          res.status(200).json(allBuddies);
          // console.log("result:", result);
        }
      } catch (error) {
        console.log("Pas d'utilisateur trouvé", error);
      } finally {
        // Ensures that the client will close when you finish/error
        // await mongoClient.close();
      }
    }

    fetchAllBuddies();
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// MY BUDDIES ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.get("/fetchmybuddies", (req, res) => {
  console.log("dans le middleware fetchmybuddies");
  // console.log("req.headers.token = ", req.headers.token);

  if (authToken(req.headers.token, req.headers.uuid)) {
    async function fetchMyBuddies() {
      try {
        await mongoClient.connect();
        /// Extraction de ma liste d'amis:
        const result = await collection
          .find(
            { uuid: req.headers.uuid },
            {
              projection: { _id: 0, friends: 1 },
            }
          )
          .toArray();
        // console.log("buddies: ", result);
        // console.log("buddies[0]: ", result[0]);
        // console.log("buddies[0].friends: ", result[0].friends);

        const allMyBuddies = result[0].friends;

        // console.log("tous les buddies: ", allMyBuddies);
        res.status(200).json(allMyBuddies);
      } catch (error) {
        console.log(error);
      } finally {
        console.log("ok");
        // Ensures that the client will close when you finish/error
        // await mongoClient.close();
      }
    }

    fetchMyBuddies();
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

////////////////////////////////////////////////////

app.get("/mongoff", (req, res) => {
  console.log("fermeture mongo....", req.headers.token);
  if (authToken(req.headers.token, req.headers.uuid)) {
    mongoClient.close();
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////// INVITATION RECO /////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.post("/invitationfromreco", (req, res) => {
  console.log(
    "dans le middleware invitation reco, guest = ",
    req.body.buddyTarget
  );
  if (authToken(req.headers.token, req.headers.uuid)) {
    invitationRecoUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget,
      projectionBuddyCard
    ).then(res.json("Votre invitation a bien été envoyée!!"));
    // async function invitationRecoUpdateDataBase(uuid1, uuid2) {
    //   await mongoClient.connect();
    //   try {
    //     // On récupère ma carte:
    //     const buddyToAdd = await fetchBuddy(
    //       { uuid: uuid1 },
    //       {
    //         projection: projectionBuddyCard,
    //       }
    //     );

    //     buddyToAdd.status = "pending";

    //     const up1 = await collection.updateOne(
    //       { uuid: uuid2 },
    //       {
    //         $push: {
    //           friends: buddyToAdd,
    //           friends_list: uuid1,
    //         },
    //       }
    //     );

    //     const up3 = await collection.updateOne(
    //       { uuid: uuid1, "friends.uuid": uuid2 },
    //       {
    //         $set: { "friends.$.status": "invited" },
    //       }
    //     );
    //   } catch (error) {
    //   } finally {
    //     // await mongoClient.close();
    //   }
    // }
    // // On récupère l'invité et on le colle dans la liste d'amis de l'inviteur
    // const updateHostDB = invitationRecoUpdateDataBase(
    //   req.headers.uuid,
    //   req.body.buddyTarget,
    //   "invited"
    // );

    // res.json("Votre invitation a bien été envoyée!!");
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }
});

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// INVITATION ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/invitation", (req, res) => {
  console.log("dans le middleware invitation, guest = ", req.body.buddyTarget);

  if (authToken(req.headers.token, req.headers.uuid)) {
    async function invitationProcess() {
      await invitationUpdateDataBase(
        req.headers.uuid,
        req.body.buddyTarget,
        projectionBuddyCard,
        "invited"
      );
      await invitationUpdateDataBase(
        req.body.buddyTarget,
        req.headers.uuid,
        projectionBuddyCard,
        "pending"
      );

      // const contactInformation = await fetchSome(
      return await fetchSome(
        { uuid: { $in: [req.headers.uuid, req.body.buddyTarget] } },
        { projection: { _id: 0, mailAddress: 1, firstName: 1, lastName: 1 } }
      );
    }

    invitationProcess().then((contacts) => {
      invitationMail(contacts);
      res.json("Votre invitation a bien été envoyée!!");
    });
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }
});

///////////////////////////////////////////////////////////////////////////
////////////////////////////// CONFIRMATION ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/confirmation", (req, res) => {
  console.log(
    "dans le middleware confirmation, guest = ",
    req.body.buddyTarget
  );

  if (authToken(req.headers.token, req.headers.uuid)) {
    confirmationProcess(req.headers.uuid, req.body.buddyTarget);
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }
});

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// DELETION ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/deletion", (req, res) => {
  console.log("dans le middleware deletion, guest = ", req.body.buddyTarget);

  if (authToken(req.headers.token, req.headers.uuid)) {
    // async function deletionBuddyProcess(deleter, deleted)

    deletionBuddyProcess(req.headers.uuid, req.body.buddyTarget).then(() => {
      res.json("Votre suppression a bien été effectuée!!");
    });
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }

  // On fetche les 2 buddy

  // on les supprime de la liste d'amis respiectives
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////// RECOMMENDATION //////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/recommendation", (req, res) => {
  console.log(
    "dans le middleware recommendation, guest à recommander = ",
    req.body.buddyTarget
  );

  if (authToken(req.headers.token, req.headers.uuid)) {
    async function recommendationProcess() {
      recommendationUpdateDataBase(
        req.headers.uuid,
        req.body.buddyTarget,
        projectionBuddyCard
      );

      return await fetchSome(
        { uuid: { $in: [req.headers.uuid, req.body.buddyTarget] } },
        { projection: { _id: 0, mailAddress: 1, firstName: 1, lastName: 1 } }
      );
    }

    recommendationProcess().then((contacts) => {
      recommendationMail(contacts);
      res.json("Votre recommandation a bien été envoyée!!");
    });
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }
});

//////////////////////////////////////////////
/////////////// RESET PASSWORD ///////////////
//////////////////////////////////////////////

app.post("/resetpassword", (req, res) => {
  console.log("dans le middleware reste password");

  resetPasswordProcess(req.body.mailAddress).then((response) => {
    console.log("response = ", response);
    res.status(response.status).json(response.json);
  });
});

//////////////////////////////////////////////
////////////* ANGULAR MAIN ROUTE *////////////
//////////////////////////////////////////////

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/buddyzik/index.html"));
});

// app.get("/*", (req, res) => {
//   res.status(404).sendFile("erreur 404");
// });

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// FONCTIONS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
const fetchBuddy = (query, projection) => {
  console.log("ça va promettre un fetch....");
  return new Promise((resolve, reject) => {
    collection.findOne(query, projection).then((buddy) => {
      resolve(buddy);
    });
  });
};
const updateBuddy = (query, update) => {
  console.log("ça va promettre un update....");
  return new Promise((resolve, reject) => {
    collection.updateOne(query, update).then((buddy) => {
      resolve(buddy);
    });
  });
};

/////////////////////////////////////////////////////////
//////////////////// SERVER EXPRESS /////////////////////
/////////////////////////////////////////////////////////
const server = app.listen(process.env.PORT, () => {
  console.log(`Le serveur est démarré sur le port ${server.address().port}`);
});

// const ht = https.createServer(app).listen(process.env.PORT, () => {
//   console.log("server is runing at port 4000");

// });
