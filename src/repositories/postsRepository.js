import connection from "../db.js";

async function create(post) {
  connection.query(
    `
        INSERT INTO posts
        (link, "textPost", "userId")
        VALUES ($1, $2, $3)
    `,
    [post.link, post.text, post.userId]
  );
}

async function getTimeline() {
  return connection.query(`
   SELECT 
      posts.*,
      users.name AS "userName",
      users.image AS "userImage"
   FROM posts
   JOIN users ON users.id = posts."userId"
    ORDER BY date DESC LIMIT 20`);
}

async function selectPost(id, userId){
    return connection.query(`
    SELECT posts.*,"postsHashtags"."postId", "postsHashtags"."id" AS "postHashtagId"
        FROM posts
          LEFT JOIN "postsHashtags"
           ON posts.id="postsHashtags"."postId"
        WHERE posts.id=$1
        AND posts."userId"=$2
    `,[id,userId]);
}
async function deletePost(id){
    return connection.query(`
    DELETE 
        FROM posts
        WHERE id=$1
    `,[id]);
}
async function deletePostHashtags(id){
  return connection.query(`
  DELETE 
    FROM "postsHashtags"
    WHERE id=$1
  `,[id]);
}

async function findPost(id){
  return connection.query(`
    SELECT * FROM posts
    WHERE id = $1
  `, [id]);
}

async function updatePost(id, text) {
  return connection.query(`
    UPDATE posts
    SET "textPost"=$1
    WHERE id = $2
  `, [text, id]);
}

async function getPostByHashtag(hashtag){
  
  return connection.query(`
  SELECT hashtags.*,
   posts.id AS "postId",posts.link,posts."textPost",posts."userId",posts.date,users.name AS "userName",
   users.image AS "userImage"
    FROM hashtags
      JOIN "postsHashtags"
        ON hashtags.id="postsHashtags"."hashtagId"
          JOIN posts
            ON posts.id="postsHashtags"."postId"
			        JOIN users
			        	ON posts."userId"=users.id
    WHERE hashtags."hashtagText"=$1
  `,[hashtag]);
}

async function getLikesPostById(postId,userId) {
  return connection.query(`
    SELECT likes."postId", likes."userId", users.name
    FROM likes
    JOIN users ON users.id = likes."userId"
    WHERE likes."postId" = $1
    `, [postId]);
}

async function getLikesPostByUserId(postId, userId) {
  return connection.query(`
    SELECT likes."postId", likes."userId", users.name
    FROM likes
    JOIN users ON users.id = likes."userId"
    WHERE likes."postId" = $1 and likes."userId" = $2
  `, [postId, userId]);
}

async function postLike(postId, userId) {
  return connection.query(`
    INSERT INTO likes ("postId", "userId")
    VALUES ($1, $2)
  `, [postId, userId]);
}

async function deleteLike(postId, userId) {
  return connection.query(`
    DELETE FROM likes
    WHERE likes."postId" = $1 and likes."userId" = $2
  `, [postId, userId]);
}

async function findLikeByUserId(userId, postId) {
  return connection.query(`
    SELECT * FROM likes
    WHERE "userId" = $1 and "postId" = $2
  `, [userId, postId]);
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
};

// SELECT * FROM posts ORDER BY date DESC LIMIT 20`
