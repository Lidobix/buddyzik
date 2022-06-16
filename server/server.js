import express, { application, response } from "express";
// import { Request, Response } from "express";
import bodyParser from "body-parser";
import { authToken, createToken } from "./security.js";
import { main } from "./mailing.js";
import cors from "cors";
import { hash, checkHash } from "./security.js";
import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import sessionFileStore from "session-file-store";
// import "dotenv/config";
import "dotenv/config";
// import jwt from "jsonwebtoken";
import fs from "fs";

// import { dirname } from "path";
import { fileURLToPath } from "url";
import { resolve } from "dns";
import { async, asyncScheduler } from "rxjs";
import { resolveObjectURL } from "buffer";
import { rejects } from "assert";
import { ConsoleLogger } from "@angular/compiler-cli";

const app = express();

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

app.use(express.static(__dirname + "/../dist/buddyzik"));
app.get("/*", (req, res) => {
  // path.join(__dirname, "../dist/buddyzik/index.html");
  // console.log(path.join(__dirname, "../dist/buddyzik/index.html"));
  res.sendFile(path.join(__dirname, "../dist/buddyzik/index.html"));
  // res.send("coucou!!!");
});
app.use(cors());
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

// const config = {
//   PORT: 3100,
//   DB_URL:
//     "mongodb+srv://Lidobix:blup11pulb@lidobixcluster.lvj1i.mongodb.net/test?authSource=admin&replicaSet=atlas-r98rki-shard-0&readPreference=primary&ssl=true",
//   DB_NAME: "buddyzik",
//   DB_COL_USER: "users",
// };
const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  DB_COL_USER: process.env.DB_COL_USER,
};
console.log("db url: ", config);
const mongoClient = new MongoClient(config.DB_URL);
const collection = mongoClient
  .db(config.DB_NAME)
  .collection(config.DB_COL_USER);

const projectionBuddyCard = {
  _id: 0,
  login: 1,
  uuid: 1,
  firstName: 1,
  lastName: 1,
  instrument: 1,
  singer: 1,
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
  res.sendFile(path.resolve(__dirname, "../favicon.ico"));
});
///////////////////////////////////////////////////////////
/////////TEST///////////////////////////

app.get("/mailtest", (req, res) => {
  const mail = main().catch(console.error);
  res.status(200).json("ok");
});

/////////////////////////////////////////////////////////
////////////////////// CHECK TOKEN //////////////////////
/////////////////////////////////////////////////////////
app.post("/auth", (req, res, next) => {
  // req.session.message = "neeeeeeeeeewww";
  // console.log("ma session : ", req.session);

  console.log("token: ", req.headers.token);
  console.log("authToken: ", authToken(req.headers.token));
  const bool = authToken(req.headers.token);
  res.status(200).json(bool);
});

/////////////////////////////////////////////////////////
///////////////////////// LOGIN /////////////////////////
/////////////////////////////////////////////////////////

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
      const newToken = createToken(buddy).toString();
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
          professionnal: newUser.professionnal,
          recommendedBy: [],
          recommends: [],
        };

        const newToken = createToken(newBuddy).toString();
        newBuddy.token = newToken;

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
//////////////////////////////////////////////////////////
///////////////////////// SET STATUS /////////////////////////
//////////////////////////////////////////////////////////

app.post("/setconnection", (req, res) => {
  // A DEFINIR AVEC LES WEBSOCKET
  // NOTAMMENT POUR LA DECONNECTION
  // AVEC LE DESTROY DU SOCKET.
});

//////////////////////////////////////////////////////////
///////////////////////// LOGOUT /////////////////////////
//////////////////////////////////////////////////////////

app.post("/logout", (req, res, next) => {
  console.log("req.header", req);
});

