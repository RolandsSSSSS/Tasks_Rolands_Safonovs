import flask
from flask import request, redirect, url_for

from controllers.ControllerDatabase import ControllerDatabase
from models.ModelPost import ModelPost


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    @blueprint.route("/edit/<post_id>", methods=["POST", "GET"])
    def post_edit():
        if request.method == "POST":
            button_type = request.form.get("button_type")
            post_id = int(request.form.get("post_id"))
            if button_type == "delete":
                ControllerDatabase.delete_post(post_id)
                return redirect('/?deleted=1')

            post = ModelPost()
            post.title = request.form.get('post_title').strip()
            post.body = request.form.get('post_body').strip()
            post.url_slug = request.form.get('url_slug').strip()

            post_id = ControllerDatabase.insert_post(post)

            return redirect(url_for('posts.post_view', url_slug=post.url_slug))

        return flask.render_template(
            'posts/edit.html'
        )

    @staticmethod
    @blueprint.route("/view/<url_slug>", methods=["GET"])
    def post_view(url_slug):
        post = ControllerDatabase.get_post(url_slug=url_slug)
        return flask.render_template(
            'posts/view.html',
            post=post
        )