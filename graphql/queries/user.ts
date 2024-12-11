import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      firstName
      lastName
      phoneNumber
      address
      city
      country
      avatar
      cover
      name
      biography
      githubUsername
      user {
        id
        organizations
        email
        pushNotifications
        emailNotifications
        twoFactorAuth
        role
        pushNotificationTokens
        team {
          id
          name
          cohort {
            name
            phase {
              name
            }
            program {
              name
            }
            startDate
          }
        }
        cohort {
          name
          program {
            name
          }
          phase {
            name
          }
        }
        program {
          name
        }
      }
    }
  }
`;
export const GET_TRAINEE_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      firstName
      name
      city
      country
      address
      phoneNumber
      biography
      avatar
      cover
      lastName
      resume
    }
  }
`;

export const ADD_PUSH_NOTIFICATION_TOKEN = gql`
  mutation AddPushNotificationToken($pushToken: String!) {
    addPushNotificationToken(pushToken: $pushToken)
  }
`;

export const REMOVE_PUSH_NOTIFICATION_TOKEN = gql`
  mutation RemovePushNotificationToken($pushToken: String!) {
    removePushNotificationToken(pushToken: $pushToken)
  }
`;
