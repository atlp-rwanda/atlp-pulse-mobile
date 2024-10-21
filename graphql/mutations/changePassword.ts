import { gql } from '@apollo/client';

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangeUserPassword(
    $currentPassword: String!
    $newPassword: String!
    $confirmPassword: String!
    $token: String!
  ) {
    changeUserPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
      confirmPassword: $confirmPassword
      token: $token
    )
  }
`;
