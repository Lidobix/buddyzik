import { fetchOne, fetchSome, updateSome, updateUno } from "./manageDatas.js";

export async function recommendationUpdateDataBase(uuid1, uuid2, projection) {
  try {
    await updateUno({ uuid: uuid2 }, { $push: { recommendedBy: uuid1 } });

    await updateUno({ uuid: uuid1 }, { $push: { recommends: uuid2 } });

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

    const buddyToRecommend = await fetchOne(
      { uuid: uuid2 },
      {
        projection: projection,
      }
    );
    buddyToRecommend.status = "recommended";

    const extractListRecommended = await fetchSome(
      {
        uuid: uuid2,
      },
      {
        projection: { _id: 0, friends_list: 1 },
      }
    );

    const buddyListRecommended = extractListRecommended[0].friends_list;

    const extractListRecommendator = await fetchSome(
      { uuid: uuid1 },

      {
        projection: { _id: 0, friends_list: 1 },
      }
    );

    const buddyListRecommendator = extractListRecommendator[0].friends_list;

    for (let buddyToExclude of buddyListRecommended) {
      if (buddyListRecommendator.includes(buddyToExclude)) {
        buddyListRecommendator.splice(
          buddyListRecommendator.indexOf(buddyToExclude),
          1
        );
      }
    }

    updateSome(
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
  } catch (error) {
    console.log(error);
  }
}
