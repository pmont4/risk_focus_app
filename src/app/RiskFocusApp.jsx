import { Routes, Route, Navigate, Outlet } from "react-router";
import { MainPage } from "../pages/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Footer } from "../components/Footer";
import { CompleteReportPage } from "../pages/completeReport/CompleteReportPage";
import { useContext, useEffect } from "react";
import { LogInContext } from "../context/LogInContext";
import { LogInRouteElement } from "./LogInRouteElement";
import { RequireAuth } from "./RequireAuth";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1 }
    }
});

export const RiskFocusApp = () => {

    const {
        session,
        reHidratateSession
    } = useContext(LogInContext);

    useEffect(() => {
        reHidratateSession();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route
                    path="/login"
                    element={<LogInRouteElement />}
                />

                <Route element={<RequireAuth isAuthed={!!session} />}>
                    <Route element={<AppLayout />}>
                        <Route index element={<Navigate to="/riskfocus" replace />} />
                        <Route path="/riskfocus" element={<MainPage />} />
                    </Route>

                    <Route path="/complete-report/:idReport" element={<CompleteReportPage />} />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to={!!session ? "/riskfocus" : "/login"} replace />}
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
