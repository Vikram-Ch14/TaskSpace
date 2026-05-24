from repo.task_repo import TaskRepo

class TaskService():

    def create_task(self, task_data):
        return TaskRepo().create_task(task_data)
    
    def get_taskById(self, task_id):
        return TaskRepo().get_taskById(task_id)
    
    def delete_task(self, task_id):
        return TaskRepo().delete_task(task_id)
    
    def update_task(self, task_id, task_data):
        return TaskRepo().update_task(task_id, task_data)
    
    def get_user_tasks(self):
        return TaskRepo().get_user_tasks()