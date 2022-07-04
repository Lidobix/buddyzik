import { fetchOne, fetchSome, updateSome, updateUno } from "./manageDatas.js";

async function confirmationUpdateDataBase(uuid1, uuid2) {
  try {
    updateSome(
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
  } catch (error) {
    console.log(error);
  }
}
async function addRecommendedBuddies(uuid1, uuid2) {
  console.log("proposition des buddy recommandés");

  try {
    const extractBuddiesRecommended = await fetchOne(
      { uuid: uuid2 },
      { projection: { _id: 0, recommends: 1 } }
    );
    const newBuddyRecommendationList = extractBuddiesRecommended.recommends;

    const extractMyBuddiesList = await fetchSome(
      { uuid: uuid1 },
      {
        projection: { _id: 0, login: 1, friends_list: 1 },
      }
    );

    const myBuddiesList = extractMyBuddiesList[0].friends_list;

    for (let buddyToExclude of myBuddiesList) {
      if (newBuddyRecommendationList.includes(buddyToExclude)) {
        newBuddyRecommendationList.splice(
          newBuddyRecommendationList.indexOf(buddyToExclude),
          1
        );
      }
    }

    const buddyToRecommend = await fetchSome(
      { uuid: { $in: newBuddyRecommendationList } },
      {
        projection: projectionBuddyCard,
      }
    ).toArray();

    for (const buddy of buddyToRecommend) {
      buddy.status = "recommended";
    }

    updateUno(
      { uuid: uuid1 },
      {
        $push: {
          friends: { $each: buddyToRecommend },
          friends_list: { $each: newBuddyRecommendationList },
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function confirmationProcess(uuid1, uuid2) {
  confirmationUpdateDataBase(uuid1, uuid2);
  confirmationUpdateDataBase(uuid2, uuid1);
  addRecommendedBuddies(uuid2, uuid1);
  addRecommendedBuddies(uuid1, uuid2);
}
