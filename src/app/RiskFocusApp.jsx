import { Routes, Route, Navigate } from "react-router";
import { MainPage } from "../pages/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Footer } from "../components/Footer";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1 }
    }
});

export const RiskFocusApp = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <div className="d-flex flex-column min-vh-100">
                <Routes>
                    <Route index element={<Navigate to="/riskfocus" replace />} />
                    <Route path="/riskfocus" element={<MainPage />} />

                    <Route
                        path="*"
                        element={<Navigate to="/riskfocus" replace />}
                    />
                </Routes>

                <Footer />
            </div>
        </QueryClientProvider>
    );

}
