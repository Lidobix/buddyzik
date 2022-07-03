import { fetchOne, fetchSome } from "./manageDatas.js";

export async function downloadPostsProcess(buddy) {
  // console.log("download de post requis");

  // On sort le tableau de post du buddy affiché
  try {
    const allPosts = await fetchSome(
      { uuid: buddy },
      { projection: { _id: 0, wall: 1 } }
    );

    const posts = allPosts[0].wall;

    // console.log("allpost = ", posts);

    for (const post of posts) {
      //   console.log("post.uuid", post.uuid);

      const extractAuthor = await fetchOne(
        { uuid: post.authorUuid },
        { projection: { _id: 0, firstName: 1, lastName: 1, profilePicture: 1 } }
      );
      //   console.log("extractAuthor", extractAuthor);
      post.authorName = extractAuthor.firstName + " " + extractAuthor.lastName;
      post.avatar = extractAuthor.profilePicture;
    }

    // console.log("posts", posts);
    // return { status: 200, message: "ok!", wall: posts };
    return posts;
  } catch (error) {
    console.log(error);
  }
}
