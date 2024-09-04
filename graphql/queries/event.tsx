import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($authToken: String) {
    getEvents(authToken: $authToken) {
      end
      hostName
      start
      timeToEnd
      timeToStart
      title
    }
  }
`;