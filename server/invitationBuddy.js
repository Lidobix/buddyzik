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
