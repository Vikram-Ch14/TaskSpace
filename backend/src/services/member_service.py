from repo.member_repo import MemberRepo

class MemberService:
    def get_members(self, workspace_slug: str):
        return MemberRepo().get_members(workspace_slug)