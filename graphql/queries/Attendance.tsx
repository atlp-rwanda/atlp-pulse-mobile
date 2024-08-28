import { gql } from '@apollo/client';

export const GET_ATTENDANCE = gql`
  query ExampleQuery {
    getTraineeAttendance {
      id
      trainees {
        traineeId
        traineeEmail
        status {
          days
          value
        }
      }
      week
    }
  }
`;

export const GET_ATTENDANCE_BY_ID = gql`
  query GetAttendance($id: ID!) {
    getTraineeAttendanceByID(id: $id) {
      id
      week
      trainees {
        traineeId
        traineeEmail
        status {
          days
          value
        }
      }
    }
  }
`;

export const GET_WEEKLY_ATTENDANCE = gql`
  query GetTraineeAttendanceByID($traineeEmail: String!) {
    getTraineeAttendanceByID(traineeEmail: $traineeEmail) {
      weekNumber
      traineeAttendance {
        days
        value
      }
    }
  }
`;