import { fetchOne, fetchSome, updateSome, updateUno } from "./manageDatas.js";

export async function recommendationUpdateDataBase(uuid1, uuid2, projection) {
  //   await mongoClient.connect();
  try {
    // On met à jour le tableau remmendedBy chez le recommandé:
    await updateUno({ uuid: uuid2 }, { $push: { recommendedBy: uuid1 } });
    // On met à jour le tableau recommends chez le recommandeur:
    await updateUno({ uuid: uuid1 }, { $push: { recommends: uuid2 } });

    // On met à jour le statut du recommandé chez le recommandateur
    updateUno(
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
    updateSome(
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
    updateSome(
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
    const buddyToRecommend = await fetchOne(
      { uuid: uuid2 },
      {
        projection: projection,
      }
    );
    buddyToRecommend.status = "recommended";
    // buddyToRecommend.recommendedBy.push(uuid1);

    console.log("buddyToRecommend", buddyToRecommend);
    // on extrait la liste d'amis du recommandeur:

    const extractListRecommended = await fetchSome(
      {
        uuid: uuid2,
      },
      {
        projection: { _id: 0, friends_list: 1 },
      }
    );
    //   .toArray();

    const buddyListRecommended = extractListRecommended[0].friends_list;

    console.log("buddyListRecommended: ", buddyListRecommended);
    const extractListRecommendator = await fetchSome(
      { uuid: uuid1 },

      {
        projection: { _id: 0, friends_list: 1 },
      }
    );
    //   .toArray();

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
    updateSome(
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

// const updateHostDB = recommendationUpdateDataBase(
//     req.headers.uuid,
//     req.body.buddyTarget
//   );

//   res.json("Votre invitation a bien été envoyée!!");
