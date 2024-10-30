import { gql } from '@apollo/client';


export const GET_TRAINEE_ATTENDANCE = gql`
  query GetTraineeAttendance {
    getTraineeAttendance {
      teamName
      traineeId
      phases {
        phase {
          _id
          name
        }
        weeks {
          week
          daysStatus {
            mon {
              date
              score
            }
            tue {
              date
              score
            }
            wed {
              date
              score
            }
            thu {
              date
              score
            }
            fri {
              date
              score
            }
          }
        }
      }
    }
  }
`;
