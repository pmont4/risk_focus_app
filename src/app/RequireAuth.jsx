import { Navigate, Outlet, useLocation } from "react-router"

export const RequireAuth = ({ isAuthed }) => {

    const location = useLocation();

    if (!isAuthed) {
        return (
            <Navigate
                to={"/login"}
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;

}
