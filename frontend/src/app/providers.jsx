"use client";

import { client } from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

export default function Providers({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
