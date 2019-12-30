import React from 'react';
import { Task, TaskStatus } from '../generated/graphql';
import TaskListItem from './TaskListItem';

interface Props {
  tasks: Task[],
  status?: TaskStatus
}

const TaskList: React.FC<Props> = ({ tasks, status }) => {
  return (
    <ul className="task-list">
      {tasks.map(task => {
        return (<TaskListItem task={task} status={status}/>);
      })}
    </ul>
  );
};

export default TaskList;