/////////////////////////////////////////////////////////
//////////////////////// SEND BY ID ////////////////////////
/////////////////////////////////////////////////////////
app.post("/buddybyid", (req, res, next) => {
  if (authToken(req.headers.token)) {
    console.log("req.body.buddyTarget : ", req.body.buddyTarget);
    async function sendBuddy(buddyTarget) {
      try {
        await mongoClient.connect();
        const buddyToSend = await fetchBuddy(
          { uuid: buddyTarget },
          { projection: projectionBuddyCard }
        );
        console.log("buddyToSend = ", buddyToSend);
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
app.post("/allbuddies", (req, res, next) => {
  console.log("dans le middleware allbuddies");
  // console.log("reqbody", req.body);
  if (authToken(req.headers.token)) {
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
                _id: 0,
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
app.post("/mybuddies", (req, res) => {
  console.log("dans le middleware mybuddies");

  if (authToken(req.headers.token)) {
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
  if (authToken(req.headers.token)) {
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
  if (authToken(req.headers.token)) {
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

  if (authToken(req.headers.token)) {
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

  if (authToken(req.headers.token)) {
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
              projection: {
                _id: 0,
                login: 1,
                friends_list: 1,
              },
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

  if (authToken(req.headers.token)) {
    async function deletionRecommendationDataBase(uuid1, uuid2) {
      try {
        await mongoClient.connect();

        // supprimer les recommandations
        // checker si le buddy supprimé est dans la mliste de recommandés

        // Il faut le retirer de tous les amis chez qui il est en statut recommandé et uniquement par moi

        await updateBuddy(
          { uuid: uuid1 },
          { $pull: { recommends: uuid2, recommendedBy: uuid2 } }
        );
        await updateBuddy(
          { uuid: uuid2 },
          { $pull: { recommends: uuid1, recommendedBy: uuid1 } }
        );

        // - si il est recommendé par moi uniquement: on supprime sa présence dans chaque ami.
        await collection
          .updateMany(
            {},
            {
              $pull: {
                friends: {
                  $and: [
                    { uuid: uuid2 },
                    { status: "recommended" },
                    { recommendedBy: { $size: 1 } },
                  ],
                },
                friends_list: uuid2,
              },
            }
          )
          .then(
            // Ensuite je supprime ma recommandation de chez tous mes amis qui ont mon recommandé en ami:
            collection.updateMany(
              {
                $and: [
                  {},
                  { "friends.uuid": uuid2 },
                  // { "friends.status": "confirmed" },
                ],
              },
              {
                $pull: { "friends.$.recommendedBy": uuid1 },
              }
            )
          ) // je supprime chez tous les gens qui m'ont en ami ma recommandation
          .then(
            collection.updateMany(
              { $and: [{}, { "friends.uuid": uuid1 }] },
              {
                $pull: {
                  "friends.$.recommends": uuid2,
                },
              }
            )
          );
      } catch (error) {
        console.log(error);
      }
    }

    const deleteReco = deletionRecommendationDataBase(
      req.headers.uuid,
      req.body.buddyTarget
    );

    async function deletionUpdateDataBase(uuid1, uuid2) {
      try {
        await mongoClient.connect();

        // on supprime cet ami de ma liste et moi de la sienne:
        collection.updateMany(
          { uuid: { $in: [uuid1, uuid2] } },
          {
            $pull: {
              friends: {
                $or: [{ uuid: { $eq: uuid1 } }, { uuid: { $eq: uuid2 } }],
              },
              friends_list: { $in: [uuid1, uuid2] },
            },
          }
        );
      } catch (error) {
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = deletionUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget
    );

    res.json("Votre suppression a bien été effectuée!!");
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }

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

  if (authToken(req.headers.token)) {
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
              projection: {
                _id: 0,
                friends_list: 1,
              },
            }
          )
          .toArray();

        const buddyListRecommended = extractListRecommended[0].friends_list;

        console.log("buddyListRecommended: ", buddyListRecommended);
        const extractListRecommendator = await collection
          .find(
            { uuid: uuid1 },

            {
              projection: {
                _id: 0,
                friends_list: 1,
              },
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
const server = app.listen(config.PORT, () => {
  console.log(`Le serveur est démarré sur le port ${server.address().port}`);
});
