import React, { useEffect } from 'react';
import {
  Task,
  TasksDocument,
  TasksQuery,
  TasksQueryVariables,
  TaskStatus,
  useChangeStatusMutation,
  useDeleteTaskMutation,
} from '../generated/graphql';
import Link from 'next/link';

interface Props {
  task: Task;
  status?: TaskStatus;
}

const TaskListItem: React.FC<Props> = ({ task, status }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status },
      });

      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status },
          data: {
            tasks: data.tasks.filter(({ id }) => id !== task.id),
          },
        });
      }
    },
  });
  const handleDeleteClick = async () => {
    await deleteTask({
      variables: {
        id: task.id,
      },
    });
  };

  const [changeStatus, { loading: changingStatus, error: changeStatusError }] = useChangeStatusMutation();

  const handleChangeStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = task.status === TaskStatus.Active ? TaskStatus.Completed : TaskStatus.Active;
    await changeStatus({
      variables: {
        id: task.id,
        status: newStatus,
      },
    });
  };

  useEffect(() => {
    if (error || changeStatusError) {
      alert('An error occurred.');
    }
  }, [error, changeStatusError]);

  return (
    <li className="task-list-item" key={task.id}>
      <label className="checkbox">
        <input type="checkbox" onChange={handleChangeStatus}
               disabled={changingStatus}
               checked={task.status === TaskStatus.Completed}/>
        <span className="checkbox-mark">&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title">
          {task.title}
        </a>
      </Link>
      <button disabled={loading} onClick={handleDeleteClick}
              className="task-list-item-delete">
        &times;
      </button>
    </li>
  );
};

export default TaskListItem;
