from flask import jsonify, request, g
from functools import wraps
from pydantic_core import ValidationError


def validate(schema, arg:str = None):   

    def decorator(fn):

        @wraps(fn)
        def wrapper(*args, **kwargs):

            try:
                json_data = request.get_json() or request.args.get(arg)

                validated_data = schema(**json_data)

                g.data = validated_data

            except ValidationError as e:

                return (
                    jsonify({"message": "Validation Error", "errors": e.errors()}),
                    400,
                )

            return fn(*args, **kwargs)

        return wrapper

    return decorator
