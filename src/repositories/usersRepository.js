import connection from '../db.js';

async function find(email) {
    return connection.query(`SELECT * FROM users WHERE email=$1`, [email]);
}

async function create(name, email, passwordHash, image) {
    return connection.query(`
            INSERT INTO users (name, email, password, image)
                VALUES ($1, $2, $3, $4)
        `, [name, email, passwordHash, image]);
}

async function createSession(userId, token) {
    return connection.query(`
                INSERT INTO sessions ("userId", token)
                    VALUES ($1, $2)
            `, [userId, token]);
}

async function findSession(token) {
    return connection.query(`
        SELECT * FROM sessions WHERE token=$1
        `, [token]);
}

async function findUser(userId) {
    return connection.query(`
        SELECT * FROM users WHERE id=$1
    `, [userId])
}

async function getUserData(userId) {
    return connection.query(`
        SELECT 
            u.name, u.image, u.id AS "userId",
            p.id AS "postId", p."userId", p.link, p."textPost"
        FROM users u
        LEFT JOIN posts p ON p."userId"=u.id
        WHERE u.id=$1
        ORDER BY "postId" DESC
    `, [userId])
}

async function searchUsersByName(name) {
    return connection.query(`
        SELECT users.id, users.name, users.image FROM users
        WHERE LOWER(name) LIKE LOWER('%${name}%')
    `)
}

async function deleteSession(id){
    return connection.query(`
        DELETE FROM sessions
        WHERE "userId" = $1
    `, [id]);
}

async function followUser(id, followingId){
    return connection.query(`
    SELECT users.*,follows."userId",follows."followingId"
        FROM users
            JOIN follows
                ON users.id=follows."userId"
    WHERE users.id=$1
        AND follows."followingId"=$2;
        `,[id,followingId]);
}
async function insertFollow(userId,followingId){
    return connection.query(`
    INSERT INTO follows ("userId","followingId") 
    VALUES ($1,$2)
    `,[userId,followingId]);
}
async function deleteFollow(userId,followingId){
    return connection.query(`
    DELETE FROM follows
        WHERE follows."userId"=$1
            AND follows."followingId"=$2
    `,[userId,followingId]);

}
async function getFollows(userId,followingId){
    return connection.query(`
    SELECT * 
        FROM follows
            WHERE follows."userId"=$1
                AND follows."followingId"=$2
    `,[userId,followingId]);
}

export const usersRepository = {
    find,
    create,
    createSession,
    findSession,
    findUser,
    getUserData,
    searchUsersByName,
    deleteSession,
    followUser,
    insertFollow,
    deleteFollow,
    getFollows
}