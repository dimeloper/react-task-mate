import React from 'react';
import { NextPage } from 'next';
import { withApollo } from '../lib/apollo';
import { TaskStatus, useTasksQuery } from '../generated/graphql';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import { useRouter } from 'next/router';
import TaskFilter from '../components/TaskFilter';

interface InitialProps {}

interface Props extends InitialProps {}

const IndexPage: NextPage<Props, InitialProps> = (props) => {
  const router = useRouter();
  const status = typeof router.query.status === 'string'
    ? router.query.status as TaskStatus
    : undefined;

  const { loading, error, data, refetch } = useTasksQuery({
    variables: {
      status,
    },
    fetchPolicy: 'cache-and-network',
  });

  const tasks = data?.tasks;

  if (loading && !tasks) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error occured.</p>;
  }
  return tasks ? (
    <>
      <CreateTaskForm onTaskCreated={refetch}/>
      <TaskList tasks={tasks} status={status}/>
      <TaskFilter status={status}/>
    </>
  ) : <p>There are no tasks.</p>;
};

IndexPage.getInitialProps = async () => ({
  greeting: 'Hello World!',
});

const IndexPageWithApollo = withApollo(IndexPage);

export default IndexPageWithApollo;
