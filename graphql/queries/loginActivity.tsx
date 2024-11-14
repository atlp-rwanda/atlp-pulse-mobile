import { gql } from '@apollo/client';
export const GET_LOGIN_ACTIVITIES = gql`
  query Query {
    getProfile {
      activity {
        date
        country_code
        country_name
        city
        IPv4
        state
        latitude
        longitude
        postal
        failed
      }
    }
  }
`;
