import { gql } from '@apollo/client';

export const CHANGE_USER_PASSWORD = gql`
  mutation ResetUserPassword(
    $currentPassword: String!
    $newPassword: String!
    $confirmPassword: String!
    $token: String!
  ) {
    resetUserPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
      confirmPassword: $confirmPassword
      token: $token
    )
  }
`;