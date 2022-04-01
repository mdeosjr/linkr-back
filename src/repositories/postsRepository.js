import connection from "../db.js";

async function create(post) {
  return await connection.query(
    `
        INSERT INTO posts
        (link, "textPost", "userId")
        VALUES ($1, $2, $3) RETURNING id
    `,
    [post.link, post.text, post.userId]
  );
}

async function getTimeline(id) {
  return connection.query(`
    select p.* ,
    f."followingId",
    u.name as "userName", u.image as "userImage",  
    Null as "reposterId", date as "reposterDate", Null as "reposterName", Null as "repostId"
    from posts p
    join follows f on f."userId" = $1
    join users u on u.id = p."userId"
    where p."userId" = f."followingId"
    UNION ALL
    select 
    p.*, 
    follows."followingId",
    name as "userName", image as "userImage", r."reposterId", r."date" as "reposterDate", r."reposterName", r.id as "repostId"
    from follows 
    join reposts r on r."reposterId" = follows."followingId"
    join posts p on p.id = r."postId"
    join users u on u.id = p."userId"
    WHERE follows."userId" = $1 or r."reposterId" = $1
    ORDER BY "reposterDate" DESC
    `,[id]);
}

async function selectPost(id, userId) {
  return connection.query(
    `
    SELECT posts.*,"postsHashtags"."postId", "postsHashtags"."id" AS "postHashtagId"
        FROM posts
          LEFT JOIN "postsHashtags"
           ON posts.id="postsHashtags"."postId"
        WHERE posts.id=$1
        AND posts."userId"=$2
    `,
    [id, userId]
  );
}

async function deletePost(id) {
  return connection.query(
    `
    DELETE 
        FROM posts
        WHERE id=$1
    `,
    [id]
  );
}

async function deletePostHashtags(id) {
  return connection.query(
    `
  DELETE 
    FROM "postsHashtags"
    WHERE "postId"=$1
  `,
    [id]
  );
}

async function deletePostLikes(id) {
  return connection.query(
    `
  DELETE 
    FROM likes
    WHERE "postId"=$1
  `,
    [id]
  );
}

async function findPost(id) {
  return connection.query(
    `
    SELECT * FROM posts
    WHERE id = $1
  `,
    [id]
  );
}

async function updatePost(id, text) {
  return connection.query(
    `
    UPDATE posts
    SET "textPost"=$1
    WHERE id = $2
  `,
    [text, id]
  );
}

async function getPostByHashtag(hashtag) {
  return connection.query(
    `
  SELECT hashtags."hashtagText", hashtags.id AS "hashtagId",
   posts.id AS "id",posts.link,posts."textPost",posts."userId",posts.date,users.name AS "userName",
   users.image AS "userImage"
    FROM hashtags
      JOIN "postsHashtags"
        ON hashtags.id="postsHashtags"."hashtagId"
          JOIN posts
            ON posts.id="postsHashtags"."postId"
			        JOIN users
			        	ON posts."userId"=users.id
    WHERE hashtags."hashtagText"=$1
    ORDER BY id DESC
  `,
    [hashtag]
  );
}

async function getLikesPostById(postId, userId) {
  return connection.query(
    `
    SELECT likes."postId", likes."userId", users.name
    FROM likes
    JOIN users ON users.id = likes."userId"
    WHERE likes."postId" = $1
    `,
    [postId]
  );
}

async function getLikesPostByUserId(postId, userId) {
  return connection.query(
    `
    SELECT likes."postId", likes."userId", users.name
    FROM likes
    JOIN users ON users.id = likes."userId"
    WHERE likes."postId" = $1 and likes."userId" = $2
  `,
    [postId, userId]
  );
}

async function postLike(postId, userId) {
  return connection.query(
    `
    INSERT INTO likes ("postId", "userId")
    VALUES ($1, $2)
  `,
    [postId, userId]
  );
}

async function deleteLike(postId, userId) {
  return connection.query(
    `
    DELETE FROM likes
    WHERE likes."postId" = $1 and likes."userId" = $2
  `,
    [postId, userId]
  );
}

async function findLikeByUserId(userId, postId) {
  return connection.query(
    `
    SELECT * FROM likes
    WHERE "userId" = $1 and "postId" = $2
  `,
    [userId, postId]
  );
}

async function createMetadata(link, metadata) {
  return connection.query(
    `
    INSERT INTO "postsMetadata" 
    (link, "linkTitle", "linkDescription", "linkImage")
    VALUES ($1, $2, $3, $4)
  `,
    [link, metadata.linkTitle, metadata.linkDescription, metadata.linkImage]
  );
}

async function getMetadataByLink(link) {
  return connection.query(
    `
    SELECT * FROM "postsMetadata"
    WHERE link = $1
  `,
    [link]
  );
}

async function countFollows(userId){
  return await connection.query(`
  SELECT COUNT("followingId") AS following 
    FROM follows
      WHERE "userId"=$1
  `,[userId]);
}

async function getNumberOfRepostsByPostId(postId) {
  return connection.query(`
    SELECT COUNT(reposts."postId") AS "numberOfReposts"
    FROM reposts 
    WHERE reposts."postId" = $1
  `, [postId])
}

async function submitRepost(postId, reposterId, reposterName) {
  return connection.query(`
    INSERT INTO reposts ("postId", "reposterId", "reposterName")
    VALUES ($1, $2, $3)
  `, [postId, reposterId, reposterName])

}

export const postsRepository = {
  create,
  getTimeline,
  selectPost,
  deletePost,
  findPost,
  updatePost,
  getPostByHashtag,
  deletePostHashtags,
  getLikesPostById,
  getLikesPostByUserId,
  postLike,
  deleteLike,
  findLikeByUserId,
  createMetadata,
  getMetadataByLink,
  deletePostLikes,
  countFollows,
  getNumberOfRepostsByPostId,
  submitRepost
};
