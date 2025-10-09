// client/app/lib/graphql/mutations/project.ts
import { gql } from '@apollo/client';

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
    }
  }
`;
// At the bottom of client/app/lib/graphql/mutations/project.ts

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($updateProjectId: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $updateProjectId, input: $input) {
      id
      title
      description
      status
    }
  }
`;
// At the bottom of client/app/lib/graphql/mutations/project.ts

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($deleteProjectId: ID!) {
    deleteProject(id: $deleteProjectId) {
      id
    }
  }
`;