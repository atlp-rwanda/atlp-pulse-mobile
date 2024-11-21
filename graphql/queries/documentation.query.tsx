import { gql } from '@apollo/client';

export const GET_DOCUMENTATIONS = gql`
query GetDocumentations {
    getDocumentations {
        id
        title
        for
        description
        subDocuments {
            title
            description
        }
    }
}
`;
