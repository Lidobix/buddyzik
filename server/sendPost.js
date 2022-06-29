import { fetchOne, updateUno } from "./manageDatas.js";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import cloudinary from "cloudinary";

class Post {
  constructor(uuid, authorUuid, authorName, date, content, picture) {
    this.uuid = uuid;
    this.authorUuid = authorUuid;
    this.authorName = authorName;
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

    await cloudinary.v2.uploader
      .upload(content.postPic, {
        ressource: "image",
        eager: [{ width: 300, crop: "scale" }],
      })
      .then((result) => {
        content.postPic = result.eager[0].secure_url;
      })
      .catch((error) => {
        console.log("error", JSON.stringify(error, null, 2));
      });

    const picture = "";

    const post = new Post(
      uuidv4(),
      sender.uuid,
      extractAuthor.firstName + " " + extractAuthor.lastName,
      new Date().toDateString(),
      content.post,
      content.postPic
    );

    console.log("post : ", post);
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function sendPostProcess(sender, content) {
  const postToSave = await createPost(sender, content);

  await updateUno({ uuid: content.recipient }, { $push: { wall: postToSave } });
  return { status: 200, message: "post posté!" };
}
