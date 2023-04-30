import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

// @ts-ignore
import { createApolloProvider } from "@vue/apollo-option";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "@apollo/client";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_SNB_GRAPHQL_URL,
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
  link: authLink.concat(httpLink) as any,
  cache,
});

export const apolloProvider = createApolloProvider({
  // @ts-ignore
  defaultClient: apolloClient,
});
