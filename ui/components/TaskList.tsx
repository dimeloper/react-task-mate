import React from 'react';
import { Task } from '../generated/graphql';
import TaskListItem from './TaskListItem';

interface Props {
  tasks: Task[]
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <ul className="task-list">
      {tasks.map(task => {
        return (<TaskListItem task={task}/>);
      })}
    </ul>
  );
};

export default TaskList;
