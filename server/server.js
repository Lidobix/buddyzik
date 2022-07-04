import express from "express";
import bodyParser from "body-parser";

import { resetPasswordProcess } from "./auth-reset.js";
import { fetchOne, fetchSome } from "./manageDatas.js";
import { invitationUpdateDataBase } from "./invitationBuddy.js";
import { invitationRecoUpdateDataBase } from "./invitationBuddyReco.js";
import { invitationMail, recommendationMail } from "./mailing.js";
import cors from "cors";
import { authToken } from "../server/security.js";
import { MongoClient } from "mongodb";
import path from "path";

import "dotenv/config";

import { fileURLToPath } from "url";
import { recommendationUpdateDataBase } from "./recommendationBuddy.js";
import { uploadPostProcess } from "./uploadPost.js";
import { deletionBuddyProcess } from "./deleteBuddy.js";
import { confirmationProcess } from "./confirmationInvitaionBuddy.js";
import { loginProcess } from "./login.js";
import { registrationProcess } from "./registrationBuddy.js";
import { updateProfileProcess } from "./updateProfile.js";
import { downloadPostsProcess } from "./downloadPost.js";
const app = express();
app.use(cors());

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

app.use(express.static(path.join(__dirname, "/../dist/buddyzik")));

app.use(
  "/images",
  express.static(
    path.join(__dirname, "..", "dist", "buddyzik", "assets", "images")
  )
);
app.use(
  "/fonts",
  express.static(
    path.join(__dirname, "..", "dist", "buddyzik", "assets", "fonts")
  )
);

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
  pro: 1,
  bio: 1,
};

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/favicon.ico", (req, res) => {
  console.log("path : ", __dirname, "../favicon.ico");
  res.sendFile(path.resolve(__dirname, "../favicon.ico"));
});

/////////////////////////////////////////////////////////
////////////////////// CHECK TOKEN //////////////////////
/////////////////////////////////////////////////////////
app.get("/auth", (req, res, next) => {
  res.status(200).json(authToken(req.headers.token));
});

/////////////////////////////////////////////////////////
///////////////////////// LOGIN /////////////////////////
/////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  loginProcess(req.body).then((response) => {
    res.status(response.status).json(response.content);
  });
});

/////////////////////////////////////////////////////////
////////////////////// INSCRIPTION //////////////////////
/////////////////////////////////////////////////////////
app.post("/register", (req, res) => {
  registrationProcess(req.body).then((response) => {
    res.status(response.status).json(response.content);
  });
});
////////////////////////////////////////////////////////////////////////
//////////////////////////// UPDATE PROFILE ////////////////////////////
////////////////////////////////////////////////////////////////////////

app.post("/updateprofile", (req, res, next) => {
  if (authToken(req.headers.token)) {
    updateProfileProcess(req.body, req.headers).then((response) => {
      console.log("response = ", response);
      res.status(response.status).json(response.content);
    });
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

///////////////////////////////////////////////////////////////////////////
////////////////////// FETCH INFOS POUR MODIF PROFIL//////////////////////
///////////////////////////////////////////////////////////////////////////
app.get("/myinformations", (req, res, next) => {
  if (authToken(req.headers.token, req.headers.uuid)) {
    async function fetchMyInformations() {
      try {
        projectionBuddyCard.birthDate = 1;
        projectionBuddyCard.mailAddress = 1;
        projectionBuddyCard.location = 1;
        projectionBuddyCard.bio = 1;
        const informations = await fetchOne(
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
        }
      } catch (error) {
        console.log("Pas d'utilisateur trouvé", error);
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
    async function sendBuddy(buddyTarget) {
      try {
        const buddyToSend = await fetchOne(
          { uuid: buddyTarget },
          { projection: projectionBuddyCard }
        );

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
  if (authToken(req.headers.token, req.headers.uuid)) {
    async function fetchAllBuddies() {
      try {
        await mongoClient.connect();
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

        if (allBuddies === null) {
        } else {
          res.status(200).json(allBuddies);
        }
      } catch (error) {
        console.log("Pas d'utilisateur trouvé", error);
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
  if (authToken(req.headers.token, req.headers.uuid)) {
    async function fetchMyBuddies() {
      try {
        await mongoClient.connect();

        const result = await collection
          .find(
            { uuid: req.headers.uuid },
            {
              projection: { _id: 0, friends: 1 },
            }
          )
          .toArray();

        const allMyBuddies = result[0].friends;

        res.status(200).json(allMyBuddies);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMyBuddies();
  } else {
    res.json("Impossible de vous authentifier!");
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////// INVITATION RECO /////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.post("/invitationfromreco", (req, res) => {
  if (authToken(req.headers.token, req.headers.uuid)) {
    invitationRecoUpdateDataBase(
      req.headers.uuid,
      req.body.buddyTarget,
      projectionBuddyCard
    ).then(res.json("Votre invitation a bien été envoyée!!"));
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
  if (authToken(req.headers.token, req.headers.uuid)) {
    deletionBuddyProcess(req.headers.uuid, req.body.buddyTarget).then(() => {
      res.json("Votre suppression a bien été effectuée!!");
    });
  } else {
    res.json(
      "une erreur est survenue, impossible d'effectuer cette action, contactez le service support."
    );
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////// RECOMMENDATION //////////////////////////////
///////////////////////////////////////////////////////////////////////////

app.post("/recommendation", (req, res) => {
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

app.post("/resetpassword", (req, res, next) => {
  resetPasswordProcess(req.body.mailAddress).then((response) => {
    console.log("response = ", response);
    res.status(response.status).json(response);
  });
});
///////////////////////////////////////
////////////// SEND POST //////////////
///////////////////////////////////////

app.post("/uploadpost", (req, res, next) => {
  if (authToken(req.headers.token, req.headers.uuid)) {
    uploadPostProcess(req.headers, req.body).then((response) => {
      res.status(response.status).json(response);
    });
  }
});
///////////////////////////////////////
///////////// FETCH  POST /////////////
///////////////////////////////////////

app.post("/downloadposts", (req, res, next) => {
  if (authToken(req.headers.token, req.headers.uuid)) {
    downloadPostsProcess(req.body.target).then((response) => {
      res.status(200).json(response);
    });
  }
});

//////////////////////////////////////////////
////////////* ANGULAR MAIN ROUTE *////////////
//////////////////////////////////////////////

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/buddyzik/index.html"));
});

/////////////////////////////////////////////////////////
//////////////////// SERVER EXPRESS /////////////////////
/////////////////////////////////////////////////////////
const server = app.listen(process.env.PORT, () => {
  console.log(`Le serveur est démarré sur le port ${server.address().port}`);
});
