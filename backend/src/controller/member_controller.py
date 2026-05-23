from flask import Blueprint, g
from services.member_service import MemberService
from core.validators import validate
from schemas.member_schema import MembersSchema

workspacemember_blp = Blueprint("workspacemember", __name__)


@workspacemember_blp.route("/", methods=["GET"])
def get_members():
    workspace_id = g.workspace_id
    return MemberService().get_members(workspace_id)