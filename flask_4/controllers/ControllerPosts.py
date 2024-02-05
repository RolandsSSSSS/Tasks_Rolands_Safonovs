import functools
import os
import uuid

import flask
from flask import request, redirect, url_for
from werkzeug.utils import secure_filename

from controllers.ControllerDatabase import ControllerDatabase
from models.ModelAttachment import ModelAttachment
from models.ModelPost import ModelPost


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    @blueprint.route("/edit/<post_id>", methods=["POST", "GET"])
    def post_edit(post_id=0):
        attachment_model = [0, "null", "null"]
        post = ModelPost()
        tags = ControllerDatabase.get_all_tags()
        post_tags_ids = ControllerDatabase.get_post_tags(post_id)

        if post_id:
            post_id = int(post_id)
        if post_id is not None:
            post = ControllerDatabase.get_post(post_id)

        post_flat = ControllerDatabase.get_all_posts_flattened(exclude_branch_post_id=post_id)
        post_parent_id_by_title = [
            (None, "No parent")
        ]

        for post_cur in post_flat:
            prefix = ''
            if post_cur.depth > 0:
                prefix = ''.join(['-'] * post_cur.depth) + ''
            post_parent_id_by_title.append(
                (
                    post_cur.post_id,
                    f"{prefix}{post_cur.title}"
                )
            )

        if request.method == "POST":
            button_type = request.form.get("button_type")

            if button_type == "delete":
                post_id = int(request.form.get('post_id'))
                ControllerDatabase.delete_post(post_id)
                return redirect(f'/?deleted={post_id}')

            post.title = request.form.get('post_title').strip()
            post.body = request.form.get('post_body').strip()
            post.url_slug = request.form.get('url_slug').strip()

            selected_tags_ids = request.form.getlist('tags')
            ControllerDatabase.update_post_tags(post_id, selected_tags_ids)

            try:
                post.parent_post_id = int(request.form.get('parent_post_id'))
            except:
                post.parent_post_id = None

            attachment = request.files['attachment']
            filename = secure_filename(attachment.filename)
            attachment_path = os.path.join('./static/thumbnails', filename)
            attachment_uuid = str(uuid.uuid4())
            attachment.save(attachment_path)

            if attachment and (button_type == "edit" and post_id > 0):
                attachment_model = ModelAttachment(post_id=post_id, file_name=filename, file_path=attachment_path,
                                                   thumbnail_uuid=attachment_uuid)
                existing_attachment = ControllerDatabase.get_attachments_for_post(post_id)
                if existing_attachment:
                    attachment_model.attachment_id = existing_attachment[0].attachment_id
                    ControllerDatabase.update_attachment(attachment_model)
                else:
                    post.thumbnail_uuid = attachment_uuid
                    ControllerDatabase.insert_attachment(attachment_model)

                ControllerDatabase.update_post(post) if button_type == "edit" else ControllerDatabase.insert_post(post)

                return redirect(f"/?edited={post.url_slug}")

            post_id = ControllerDatabase.insert_post(post)
            attachment_model = ModelAttachment(post_id=post_id, file_name=filename, file_path=attachment_path,
                                               thumbnail_uuid=attachment_uuid)
            ControllerDatabase.insert_attachment(attachment_model)

            return redirect(url_for('posts.post_view', url_slug=post.url_slug))

        return flask.render_template(
            'posts/edit.html',
            post=post,
            post_parent_id_by_title=post_parent_id_by_title,
            tags=tags,
            post_tags_ids=post_tags_ids
        )

    @staticmethod
    @blueprint.route("/view/<url_slug>", methods=["GET"])
    def post_view(url_slug):
        post = ControllerDatabase.get_post(url_slug=url_slug)
        post_tags = ControllerDatabase.get_post_tags(post.post_id)
        return flask.render_template(
            'posts/view.html',
            post=post,
            post_tags=post_tags
        )

    @staticmethod
    @blueprint.route("/index")
    def index():
        return flask.render_template("index.html")
