import { gql } from '@apollo/client';

export const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatar: String) {
    updateAvatar(avatar: $avatar) {
      avatar
    }
  }
`;
