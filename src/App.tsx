import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient.ts";
import { DashboardPage } from "./pages/DashboardPage.tsx";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
      <Toaster position="top-right" closeButton />
    </QueryClientProvider>
  );
}
