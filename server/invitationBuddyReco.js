import { fetchOne, updateOne } from "./manageDatas.js";

export async function invitationRecoUpdateDataBase(
  recommender,
  recommended,
  projection
) {
  // await mongoClient.connect();
  try {
    // On récupère ma carte:
    const buddyToAdd = await fetchOne(
      { uuid: recommender },
      {
        projection: projection,
      }
    );

    buddyToAdd.status = "pending";
    console.log("buddyToAdd : ", buddyToAdd);

    await updateOne(
      { uuid: recommended },
      {
        $push: {
          friends: buddyToAdd,
          friends_list: recommender,
        },
      }
    );

    await updateOne(
      { uuid: recommender, "friends.uuid": recommended },
      {
        $set: { "friends.$.status": "invited" },
      }
    );
  } catch (error) {
    console.log(error);
  } finally {
    // await mongoClient.close();
  }
}

// export function invitationRecommendProcess(recommender, recommended) {
//   invitationRecoUpdateDataBase(recommender, recommended);
// }

// On récupère l'invité et on le colle dans la liste d'amis de l'inviteur
