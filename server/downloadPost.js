import { fetchOne, fetchSome } from "./manageDatas.js";

export async function downloadPostsProcess(buddy) {
  try {
    const allPosts = await fetchSome(
      { uuid: buddy },
      { projection: { _id: 0, wall: 1 } }
    );

    const posts = allPosts[0].wall;

    for (const post of posts) {
      const extractAuthor = await fetchOne(
        { uuid: post.authorUuid },
        { projection: { _id: 0, firstName: 1, lastName: 1, profilePicture: 1 } }
      );

      post.authorName = extractAuthor.firstName + " " + extractAuthor.lastName;
      post.avatar = extractAuthor.profilePicture;
    }

    return posts;
  } catch (error) {
    console.log(error);
  }
}
