import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from 'graphql-ws';

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_CLIENT_URI || 'https://beta-backend.devpulse.org/',
});

// Create a WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.EXPO_PUBLIC_APOLLO_WS_URI || 'wss://beta-backend.devpulse.org/',
    connectionParams: async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      return {
        authToken,
      };
    },
  })
);

// Use split to send data to each link depending on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Initialize Apollo Client
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
