import { useContext, useState } from "react";
import { LogInContext } from "../context/LogInContext";
import { AnimatePresence, motion } from "framer-motion";
import logo from '../img/gpi_risk_focus_logo.png';
import '../css/LogInPage.css';

export const LogInPage = () => {

    const { handleLogIn } = useContext(LogInContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await handleLogIn({ username, password });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card" style={{ position: 'relative' }}>

                {/* Loading overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            className="login-loading-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="login-spinner" />
                            <span className="login-loading-text">Verificando credenciales…</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="login-logo-wrapper">
                    <img src={logo} alt="GPI Risk Focus" className="login-logo" />
                </div>

                <h1 className="login-title">Iniciar Sesión</h1>

                <form onSubmit={onSubmit} autoComplete="off">
                    {/* Usuario */}
                    <div className="login-form-group">
                        <label htmlFor="login-user user-select-none" className="login-label">Usuario</label>
                        <div className="login-input-wrapper">
                            <input
                                id="login-user"
                                type="text"
                                className="login-input"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <i className="bi bi-person-fill login-input-icon" />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="login-form-group">
                        <label htmlFor="login-password user-select-none" className="login-label">Contraseña</label>
                        <div className="login-input-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                className="login-input has-toggle"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <i className="bi bi-lock-fill login-input-icon" />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-submit-btn user-select-none"
                        disabled={isLoading}
                    >
                        <i className="bi bi-box-arrow-in-right" />
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-footer">
                    © {new Date().getFullYear()} GPI Consulting Services
                </div>
            </div>
        </div>
    );

}
