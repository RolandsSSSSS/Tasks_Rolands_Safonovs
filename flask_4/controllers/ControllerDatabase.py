from models.ModelAttachment import ModelAttachment
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
                    "INSERT INTO posts (title, body, url_slug, thumbnail_uuid) "
                    "VALUES (:title, :body, :url_slug, :thumbnail_uuid);",
                    post.__dict__
                )
                post_id = cursor.lastrowid

                for attachment in post.attachments:
                    attachment.post_id = post_id
                    ControllerDatabase.insert_attachment(attachment)

        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def update_post(post: ModelPost):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "UPDATE posts SET (title, body, url_slug, modified, thumbnail_uuid) = "
                    "(:title, :body, :url_slug, DATETIME(), :thumbnail_uuid) WHERE post_id = :post_id",
                    post.__dict__
                )

                for attachment in post.attachments:
                    ControllerDatabase.update_attachment(attachment)

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

                    post.attachments = ControllerDatabase.get_attachments_for_post(post.post_id)

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

                ControllerDatabase.delete_attachments_for_post(post_id)

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

                    post.attachments = ControllerDatabase.get_attachments_for_post(post.post_id)

                    posts.append(post)

        except Exception as exc:
            print(exc)
        return posts

    @staticmethod
    def insert_attachment(attachment: ModelAttachment):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "INSERT INTO attachments (post_id, file_name, file_path) "
                    "VALUES (:post_id, :file_name, :file_path);",
                    attachment.__dict__
                )
        except Exception as exc:
            print(exc)

    @staticmethod
    def update_attachment(attachment: ModelAttachment):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "UPDATE attachments SET (file_name, file_path) = "
                    "(:file_name, :file_path) WHERE attachment_id = :attachment_id",
                    attachment.__dict__
                )
        except Exception as exc:
            print(exc)

    @staticmethod
    def get_attachments_for_post(post_id: int):
        attachments = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "SELECT * FROM attachments WHERE post_id = :post_id;",
                    {'post_id': post_id}
                )
                for row in cursor.fetchall():
                    attachment = ModelAttachment()
                    (
                        attachment.attachment_id,
                        attachment.post_id,
                        attachment.file_name,
                        attachment.file_path
                    ) = row
                    attachments.append(attachment)
        except Exception as exc:
            print(exc)
        return attachments

    @staticmethod
    def delete_attachments_for_post(post_id: int):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "DELETE FROM attachments WHERE post_id = ?;",
                    [post_id]
                )
        except Exception as exc:
            print(exc)