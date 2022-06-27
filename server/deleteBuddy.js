import { fetchOne } from "./manageDatas.js";

async function deletionRecommendationDataBase(uuid1, uuid2) {
  try {
    await mongoClient.connect();

    // supprimer les recommandations
    // checker si le buddy supprimé est dans la mliste de recommandés

    // Il faut le retirer de tous les amis chez qui il est en statut recommandé et uniquement par moi

    await fetchOne(
      { uuid: uuid1 },
      { $pull: { recommends: uuid2, recommendedBy: uuid2 } }
    );
    await fetchOne(
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

//   const deleteReco = deletionRecommendationDataBase(
//     req.headers.uuid,
//     req.body.buddyTarget
//   );

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

//   const updateHostDB = deletionUpdateDataBase(
//     req.headers.uuid,
//     req.body.buddyTarget
//   );

res.json("Votre suppression a bien été effectuée!!");

// On fetche les 2 buddy

// on les supprime de la liste d'amis respiectives

export async function deletionBuddyProcess(uuid1, uuid2) {
  // const deleteReco = await deletionRecommendationDataBase(

  try {
    await deletionRecommendationDataBase(
      uuid1,
      uuid2
      //   req.headers.uuid,
      //   req.body.buddyTarget
    );

    // const updateHostDB = await deletionUpdateDataBase(
    // await deletionUpdateDataBase(req.headers.uuid, req.body.buddyTarget);
    await deletionUpdateDataBase(uuid1, uuid2);
  } catch (error) {
    console.log(err);
  }
}
