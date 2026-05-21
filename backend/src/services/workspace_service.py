from repo.workspace_repo import WorkSpaceRepo

class WorkSpaceService:

    def create_workspace(self, workspace_data):
        return WorkSpaceRepo().create_workspace(workspace_data)