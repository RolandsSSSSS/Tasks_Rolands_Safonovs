from typing import List

from models.ModelAttachment import ModelAttachment
from models.ModelPost import ModelPost
import sqlite3

from models.ModelTag import ModelTag
from utils.UtilDatabaseCursor import UtilDatabaseCursor


class ControllerDatabase:
    @staticmethod
    def insert_post(post: ModelPost) -> int:
        post_id = 0
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "INSERT INTO posts (title, body, url_slug, thumbnail_uuid, parent_post_id) "
                    "VALUES (:title, :body, :url_slug, :thumbnail_uuid, :parent_post_id);",
                    post.__dict__
                )
                post_id = cursor.lastrowid
        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def update_post(post: ModelPost):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "UPDATE posts SET (title, body, url_slug, modified, thumbnail_uuid, parent_post_id) = "
                    "(:title, :body, :url_slug, DATETIME(), :thumbnail_uuid, :parent_post_id) WHERE post_id = :post_id",
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
                        post.status,
                        post.parent_post_id
                    ) = col  # pythonic way to copy one by one variable from one tuple to another tuple

                    post.attachments = ControllerDatabase.get_attachments_for_post(post.post_id)
                    post.children_posts = ControllerDatabase.get_all_posts(parent_post_id=post.post_id)

        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int) -> bool:
        is_success = False
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "DELETE FROM posts WHERE post_id = ?;",  # use this only if you have 1 or 2 var max!
                    [
                        post_id
                    ]
                )

                ControllerDatabase.delete_attachments_for_post(post_id)
                is_success = True
        except Exception as exc:
            print(exc)
        return is_success

    @staticmethod
    def get_all_posts(parent_post_id=None):
        posts = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT post_id FROM posts WHERE parent_post_id {'=' if parent_post_id else 'IS'} ?",
                    [parent_post_id]
                )
                for post_id, in cursor.fetchall():
                    post = ControllerDatabase.get_post(post_id)
                    post.attachments = ControllerDatabase.get_attachments_for_post(post.post_id)
                    posts.append(post)
        except Exception as exc:
            print(exc)
        return posts

    @staticmethod
    def get_all_posts_flattened(parent_post_id=None, exclude_branch_post_id=None):
        posts_flat = []
        try:
            post_hierarchy = ControllerDatabase.get_all_posts(parent_post_id)

            while len(post_hierarchy) > 0:
                post_cur = post_hierarchy.pop(0)

                if post_cur.post_id == exclude_branch_post_id:
                    continue

                if post_cur.parent_post_id is not None:
                    post_cur.depth += 1
                    post_parent = next(
                        iter(it for it in posts_flat if it.post_id == post_cur.parent_post_id))

                    if post_parent:
                        post_cur.depth += post_parent.depth

                post_hierarchy = post_cur.children_posts + post_hierarchy
                posts_flat.append(post_cur)

        except Exception as exc:
            print(exc)
        return posts_flat

    @staticmethod
    def get_post_tags(post_id: int) -> List[ModelTag]:
        tags = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "SELECT tags.tag_id, tags.label "
                    "FROM tags_in_post JOIN tags ON tags_in_post.tag_id = tags.tag_id "
                    "WHERE tags_in_post.post_id = ?",
                    [post_id, ]
                )

                tags = [ModelTag(tag_id, label) for tag_id, label in cursor.fetchall()]

        except Exception as exc:
            print(exc)
        return tags

    @staticmethod
    def get_all_tags() -> List[ModelTag]:
        tags = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT * FROM tags"
                )
                for (tag_id, label, created, is_deleted) in cursor.fetchall():
                    tag = ModelTag()
                    tag.tag_id = tag_id
                    tag.label = label
                    tag.created = created
                    tag.is_deleted = is_deleted
                    tags.append(tag)

        except Exception as exc:
            print(exc)
        return tags

    @staticmethod
    def update_post_tags(post_id, selected_tags_ids):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "DELETE FROM tags_in_post WHERE post_id = ?",
                    [post_id]
                )

                for tag_id in selected_tags_ids:
                    cursor.execute(
                        "INSERT INTO tags_in_post (tag_id, post_id) VALUES (?, ?)",
                        [tag_id, post_id]
                    )

        except Exception as exc:
            print(exc)

    @staticmethod
    def get_all_attachments() -> List[ModelAttachment]:
        attachments = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT * FROM attachments"
                )
                for (attachment_id, post_id, file_name, file_path, thumbnail_uuid) in cursor.fetchall():
                    attachment = ModelAttachment()
                    attachment.attachment_id = attachment_id
                    attachment.post_id = post_id
                    attachment.file_name = file_name
                    attachment.file_path = file_path
                    attachment.thumbnail_uuid = thumbnail_uuid
                    attachments.append(attachment)

        except Exception as exc:
            print(exc)
        return attachments

    @staticmethod
    def insert_attachment(attachment: ModelAttachment):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "INSERT INTO attachments (post_id, file_name, file_path, thumbnail_uuid) "
                    "VALUES (:post_id, :file_name, :file_path, :thumbnail_uuid);",
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
                    attachment = ModelAttachment
                    (
                        attachment.attachment_id,
                        attachment.post_id,
                        attachment.file_name,
                        attachment.file_path,
                        attachment.thumbnail_uuid
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