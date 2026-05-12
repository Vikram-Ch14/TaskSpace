from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

cors = CORS(
    app,
    resource={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": "*",
        }
    },
    supports_credentials=True,
    allow_headers="*",
    expose_headers="*",
)


def create_app():

    if os.getenv("FLASK_ENV") == "development":
        print("Running in development mode")
        app.run(debug=True, host="0.0.0.0", port=8080)
    else:
        print("Running in production mode")


if __name__ == "__main__":
    create_app()
