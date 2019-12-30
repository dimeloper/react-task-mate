import { NextPage } from 'next';
import { withApollo } from '../../lib/apollo';
import { useRouter } from 'next/router';
import { useTaskQuery } from '../../generated/graphql';
import UpdateTaskForm from '../../components/UpdateTaskForm';

const UpdatePage: NextPage = (props) => {
  const router = useRouter();
  const queryId = router.query?.id;
  const id = typeof queryId === 'string' ? parseInt(queryId, 10) : NaN;
  const { loading, error, data } = useTaskQuery({
    variables: {
      id,
    },
  });
  const task = data?.task;
  return (
    <>
      {loading ? (
        <p>Loading..</p>
      ) : error ? (
        <p>An error occured..</p>
      ) : task ? (
        <UpdateTaskForm initialValues={{id: task.id, title: task.title}} />
      ) : (
        <p>Task not found.</p>)
      }
    </>
  );
};

export default withApollo(UpdatePage);
