from repo.member_repo import MemberRepo

class MemberService:
    def get_members(self, workspace_id: str):
        return MemberRepo().get_members(workspace_id)