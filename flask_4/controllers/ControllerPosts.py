import os
import uuid

import flask
from flask import request, redirect, url_for
from werkzeug.utils import secure_filename

from controllers.ControllerDatabase import ControllerDatabase
from models.ModelAttachment import ModelAttachment
from models.ModelPost import ModelPost

ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    @blueprint.route("/edit/<post_id>", methods=["POST", "GET"])
    def post_edit(post_id=None):
        post = ModelPost()

        if post_id is not None:
            post = ControllerDatabase.get_post(post_id)

        if request.method == "POST":
            button_type = request.form.get("button_type")

            if button_type == "delete":
                post_id = int(request.form.get('post_id'))
                ControllerDatabase.delete_post(post_id)
                return redirect(f'/?deleted={post_id}')

            post.title = request.form.get('post_title').strip()
            post.body = request.form.get('post_body').strip()
            post.url_slug = request.form.get('url_slug').strip()
            post.thumbnail_uuid = request.form.get('thumbnail_uuid')

            if button_type != "edit" and not post.thumbnail_uuid:
                post.thumbnail_uuid = str(uuid.uuid4())

            if button_type == "edit":
                ControllerDatabase.update_post(post)
                return redirect(f"/?edited={post.url_slug}")
            else:
                post_id = ControllerDatabase.insert_post(post)

            attachment = request.files['attachment']
            if attachment:
                filename = secure_filename(attachment.filename)
                attachment_path = os.path.join('./files', filename)
                attachment.save(attachment_path)

                attachment_model = ModelAttachment(post_id=post.post_id, file_name=filename, file_path=attachment_path)

                if button_type == "edit" and post.post_id > 0:
                    existing_attachment = ControllerDatabase.get_attachments_for_post(post.post_id)
                    if existing_attachment:
                        attachment_model.attachment_id = existing_attachment[0].attachment_id
                        ControllerDatabase.update_attachment(attachment_model)
                    else:
                        ControllerDatabase.insert_attachment(attachment_model)
                else:
                    ControllerDatabase.insert_attachment(attachment_model)

            return redirect(url_for('posts.post_view', url_slug=post.url_slug))

        return flask.render_template(
            'posts/edit.html',
            post_id=post_id,
            post=post
        )

    @staticmethod
    @blueprint.route("/view/<url_slug>", methods=["GET"])
    def post_view(url_slug):
        post = ControllerDatabase.get_post(url_slug=url_slug)
        return flask.render_template(
            'posts/view.html',
            post=post
        )

    @staticmethod
    @blueprint.route("/index")
    def index():
        pages = [
            {"title": "Home Page", "description": "In this page you can see all posts, edit, update and delete them"},
            {"title": "New Post Page", "description": "In this page you can add new post"},
            {"title": "Edit Post Page", "description": "In this page you can update post"},
            {"title": "View Post Page", "description": "In this page you can see post title and body, as well you can "
                                                       "delete or update from this page"},
            {"title": "Index Page", "description": "In this page you can see all pages in this project, you are in it "
                                                   "now."},
        ]
        return flask.render_template("index.html", pages=pages)
