import { useCallback, useRef, useState } from "react";
import Swal from "sweetalert2";
import { logInAPI } from "../query/api/API";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});

export const useLogIn = () => {

    const logginInRef = useRef(false);

    const [session, setSession] = useState(undefined);

    const handleLogIn = useCallback(async (login = {}) => {
        try {
            if (logginInRef.current) return;
            logginInRef.current = true;

            const response = await logInAPI.post('', login);
            if (response.status == 200) {
                const sessionData = response.data;
                setSession(sessionData);
                localStorage.setItem('session', JSON.stringify(sessionData));
                Toast.fire(
                    {
                        icon: 'success',
                        title: 'Inicio de sesión',
                        text: 'Inicio de sesión exitoso.',
                        timer: 3000,
                    }
                );
            }
        } catch (error) {
            if (error.response?.status === 401) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Inicio de sesión',
                    text: error.response.data || 'Credenciales inválidas.',
                    timer: 3000,
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Inicio de sesión',
                    text: 'No se pudo inicar sesión debido a una falla en el sistema, verifcar los logs.',
                    timer: 3000,
                });
            }

            setSession(undefined);
        } finally {
            logginInRef.current = false;
        }
    }, []);

    const reHidratateSession = useCallback(() => {
        const sessionData = localStorage.getItem('session');
        if (sessionData) {
            setSession(JSON.parse(sessionData));
        }
    }, []);

    const handleLogOut = () => {
        setSession(undefined);
        localStorage.removeItem('session');
    }

    return {
        session,
        handleLogIn,
        reHidratateSession,
        handleLogOut,
    }

}
