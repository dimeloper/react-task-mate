import React, { createContext } from 'react';
import { NextPage } from 'next';
import { withApollo } from '../lib/apollo';
import { TaskStatus, useTasksQuery } from '../generated/graphql';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import { useRouter } from 'next/router';
import TaskFilter from '../components/TaskFilter';

interface InitialProps {
  ssr: boolean;
}

interface Props extends InitialProps {}

interface TaskFilterContextValue {
  status?: TaskStatus;
}

export const TaskFilterContext = createContext<TaskFilterContextValue>({});

const IndexPage: NextPage<Props, InitialProps> = ({ ssr }) => {
  const router = useRouter();
  const status = typeof router.query.status === 'string'
    ? router.query.status as TaskStatus
    : undefined;

  const { loading, error, data, refetch } = useTasksQuery({
    variables: {
      status,
    },
    fetchPolicy: ssr ? 'cache-first' : 'cache-and-network',
  });

  const tasks = data?.tasks;

  if (loading && !tasks) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error occured.</p>;
  }

  const taskFilter = { status };

  return tasks ? (
    <TaskFilterContext.Provider value={taskFilter}>
      <CreateTaskForm onTaskCreated={refetch}/>
      <TaskList tasks={tasks}/>
      <TaskFilter/>
    </TaskFilterContext.Provider>
  ) : <p>There are no tasks.</p>;
};

IndexPage.getInitialProps = async (ctx) => {
  return {
    ssr: !!ctx.req,
  };
};

const IndexPageWithApollo = withApollo(IndexPage);

export default IndexPageWithApollo;
