from models.ModelPost import ModelPost
import sqlite3

from utils.UtilDatabaseCursor import UtilDatabaseCursor


class ControllerDatabase:
    @staticmethod
    def insert_post(post: ModelPost) -> int:
        post_id = 0
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "INSERT INTO posts (title, body, url_slug) "
                    "VALUES (:title, :body, :url_slug);",
                    post.__dict__
                )
                post_id = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]
        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def update_post(post: ModelPost):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "UPDATE posts SET (title, body, url_slug, modified) = "
                    "(:title, :body, :url_slug, DATETIME()) WHERE post_id = :post_id",
                    post.__dict__
                )

        except Exception as exc:
            print(exc)

    @staticmethod
    def get_post(post_id: int = None, url_slug: str = None) -> ModelPost:
        post = None
        try:
            with UtilDatabaseCursor() as cursor:
                if post_id:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE post_id = :post_id LIMIT 1;",
                        {'post_id': post_id}
                    )
                else:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE url_slug = :url_slug LIMIT 1;",
                        {'url_slug': url_slug}
                    )
                if query.rowcount:
                    col = query.fetchone()  # tuple of all * col values
                    post = ModelPost()  # instance of object

                    (
                        post.post_id,
                        post.title,
                        post.body,
                        post.created,
                        post.modified,
                        post.url_slug,
                        post.thumbnail_uuid,
                        post.status
                    ) = col  # pythonic way to copy one by one variable from one tuple to another tuple

        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int) -> None:
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "DELETE FROM posts WHERE post_id = ?;", # use this only if you have 1 or 2 var max!
                    [
                        post_id
                    ]
                )
        except Exception as exc:
            print(exc)

    @staticmethod
    def get_all_posts():
        posts = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "SELECT post_id, title, body, created, modified, url_slug, thumbnail_uuid, status FROM posts;"
                )
                for row in cursor.fetchall():
                    post = ModelPost()

                    (
                        post.post_id,
                        post.title,
                        post.body,
                        post.created,
                        post.modified,
                        post.url_slug,
                        post.thumbnail_uuid,
                        post.status
                    ) = row
                    posts.append(post)
        except Exception as exc:
            print(exc)
        return posts
