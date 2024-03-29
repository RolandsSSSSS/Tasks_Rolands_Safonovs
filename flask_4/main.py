import flask
from flask import url_for

from controllers.ControllerDatabase import ControllerDatabase
from controllers.ControllerPosts import ControllerPosts

app = flask.Flask(__name__, template_folder='views')
app.register_blueprint(ControllerPosts.blueprint)


@app.route("/", methods=['GET'])
def home():
    params_GET = flask.request.args
    message = ''
    posts = ControllerDatabase.get_all_posts_flattened()
    attachments = ControllerDatabase.get_all_attachments()

    if params_GET.get("deleted"):
        message = 'Post deleted'
    elif params_GET.get("edited"):
        message = 'Post updated'

    return flask.render_template(
        'home.html',
        message=message,
        posts=posts,
        attachments=attachments
    )


app.run(
    host='localhost',  # localhost == 127.0.0.1
    port=8000,  # by default HTTP 80, HTTPS 443 // 8000, 8080
    debug=True
)

app.config['UPLOAD_FOLDER'] = './files'
