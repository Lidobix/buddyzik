import { fetchOne, updateOne } from "./manageDatas.js";

export async function invitationUpdateDataBase(
  uuid1,
  uuid2,
  projection,
  status
) {
  //   await mongoClient.connect();
  try {
    const buddyToAdd = await fetchOne(
      { uuid: uuid2 },
      {
        projection: projection,
      }
    );

    buddyToAdd.status = status;

    // const up1 = await updateOne(
    await updateOne(
      { uuid: uuid1 },
      {
        $push: {
          friends: buddyToAdd,
          friends_list: uuid2,
        },
      }
    );
  } catch (error) {
    console.log(error);
  } finally {
    // await mongoClient.close();
  }
}

// export function invitationProcess(uuid1, uuid2) {
//   // On récupère l'invité et on le colle dans la liste d'amis de l'inviteur
//   const updateHostDB = invitationUpdateDataBase(
//     req.headers.uuid,
//     req.body.buddyTarget,
//     "invited"
//   );

//   // On récupère l'inviteur et on le colle dans la liste d'amis de l'invité
//   const updateGuestDB = invitationUpdateDataBase(
//     req.body.buddyTarget,
//     req.headers.uuid,
//     "pending"
//   );

//   res.json("Votre invitation a bien été envoyée!!");
// }
