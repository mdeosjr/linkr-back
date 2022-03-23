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
    SELECT * 
        FROM posts
        WHERE id=$1
        AND "userId"=$2
    `,[id,userId]);
}
async function deletePost(id){
    return connection.query(`
    DELETE 
        FROM posts
        WHERE id=$1
    `,[id]);
}
export const postsRepository = {
  create,
  getTimeline,
  selectPost,
  deletePost
};

// SELECT * FROM posts ORDER BY date DESC LIMIT 20`
