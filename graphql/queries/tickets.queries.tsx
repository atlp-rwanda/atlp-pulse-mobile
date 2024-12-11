import { gql } from '@apollo/client';

export const GET_TICKETS = gql`
  query GetAllTickets {
    getAllTickets {
      id
      message
      subject
      status
      createdAt
      user {
        id
        email
      }
      assignee {
        id
        email
      }

      replies {
        id
        createdAt
        replyMessage
        sender {
          id
          email
        }
      }
    }
  }
`;
