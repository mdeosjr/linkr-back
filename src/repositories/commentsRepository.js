import connection from "../db.js";

async function createComment(textComment, userId, postId) {
  connection.query(
    `
             INSERT INTO "comments"
             ("textComment","userId", "postId")
             VALUES ($1, $2, $3)
         `,
    [textComment, parseInt(userId), parseInt(postId)]
  );
}

async function getNumberOfCommentsByPostId(postId) {
  return connection.query(
    `
        SELECT COUNT(comments."postId") AS "numberOfComments"
        FROM comments 
        WHERE comments."postId" = $1
        `,
    [postId]
  );
}

async function getPostComments(postId) {
  return connection.query(
    `
      SELECT comments.*,
      users.name AS "commentAuthorName",
      users.image AS "commentAuthorImage"
      FROM comments 
      JOIN users ON users.id = comments."userId"
      WHERE comments."postId" = $1
      ORDER BY comments.id ASC
      `,
    [postId]
  );
}

async function getUsersThatAreBeingFollowedByUserId(userId) {
  return connection.query(
    `
      SELECT * FROM follows
      WHERE "userId" = $1
   `,
    [userId]
  );
}

export const commentsRepository = {
  createComment,
  getPostComments,
  getNumberOfCommentsByPostId,
  getUsersThatAreBeingFollowedByUserId,
};
