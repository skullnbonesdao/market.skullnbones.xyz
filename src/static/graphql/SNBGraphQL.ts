// @ts-ignore
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {createApolloProvider} from "@vue/apollo-option";
import {BatchHttpLink} from "@apollo/client/link/batch-http";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_SNB_GRAPHQL_URL,
});

const httLinkBatch = new BatchHttpLink({
  uri: import.meta.env.VITE_SNB_GRAPHQL_URL,
  batchMax: 3,
  batchInterval: 50,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      "x-hasura-admin-secret": import.meta.env.VITE_SNB_GRAPHQL_TOKEN,
    },
  };
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httLinkBatch) as any,

  cache,
});

export const apolloProvider = createApolloProvider({
  // @ts-ignore
  defaultClient: apolloClient,
});
