import { gql, useSubscription } from '@apollo/client';

export const NotificationSubscription = gql`
  subscription Subscription($receiver: String!) {
    newRating(receiver: $receiver) {
      sender {
        profile {
          name
          avatar
        }
      }
      createdAt
      message
      read
      receiver
      id
    }
  }
`;
export const deleteNotification = gql`
  mutation Mutation($deleteNotificationsId: ID!) {
    deleteNotifications(id: $deleteNotificationsId)
  }
`;
export const markAsRead = gql`
  mutation Mutation($markAsReadId: ID!) {
    markAsRead(id: $markAsReadId)
  }
`;

export const markAllAsRead = gql`
  mutation Mutation {
    markAllAsRead
  }
`;
