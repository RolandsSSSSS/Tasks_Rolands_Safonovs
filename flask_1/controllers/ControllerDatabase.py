from models.ModelPost import ModelPost
import sqlite3


class ControllerDatabase:

    @staticmethod
    def __connection():
        return sqlite3.connect("./database/blog.sqlite")

    @staticmethod
    def insert_post(post: ModelPost) -> int:
        post_id = 0
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO posts (body, title, url_slug) "
                    "VALUES (:body, :title, :url_slug);",
                    post.__dict__
                )
                post_id = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]

                ControllerDatabase.get_post(post_id)
        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def delete_post(post_id: int) -> None:
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "DELETE FROM posts WHERE post_id = :post_id",
                    {'post_id': post_id}
                )

        except Exception as exc:
            print(exc)

    @staticmethod
    def get_post(url_slug: str) -> ModelPost:
        post = None
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                query = cursor.execute(
                    "SELECT * FROM posts WHERE url_slug = :url_slug LIMIT 1;",
                    {'url_slug': url_slug}
                )
                if query.rowcount:
                    col = query.fetchone()
                    col_names = [it[0] for it in query.description]

                    post = ModelPost()
                    for key, value in zip(col_names, col):
                        if key == "post_id":
                            post.post_id = value
                        elif key == "title":
                            post.title = value
                        elif key == "body":
                            post.body = value

        except Exception as exc:
            print(exc)
        return post