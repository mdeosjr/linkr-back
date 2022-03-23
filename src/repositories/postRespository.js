import connection from "../db.js";

async function selectPost(id){
    return connection.query(`
    SELECT * 
        FROM posts
        WHERE id=$1
    `,[id]);
}
async function deletePost(id){
    return connection.query(`
    DELETE 
        FROM posts
        WHERE id=$1
    `,[id]);
}

export const postRepository= {
    selectPost,
    deletePost
} 