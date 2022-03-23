import connection from "../db.js";

async function create(post) {
    connection.query(`
        INSERT INTO posts
        (link, "textPost", "userId")
        VALUES ($1, $2, $3)
    `, [post.link, post.text, post.userId]);
}

export const postsRepository = {
    create
}