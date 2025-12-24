// client/app/lib/graphql/mutations/project.ts
import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      status

      client {
        id
        firstName
        lastName
        businessName
      }

      siteAddress {
        id
        line1
        city
        state
        postcode
      }
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      status

      siteAddress {
        id
        line1
        line2
        city
        state
        postcode
        country
        countryCode
      }
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;
