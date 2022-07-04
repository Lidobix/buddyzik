import { fetchOne, updateSome } from "./manageDatas.js";

async function deletionRecommendationDataBase(uuid1, uuid2) {
  try {
    await fetchOne(
      { uuid: uuid1 },
      { $pull: { recommends: uuid2, recommendedBy: uuid2 } }
    );
    await fetchOne(
      { uuid: uuid2 },
      { $pull: { recommends: uuid1, recommendedBy: uuid1 } }
    );

    await updateSome(
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
        updateSome(
          {
            $and: [{}, { "friends.uuid": uuid2 }],
          },
          {
            $pull: { "friends.$.recommendedBy": uuid1 },
          }
        )
      )

      .then(
        updateSome(
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

async function deletionUpdateDataBase(uuid1, uuid2) {
  try {
    updateSome(
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
  } catch (error) {}
}

export async function deletionBuddyProcess(uuid1, uuid2) {
  try {
    await deletionRecommendationDataBase(uuid1, uuid2);

    await deletionUpdateDataBase(uuid1, uuid2);
  } catch (error) {
    console.log(err);
  }
}
