from flask import Blueprint, request
from services.member_service import MemberService
from core.validators import validate
from schemas.member_schema import MembersSchema

workspacemember_blp = Blueprint("workspacemember", __name__)


@workspacemember_blp.route("/", methods=["GET"])
# @validate(MembersSchema, arg="workspace_slug")
def get_members():
    workspace_slug = request.args.get("workspace_slug")
    print(workspace_slug)
    return MemberService().get_members(workspace_slug)