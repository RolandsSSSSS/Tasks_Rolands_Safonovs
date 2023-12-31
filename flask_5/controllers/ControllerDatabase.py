from typing import List

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
                    "INSERT INTO posts (title, body, url_slug, parent_post_id) "
                    "VALUES (:title, :body, :url_slug, :parent_post_id);",
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
                    "UPDATE posts SET (title, body, url_slug, modified, parent_post_id) = "
                    "(:title, :body, :url_slug, DATETIME(), :parent_post_id) WHERE post_id = :post_id",
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
                        post.status,
                        post.parent_post_id
                    ) = col  # pythonic way to copy one by one variable from one tuple to another tuple

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
    def get_post_tags(post_id):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "SELECT tags.tag_id, tags.label "
                    "FROM tags_in_post JOIN tags ON tags_in_post.tag_id = tags.tag_id "
                    "WHERE tags_in_post.post_id = ?",
                    [post_id, ]
                )

                tags = [{"tag_id": tag_id, "label": label} for tag_id, label in cursor.fetchall()]
                return tags

        except Exception as exc:
            print(exc)
            return []

    @staticmethod
    def get_all_tags() -> List[ModelTag]:
        tags = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT * FROM tags"
                )
                for (tag_id, label) in cursor.fetchall():
                    tag = ModelTag()
                    tag.tag_id = tag_id
                    tag.label = label
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