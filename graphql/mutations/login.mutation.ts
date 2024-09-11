import { gql } from '@apollo/client';

export const ORG_LOGIN_MUTATION = gql`
  mutation LoginOrg($orgInput: OrgInput) {
    loginOrg(orgInput: $orgInput) {
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Mutation($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        id
        role
        email
        password
        profile {
          id
          firstName
          lastName
          user {
            id
            role
            email
            password
            profile {
              id
              firstName
              lastName
              name
              address
              city
              country
              phoneNumber
              biography
              avatar
              cover
            }
          }
        }
      }
    }
  }
`;
