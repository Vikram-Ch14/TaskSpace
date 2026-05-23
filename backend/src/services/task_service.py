from repo.task_repo import TaskRepo

class TaskService():

    def create_task(self, task_data):
        return TaskRepo().create_task(task_data)