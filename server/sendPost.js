import { fetchOne, updateUno } from "./manageDatas.js";
import { v4 as uuidv4 } from "uuid";

class Post {
  constructor(uuid, author, date, content, picture) {
    this.uuid = uuid;
    this.author = author;
    this.date = date;
    this.content = content;
    this.picture = picture;
  }
}

async function createPost(sender, content) {
  try {
    const extractAuthor = await fetchOne(
      { uuid: sender.uuid },
      { projection: { _id: 0, firstName: 1, lastName: 1 } }
    );

    const picture = "";

    return new Post(
      uuidv4(),
      extractAuthor.firstName + " " + extractAuthor.lastName,
      new Date().toDateString(),
      content.post,
      picture
    );
  } catch (error) {
    console.log(error);
  }
}

export async function sendPostProcess(sender, content) {
  const postToSave = await createPost(sender, content);

  await updateUno({ uuid: content.recipient }, { $push: { wall: postToSave } });
  return { status: 200, message: "post posté!" };
}
