import { fetchOne, updateUno } from "./manageDatas.js";

export async function invitationRecoUpdateDataBase(
  recommender,
  recommended,
  projection
) {
  try {
    const buddyToAdd = await fetchOne(
      { uuid: recommender },
      {
        projection: projection,
      }
    );

    buddyToAdd.status = "pending";

    await updateUno(
      { uuid: recommended },
      {
        $push: {
          friends: buddyToAdd,
          friends_list: recommender,
        },
      }
    );

    await updateUno(
      { uuid: recommender, "friends.uuid": recommended },
      {
        $set: { "friends.$.status": "invited" },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
