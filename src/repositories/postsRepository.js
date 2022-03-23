import connection from "../db.js";

async function create(post) {
    connection.query(`
        INSERT INTO posts
        (link, "textPost", "userId")
        VALUES ($1, $2, $3)
    `, [post.link, post.text, post.userId]);
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
    selectPost,
    deletePost
}