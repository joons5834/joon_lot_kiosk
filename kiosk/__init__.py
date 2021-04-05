import os

from flask import Flask, render_template, url_for
from kiosk.db import get_db
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'kiosk.sqlite'),
        MENU_IMAGE_FOLDER = os.path.join(app.root_path, 'static', 'img', 'menu'),
        ALLOWED_IMG_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
  
    from . import db
    db.init_app(app)
    
    from . import order
    app.register_blueprint(order.bp)
    # app.add_url_rule('/', endpoint='index') # 필요한 코드??

    from . import manage_menu
    app.register_blueprint(manage_menu.bp)
    
    from . import manage_order
    app.register_blueprint(manage_order.bp)
    
    from . import manage_sale
    app.register_blueprint(manage_sale.bp)
    
    from . import auth
    app.register_blueprint(auth.bp)
    
    socketio.init_app(app)
    return app
    
