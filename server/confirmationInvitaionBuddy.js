import { fetchOne, fetchSome, updateSome, updateUno } from "./manageDatas.js";

async function confirmationUpdateDataBase(uuid1, uuid2) {
  console.log("confirmation d'acceptation");

  try {
    // On change les statuts des 2 amis à "confirmé" dans leurs listes respectives
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
          // "friends.$.recommendedBy": [],
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
    // On doit ajouter dasns la liste des 2 amis les amis qui leur sont recommandés:

    // Si je suis X, je dois aller lire le tableau de uuid recommandés de Y
    const extractBuddiesRecommended = await fetchOne(
      { uuid: uuid2 },
      { projection: { _id: 0, recommends: 1 } }
    );
    const newBuddyRecommendationList = extractBuddiesRecommended.recommends;

    // console.log("extractBuddiesRecommended ", extractBuddiesRecommended);
    console.log("buddies à proposer: ", newBuddyRecommendationList);

    // J'extrais ma liste d'amis:
    const extractMyBuddiesList = await fetchSome(
      { uuid: uuid1 },
      {
        projection: { _id: 0, login: 1, friends_list: 1 },
      }
    );

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

    // console.log(
    //   "après extraction des amis communs: ",
    //   newBuddyRecommendationList
    // );
    // // on a la liste desbuddy à ajouter en statut recommandé.

    const buddyToRecommend = await fetchSome(
      { uuid: { $in: newBuddyRecommendationList } },
      {
        projection: projectionBuddyCard,
      }
    ).toArray();

    // console.log("new buddy to add and recommend: ", buddyToRecommend);

    // Modification du statut:
    for (const buddy of buddyToRecommend) {
      buddy.status = "recommended";
    }
    console.log("new buddy to add après modif du statut: ", buddyToRecommend);

    // buddyToRecommend.status = "recommended";

    // // Je dois ensuite ajouter tous ces buddys à ma liste d'amis

    updateUno(
      { uuid: uuid1 },
      {
        $push: {
          friends: { $each: buddyToRecommend },
          friends_list: { $each: newBuddyRecommendationList },
        },
      }
    );

    // console.log("amis à ajouter: ", buddiesRecommandedToAdd);
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
