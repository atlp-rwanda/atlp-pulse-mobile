import { gql } from '@apollo/client';

export const TRAINEE_RATING = gql`
  query Query {
    fetchRatingsTrainee {
      user {
        id
        email
      }
      sprint
      phase
      sprint
      quantity
      quality
      professional_Skills
      average
      cohort {
        name
        phase {
          name
        }
        coordinator {
          email
          profile {
            name
          }
        }
      }
      feedbacks {
        sender {
          email
          id
          profile {
            avatar
            name
          }
          role
        }
        content
        createdAt
      }
    }
  }
`;
