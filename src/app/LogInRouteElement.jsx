import { useContext } from "react"
import { LogInContext } from "../context/LogInContext"
import { Navigate, useLocation } from "react-router";
import { LogInPage } from "../pages/LogInPage";

export const LogInRouteElement = () => {

    const { session } = useContext(LogInContext);
    const location = useLocation();

    const from = location.state?.from?.pathname || "/riskfocus";

    if (session) {
        return <Navigate to={from} replace />
    }

    return <LogInPage />
}
