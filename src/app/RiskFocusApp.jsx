import { Routes, Route, Navigate, Outlet } from "react-router";
import { MainPage } from "../pages/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Footer } from "../components/Footer";
import { CompleteReportPage } from "../pages/completeReport/CompleteReportPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1 }
    }
});

export const RiskFocusApp = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route index element={<Navigate to="/riskfocus" replace />} />
                    <Route path="/riskfocus" element={<MainPage />} />
                </Route>

                <Route path="/complete-report/:idReport" element={<CompleteReportPage />} />

                <Route
                    path="*"
                    element={<Navigate to="/riskfocus" replace />}
                />
            </Routes>
        </QueryClientProvider>
    );

}

export const AppLayout = () => {

    return (
        <div className="d-flex flex-column min-vh-100">
            <Outlet />
            <Footer />
        </div>
    );

}
