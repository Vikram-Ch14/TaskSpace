from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from controller.user_controller import users_blp
from controller.workspace_controller import workspace_blp
from controller.workspacemember_controller import workspacemember_blp
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

authenticateBluePrint(users_blp, skip={"login", "registerUser"})
authenticateBluePrint(workspace_blp)
authenticateBluePrint(workspacemember_blp)

app.register_blueprint(users_blp, url_prefix="/api/user")
app.register_blueprint(workspace_blp, url_prefix="/api/workspace")
app.register_blueprint(workspacemember_blp, url_prefix="/api/member")


def run_app():

    if Config.flask_env == "development":
        print("Running in development mode")
    else:
        print("Running in production mode")

    app.run(debug=True, host="0.0.0.0", port=8080)


if __name__ == "__main__":
    run_app()
