from flask import Flask
from flask_cors import CORS
from controller.users import users_blp
from dotenv import load_dotenv
from middleware.auth import authenticateBluePrint
from config import *

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": "*",
        }
    },
    supports_credentials=True,
)

authenticateBluePrint(users_blp, skip={"login", "register"})

app.register_blueprint(users_blp, url_prefix="/api/users")


def run_app():

    if Config.flask_env == "development":
        print("Running in development mode")
    else:
        print("Running in production mode")

    app.run(debug=True, host="0.0.0.0", port=8080)


if __name__ == "__main__":
    run_app()
