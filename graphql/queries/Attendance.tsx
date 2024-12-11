import { gql } from '@apollo/client';

export const GET_TRAINEE_ATTENDANCE = gql`
  query GetTraineeAttendance($traineeId: String) {
    getTraineeAttendance(traineeId: $traineeId) {
      teamName
      traineeId
      allPhasesAverage
      phases {
        phase {
          _id
          name
        }
        phaseAverage
        weeks {
          week
          weekAverage
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
