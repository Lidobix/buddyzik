import { fetchOne, updateUno } from "./manageDatas.js";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import cloudinary from "cloudinary";
import moment from "moment";

class PostToSave {
  constructor(uuid, authorUuid, timestamp, date, content, picture) {
    this.uuid = uuid;
    this.authorUuid = authorUuid;
    this.timestamp = timestamp;
    this.date = date;
    this.content = content;
    this.picPost = picture;
  }
}

async function createPost(sender, content) {
  try {
    await cloudinary.v2.uploader
      .upload(content.postPic, {
        ressource: "image",
        eager: [{ width: 800, crop: "scale" }],
      })
      .then((result) => {
        content.postPic = result.eager[0].secure_url;
      })
      .catch((error) => {
        console.log("error", JSON.stringify(error, null, 2));
      });

    return new PostToSave(
      uuidv4(),
      sender.uuid,
      Date.now(),
      moment().format("dddd D MMMM YYYY, HH:mm"),
      content.post,
      content.postPic
    );
  } catch (error) {
    console.log("ceci est une erreur", error);
  }
}

export async function uploadPostProcess(sender, content) {
  const postToUpload = await createPost(sender, content);

  await updateUno(
    { uuid: content.recipient },
    { $push: { wall: postToUpload } }
  );
  await updateUno(
    { uuid: content.recipient },
    { $push: { wall: { $each: [], $sort: { timestamp: -1 } } } }
  );
  return { status: 200, message: "post posté!" };
}
