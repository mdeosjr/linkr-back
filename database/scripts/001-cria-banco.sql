CREATE TABLE "users"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

CREATE TABLE "posts"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "textPost" TEXT,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "hashtags"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "hashtagText" TEXT NOT NULL
);

CREATE TABLE "postsHashtags"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "hashtagId" INTEGER NOT NULL REFERENCES "hashtags"("id"),
    "postId" INTEGER NOT NULL REFERENCES "posts"("id")
);

CREATE TABLE "likes"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "postId" INTEGER NOT NULL REFERENCES "posts"("id"),
    "userId" INTEGER NOT NULL REFERENCES "users"("id")
);

CREATE TABLE "sessions"(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "token" TEXT NOT NULL UNIQUE
);

CREATE TABLE "postsMetadata"(
    id SERIAL NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "linkTitle" TEXT DEFAULT '',
    "linkDescription" TEXT DEFAULT '',
    "linkImage" TEXT DEFAULT 'https://svgur.com/i/fhk.svg'
)
