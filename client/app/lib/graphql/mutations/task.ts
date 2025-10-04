// client/app/lib/graphql/mutations/task.ts
import { gql } from '@apollo/client';

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($updateTaskId: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $updateTaskId, input: $input) {
      id
      isCompleted
    }
  }
`;