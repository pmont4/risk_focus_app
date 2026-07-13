import { useLogIn } from "../../hooks/useLogIn";
import { LogInContext } from "../LogInContext";

export const LogInProvider = ({ children }) => {

    const {
        session,
        handleLogIn,
        reHidratateSession,
        handleLogOut,
    } = useLogIn();

    return (
        <LogInContext.Provider value={{ session, handleLogIn, reHidratateSession, handleLogOut }}>
            {children}
        </LogInContext.Provider>
    );

}
