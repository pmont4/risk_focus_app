import { Routes, Route, Navigate } from "react-router";
import { MainPage } from "../pages/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1 }
    }
});

export const RiskFocusApp = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route index element={<Navigate to="/evaluate" replace />} />
                <Route path="/evaluate" element={<MainPage />} />

                <Route
                    path="*"
                    element={<Navigate to="/evaluate" replace />}
                />
            </Routes>
        </QueryClientProvider>
    )
}
