import express from "express";
// import { Request, Response } from "express";
import bodyParser from "body-parser";
// import { authToken, createToken } from "./security.js";
import { passwordGenerator } from "./password-gen.js";
import { resetPasswordProcess } from "./resetPassword.js";
import { updateOne } from "./manageDatas.js";
// import { fetchDatas } from "./fetchDatas.js";
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
import path, { dirname } from "path";
// import cookieParser from "cookie-parser";
// import expressSession from "express-session";
// import sessionFileStore from "session-file-store";

import "dotenv/config";

// import { dirname } from "path";
import { fileURLToPath } from "url";

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
          singer: newUser.singer,
          pro: newUser.pro,
          recommendedBy: [],
          recommends: [],
        };

        const newToken = createToken(
          newBuddy.uuid,
          newBuddy.password
        ).toString();
        newBuddy.token = newToken;
        const thankYou = registerMail(newBuddy.mailAddress, newBuddy.firstName);

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
                bio: myNewInfos.bio,
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
            projection: {
              login: 1,
              mailAddress: 1,
              firstName: 1,
              lastName: 1,
              birthDate: 1,
              location: 1,
              gender: 1,
              instrument: 1,
              singer: 1,
              pro: 1,
              bio: 1,
              bannerPicture: 1,
              profilePicture: 1,
            },
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

        // console.log("buddy à exclure: ", buddiesToExclude);
        const allBuddies = await collection
          .find(
            {
              $and: [
                { uuid: { $nin: buddiesToExclude[0].friends_list } },
                { token: { $ne: req.headers.token } },
              ],
            },
            {
              projection: {
                _id: 0,
                login: 1,
                uuid: 1,
                firstName: 1,
                lastName: 1,
                instrument: 1,
                gender: 1,
                singer: 1,
                profilePicture: 1,
                status: 1,
                recommends: 1,
                recommendedBy: 1,
              },
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
    async function invitationRecoUpdateDataBase(uuid1, uuid2) {
      await mongoClient.connect();
      try {
        // On récupère ma carte:
        const buddyToAdd = await fetchBuddy(
          { uuid: uuid1 },
          {
            projection: projectionBuddyCard,
          }
        );

        buddyToAdd.status = "pending";

        const up1 = await collection.updateOne(
          { uuid: uuid2 },
          {
            $push: {
              friends: buddyToAdd,
              friends_list: uuid1,
            },
          }
        );

        const up3 = await collection.updateOne(
          { uuid: uuid1, "friends.uuid": uuid2 },
          {
            $set: { "friends.$.status": "invited" },
          }
        );
      } catch (error) {
      } finally {
        // await mongoClient.close();
      }
    }
    // On récupère l'invité et on le colle dans la liste d'amis de l'inviteur
    const updateHostDB = invitationRecoUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget,
      "invited"
    );

    res.json("Votre invitation a bien été envoyée!!");
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
    async function invitationUpdateDataBase(uuid1, uuid2, status) {
      await mongoClient.connect();
      try {
        const buddyToAdd = await fetchBuddy(
          { uuid: uuid2 },
          {
            projection: projectionBuddyCard,
          }
        );

        buddyToAdd.status = status;

        const up1 = await collection.updateOne(
          { uuid: uuid1 },
          {
            $push: {
              friends: buddyToAdd,
              friends_list: uuid2,
            },
          }
        );
      } catch (error) {
      } finally {
        // await mongoClient.close();
      }
    }
    // On récupère l'invité et on le colle dans la liste d'amis de l'inviteur
    const updateHostDB = invitationUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget,
      "invited"
    );

    // On récupère l'inviteur et on le colle dans la liste d'amis de l'invité
    const updateGuestDB = invitationUpdateDataBase(
      req.body.buddyTarget,
      req.headers.uuid,
      "pending"
    );

    res.json("Votre invitation a bien été envoyée!!");
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
    async function confirmationUpdateDataBase(uuid1, uuid2) {
      console.log("confirmation d'acceptation");
      await mongoClient.connect();
      try {
        // On change les statuts des 2 amis à "confirmé" dans leurs listes respectives
        collection.updateMany(
          {
            $and: [
              { uuid: { $in: [uuid1, uuid2] } },
              { "friends.uuid": { $in: [uuid1, uuid2] } },
            ],
          },

          {
            $set: {
              "friends.$.status": "confirmed",
              // "friends.$.recommendedBy": [],
            },
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = confirmationUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget
    );
    const updateguestDB = confirmationUpdateDataBase(
      req.body.buddyTarget,
      req.headers.uuid
    );

    async function addRecommendedBuddies(uuid1, uuid2) {
      console.log("proposition des buddy recommandés");
      await mongoClient.connect();
      try {
        // On doit ajouter dasns la liste des 2 amis les amis qui leur sont recommandés:

        // Si je suis X, je dois aller lire le tableau de uuid recommandés de Y
        const extractBuddiesRecommended = await fetchBuddy(
          { uuid: uuid2 },
          { projection: { _id: 0, recommends: 1 } }
        );
        const newBuddyRecommendationList = extractBuddiesRecommended.recommends;

        // console.log("extractBuddiesRecommended ", extractBuddiesRecommended);
        console.log("buddies à proposer: ", newBuddyRecommendationList);

        // J'extrais ma liste d'amis:
        const extractMyBuddiesList = await collection
          .find(
            { uuid: uuid1 },
            {
              projection: { _id: 0, login: 1, friends_list: 1 },
            }
          )
          .toArray();

        const myBuddiesList = extractMyBuddiesList[0].friends_list;
        // console.log("myBuddiesList :", myBuddiesList);
        console.log("extractMyBuddiesList :", extractMyBuddiesList);

        // Je dois extraire de cette liste tous mes amis communs avec lui

        for (let buddyToExclude of myBuddiesList) {
          console.log("buddyToExclude :", buddyToExclude);
          if (newBuddyRecommendationList.includes(buddyToExclude)) {
            newBuddyRecommendationList.splice(
              newBuddyRecommendationList.indexOf(buddyToExclude),
              1
            );
          }
        }

        console.log(
          "après extraction des amis communs: ",
          newBuddyRecommendationList
        );
        // // on a la liste desbuddy à ajouter en statut recommandé.

        const buddyToRecommend = await collection
          .find(
            { uuid: { $in: newBuddyRecommendationList } },
            {
              projection: projectionBuddyCard,
            }
          )
          .toArray();

        console.log("new buddy to add and recommend: ", buddyToRecommend);

        // Modification du statut:
        for (const buddy of buddyToRecommend) {
          buddy.status = "recommended";
        }
        console.log(
          "new buddy to add après modif du statut: ",
          buddyToRecommend
        );

        // buddyToRecommend.status = "recommended";

        // // Je dois ensuite ajouter tous ces buddys à ma liste d'amis

        updateBuddy(
          { uuid: uuid1 },
          {
            $push: {
              friends: { $each: buddyToRecommend },
              friends_list: { $each: newBuddyRecommendationList },
            },
          }
        );

        // const buddiesRecommandedToAdd = collection
        //   .find(
        //     { uuid: { $in: buddyRecommendedList } },
        //     { projection: projectionBuddyCard }
        //   )
        //   .toArray();

        // console.log("amis à ajouter: ", buddiesRecommandedToAdd);
      } catch (error) {
        console.log(error);
      } finally {
        // await mongoClient.close();
      }
    }

    const addRecommendedToMe = addRecommendedBuddies(
      req.body.buddyTarget,
      req.headers.uuid
    );
    const addRecommendedToGuest = addRecommendedBuddies(
      req.headers.uuid,
      req.body.buddyTarget
    );

    // const updateGuestDB = confirmationUpdateDataBase(
    //   req.body.buddyTarget,
    //   req.headers.uuid
    // );

    res.json("Votre invitation a bien été envoyée!!");
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

  // if (authToken(req.headers.token, req.headers.uuid)) {
  //   async function deletionRecommendationDataBase(uuid1, uuid2) {
  //     try {
  //       await mongoClient.connect();

  //       // supprimer les recommandations
  //       // checker si le buddy supprimé est dans la mliste de recommandés

  //       // Il faut le retirer de tous les amis chez qui il est en statut recommandé et uniquement par moi

  //       await updateBuddy(
  //         { uuid: uuid1 },
  //         { $pull: { recommends: uuid2, recommendedBy: uuid2 } }
  //       );
  //       await updateBuddy(
  //         { uuid: uuid2 },
  //         { $pull: { recommends: uuid1, recommendedBy: uuid1 } }
  //       );

  //       // - si il est recommendé par moi uniquement: on supprime sa présence dans chaque ami.
  //       await collection
  //         .updateMany(
  //           {},
  //           {
  //             $pull: {
  //               friends: {
  //                 $and: [
  //                   { uuid: uuid2 },
  //                   { status: "recommended" },
  //                   { recommendedBy: { $size: 1 } },
  //                 ],
  //               },
  //               friends_list: uuid2,
  //             },
  //           }
  //         )
  //         .then(
  //           // Ensuite je supprime ma recommandation de chez tous mes amis qui ont mon recommandé en ami:
  //           collection.updateMany(
  //             {
  //               $and: [
  //                 {},
  //                 { "friends.uuid": uuid2 },
  //                 // { "friends.status": "confirmed" },
  //               ],
  //             },
  //             {
  //               $pull: { "friends.$.recommendedBy": uuid1 },
  //             }
  //           )
  //         ) // je supprime chez tous les gens qui m'ont en ami ma recommandation
  //         .then(
  //           collection.updateMany(
  //             { $and: [{}, { "friends.uuid": uuid1 }] },
  //             {
  //               $pull: {
  //                 "friends.$.recommends": uuid2,
  //               },
  //             }
  //           )
  //         );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   const deleteReco = deletionRecommendationDataBase(
  //     req.headers.uuid,
  //     req.body.buddyTarget
  //   );

  //   async function deletionUpdateDataBase(uuid1, uuid2) {
  //     try {
  //       await mongoClient.connect();

  //       // on supprime cet ami de ma liste et moi de la sienne:
  //       collection.updateMany(
  //         { uuid: { $in: [uuid1, uuid2] } },
  //         {
  //           $pull: {
  //             friends: {
  //               $or: [{ uuid: { $eq: uuid1 } }, { uuid: { $eq: uuid2 } }],
  //             },
  //             friends_list: { $in: [uuid1, uuid2] },
  //           },
  //         }
  //       );
  //     } catch (error) {
  //     } finally {
  //       // await mongoClient.close();
  //     }
  //   }

  //   const updateHostDB = deletionUpdateDataBase(
  //     req.headers.uuid,
  //     req.body.buddyTarget
  //   );

  //   res.json("Votre suppression a bien été effectuée!!");
  // } else {
  //   res.json(
  //     "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
  //   );
  // }

  // On fetche les 2 buddy

  // on les supprime de la liste d'amis respiectives
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////// RECOMMENDAYION //////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/recommendation", (req, res) => {
  console.log(
    "dans le middleware recommendation, guest à recommander = ",
    req.body.buddyTarget
  );

  if (authToken(req.headers.token, req.headers.uuid)) {
    async function recommendationUpdateDataBase(uuid1, uuid2) {
      await mongoClient.connect();
      try {
        // On met à jour le tableau remmendedBy chez le recommandé:
        await collection.updateOne(
          { uuid: uuid2 },
          { $push: { recommendedBy: uuid1 } }
        );
        // On met à jour le tableau recommends chez le recommandeur:
        await collection.updateOne(
          { uuid: uuid1 },
          { $push: { recommends: uuid2 } }
        );

        // On met à jour le statut du recommandé chez le recommandateur
        collection.updateOne(
          {
            $and: [{ uuid: uuid1 }, { "friends.uuid": uuid2 }],
          },
          {
            $set: {
              "friends.$.status": "recommendedByMe",
            },
          }
        );
        // On met à jour le tableau recommendedBy chez tous les amis du recommandé
        collection.updateMany(
          {
            $and: [{}, { "friends.uuid": uuid2 }],
          },
          {
            $push: {
              "friends.$.recommendedBy": uuid1,
            },
          }
        );
        // On met à jour le tableau recommends chez tous les amis du recommandeur
        collection.updateMany(
          {
            $and: [{}, { "friends.uuid": uuid1 }],
          },
          {
            $push: {
              "friends.$.recommends": uuid2,
            },
          }
        );

        // on extrait le buddy recommendé
        const buddyToRecommend = await fetchBuddy(
          { uuid: uuid2 },
          {
            projection: projectionBuddyCard,
          }
        );
        buddyToRecommend.status = "recommended";
        // buddyToRecommend.recommendedBy.push(uuid1);

        console.log("buddyToRecommend", buddyToRecommend);
        // on extrait la liste d'amis du recommandeur:

        const extractListRecommended = await collection
          .find(
            {
              uuid: uuid2,
            },
            {
              projection: { _id: 0, friends_list: 1 },
            }
          )
          .toArray();

        const buddyListRecommended = extractListRecommended[0].friends_list;

        console.log("buddyListRecommended: ", buddyListRecommended);
        const extractListRecommendator = await collection
          .find(
            { uuid: uuid1 },

            {
              projection: { _id: 0, friends_list: 1 },
            }
          )
          .toArray();

        const buddyListRecommendator = extractListRecommendator[0].friends_list;

        console.log("buddyListRecommendator: ", buddyListRecommendator);
        // on enlève les amis communs:
        for (let buddyToExclude of buddyListRecommended) {
          if (buddyListRecommendator.includes(buddyToExclude)) {
            buddyListRecommendator.splice(
              buddyListRecommendator.indexOf(buddyToExclude),
              1
            );
          }
        }

        console.log("buddyListRecommended finale: ", buddyListRecommended);

        // On met à jour la liste des amis chez tous les amis sauf le recommandé
        collection.updateMany(
          {
            uuid: { $in: buddyListRecommendator, $ne: uuid2 },
          },

          {
            $push: {
              friends: buddyToRecommend,
              friends_list: buddyToRecommend.uuid,
              // "friends.recommendedBy": uuid1,
            },
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = recommendationUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget
    );

    res.json("Votre invitation a bien été envoyée!!");
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
