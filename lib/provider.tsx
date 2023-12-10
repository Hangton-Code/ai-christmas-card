"use client";

import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

type Prop = {
  children: React.ReactNode;
};

export const Provider: React.FC<Prop> = ({ children }: Prop) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
