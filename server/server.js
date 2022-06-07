import express, { application } from "express";
// import { Request, Response } from "express";
import bodyParser from "body-parser";
import { authToken, createToken } from "./security.js";
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
};
// await mongoClient.connect();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const distDir = __dirname + "/dist";
// app.use(express.static(distDir));
app.use(bodyParser.json());
app.use(cors());
// console.log(path.join(__dirname, "src"));
// app.get("/favicon.ico", express.static(path.join(__dirname, "src")));
app.get("/", (req, res) => {
  // res.send("coucou!!!");
});
/////////////////////////////////////////////////////////
////////////////////// CHECK TOKEN //////////////////////
/////////////////////////////////////////////////////////
app.get("/auth", (req, res) => {
  // req.session.message = "neeeeeeeeeewww";
  // console.log("ma session : ", req.session);

  console.log("token: ", req.headers.token);
  console.log("authToken: ", authToken(req.headers.token));
  const bool = authToken(req.headers.token);
  res.send(bool);
});

/////////////////////////////////////////////////////////
///////////////////////// LOGIN /////////////////////////
/////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
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
        res.status(200).cookie("token", newToken).json({
          success: true,
          user: buddy,
          message: "Vous êtes connecté, bonne navigation!",
          token: newToken,
          // expiresIn: 3600,
        });
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
          friends: [{}],
          wall: [],
          messager: {},
          instrument: newUser.instrument,
          singer: newUser.singer,
          professionnal: newUser.professionnal,
          RecommendedBy: [],
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

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// ALL BUDDIES ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.get("/allbuddies", (req, res, next) => {
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
              token: req.headers.token,
            },
            {
              projection: {
                _id: 0,
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
              },
            }
          )
          .toArray();

        for (let each of allBuddies) {
          each.addable = true;
        }
        console.log("les gens: ", allBuddies);

        if (allBuddies === null) {
        } else {
          res.status(200).send(allBuddies);
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
app.get("/mybuddies", (req, res) => {
  // console.log("dans le middleware mybuddies");

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
//////////////////////////////// INVITATION ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/invitation", (req, res) => {
  console.log("dans le middleware invitation, guest = ", req.body.guestBuddy);

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

        // buddyToAdd.status = status;

        console.log("guest = ", buddyToAdd);
        const up1 = await collection.updateOne(
          { uuid: uuid1 },
          {
            $push: {
              friends: buddyToAdd,
              friends_list: uuid2,
            },
          }
        );
        // await updateBuddy(
        //   { uuid: uuid1 },
        //   {
        //     $push: {
        //       friends: buddyToAdd,
        //       friends_list: uuid2,
        //     },
        //   }
        // );
        const up2 = await collection.updateOne(
          { uuid: uuid1, "friends.uuid": uuid2 },
          {
            $set: { "friends.$.status": status },
          }
        );
        // await updateBuddy(
        //   { uuid: uuid1, "friends.uuid": uuid2 },
        //   {
        //     $set: { "friends.$.status": status },
        //   }
        // );
      } catch (error) {
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = invitationUpdateDataBase(
      req.headers.uuid,
      req.body.guestBuddy,
      "invited"
    );
    const updateGuestDB = invitationUpdateDataBase(
      req.body.guestBuddy,
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
  console.log("dans le middleware confirmation, guest = ", req.body.guestBuddy);

  if (authToken(req.headers.token)) {
    async function confirmationUpdateDataBase(uuid1, uuid2) {
      await mongoClient.connect();
      try {
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
            },
          }
        );

        // await updateBuddy(
        //   { uuid: uuid1, "friends.uuid": uuid2 },
        //   {
        //     $set: {
        //       "friends.$.status": "confirmed",
        //     },
        //   }
        // );

        // await updateBuddy(
        //   { uuid: uuid2, "friends.uuid": uuid1 },
        //   {
        //     $set: {
        //       "friends.$.status": "confirmed",
        //     },
        //   }
        // );
      } catch (error) {
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = confirmationUpdateDataBase(
      req.headers.uuid,
      req.body.guestBuddy
    );
    // const updateGuestDB = confirmationUpdateDataBase(
    //   req.body.guestBuddy,
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
  console.log("dans le middleware deletion, guest = ", req.body.guestBuddy);

  if (authToken(req.headers.token)) {
    async function deletionUpdateDataBase(uuid1, uuid2) {
      try {
        await mongoClient.connect();

        const deletiion = await collection.updateMany(
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
      req.body.guestBuddy
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
  console.log("dans le middleware confirmation, guest = ", req.body.guestBuddy);

  if (authToken(req.headers.token)) {
    async function recommendationUpdateDataBase(uuid1, uuid2) {
      await mongoClient.connect();
      try {
        // on extrait le buddy recommendé
        const buddyToRecommend = await fetchBuddy(
          { uuid: uuid2 },
          {
            projection: projectionBuddyCard,
          }
        );
        buddyToRecommend.status = "recommended";
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
        // on enlève les amis communs:
        for (let buddyToExclude of buddyListRecommended) {
          if (buddyListRecommendator.includes(buddyToExclude)) {
            buddyListRecommendator.splice(
              buddyListRecommendator.indexOf(buddyToExclude),
              1
            );
          }
        }

        // on ajoute l'ami recommandé à tous les amis du recommandeur sauf le recommandé:

        collection.updateMany(
          {
            uuid: { $in: buddyListRecommendator, $ne: uuid2 },
          },

          {
            $push: {
              friends: buddyToRecommend,
              friends_list: buddyToRecommend.uuid,
            },
          }
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
      } catch (error) {
        console.log(error);
      } finally {
        // await mongoClient.close();
      }
    }

    const updateHostDB = recommendationUpdateDataBase(
      req.headers.uuid,
      req.body.guestBuddy
    );
    // const updateGuestDB = confirmationUpdateDataBase(
    //   req.body.guestBuddy,
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
