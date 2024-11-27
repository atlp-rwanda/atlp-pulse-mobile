import { gql } from '@apollo/client';

export const EnableTwoFactorAuth = gql`
  mutation EnableTwoFactorAuth($email: String!) {
    enableTwoFactorAuth(email: $email)
  }
`;

export const DisableTwoFactorAuth = gql`
  mutation DisableTwoFactorAuth($email: String!) {
    disableTwoFactorAuth(email: $email)
  }
`;

export const LOGIN_WITH_2FA = gql`
  mutation LoginWithTwoFactorAuthentication($email: String!, $otp: String!) {
    loginWithTwoFactorAuthentication(email: $email, otp: $otp) {
      token
      user {
        id
        role
        email
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
      message
    }
  }
`;