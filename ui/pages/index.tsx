import React from 'react';
import { NextPage } from 'next';
import { withApollo } from '../lib/apollo';
import { TaskStatus, useTasksQuery } from '../generated/graphql';
import TaskList from '../components/TaskList';

interface InitialProps {}

interface Props extends InitialProps {}

const IndexPage: NextPage<Props, InitialProps> = (props) => {
  const { loading, error, data } = useTasksQuery({
    variables: {
      status: TaskStatus.Active
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error occured.</p>;
  }

  const tasks = data?.tasks;
  return tasks ? (
    <TaskList tasks={tasks}/>
  ) : <p>There are no tasks.</p>;
};

IndexPage.getInitialProps = async () => ({
  greeting: 'Hello World!',
});

const IndexPageWithApollo = withApollo(IndexPage);

export default IndexPageWithApollo;
