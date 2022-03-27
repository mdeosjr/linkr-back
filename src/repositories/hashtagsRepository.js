import connection from "../db.js";

async function findHashtag(hashtag) {
  return connection.query(
    `
   SELECT * 
   FROM hashtags 
   WHERE ("hashtagText") = ($1)
   `,
    [hashtag]
  );
}

async function createHashtag(hashtag) {
  connection.query(
    `
         INSERT INTO hashtags
         ("hashtagText")
         VALUES ($1)
     `,
    [hashtag]
  );
}

async function getHashtagId(hashtag) {
  return connection.query(
    `
      SELECT id 
      FROM hashtags 
      WHERE ("hashtagText") = ($1)
   `,
    [hashtag]
  );
}

async function getPostId({ link, text, userId }) {
  return connection.query(
    `
       SELECT id 
       FROM posts
       WHERE link LIKE $1 AND "textPost" LIKE $2 AND "userId" = $3
    `,
    [link, text, userId]
  );
}

async function createPostsHashtagsEntry(hashtagId, postId) {
  console.log(hashtagId, postId);
  connection.query(
    `
          INSERT INTO "postsHashtags"
          ("hashtagId", "postId")
          VALUES ($1, $2)
      `,
    [parseInt(hashtagId), parseInt(postId)]
  );
}

async function getTrendingHashtags() {
  return connection.query(
    `
   SELECT 
      "hashtagId", 
      COUNT("hashtagId") as count,
      hashtags."hashtagText"
    FROM "postsHashtags"
    JOIN hashtags ON hashtags.id = "postsHashtags"."hashtagId"
    GROUP BY "hashtagId", hashtags."hashtagText"
    ORDER BY count DESC
      `
  );
}

export const hashtagsRepository = {
  findHashtag,
  createHashtag,
  getHashtagId,
  getPostId,
  createPostsHashtagsEntry,
  getTrendingHashtags,
};
