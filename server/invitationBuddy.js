import { fetchOne, updateUno } from "./manageDatas.js";

export async function invitationUpdateDataBase(
  uuid1,
  uuid2,
  projection,
  status
) {
  try {
    const buddyToAdd = await fetchOne(
      { uuid: uuid2 },
      {
        projection: projection,
      }
    );

    buddyToAdd.status = status;
    await await updateUno(
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
  }
}
