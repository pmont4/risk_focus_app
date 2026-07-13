import { useContext } from 'react';
import { MainModal } from '../components/MainModal';
import { LogInContext } from '../context/LogInContext';
import watermarkLogo from '../img/watermark_logo.png';

export const MainPage = () => {

    const { handleLogOut } = useContext(LogInContext);

    return (
        <div
            className="flex-fill d-flex flex-column w-100"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${watermarkLogo})`,
                backgroundSize: 'auto 116%',
                backgroundPosition: 'calc(100% + 53px) center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Logout button */}
            <button
                onClick={handleLogOut}
                title="Cerrar sesión"
                className="logout-btn"
                style={{
                    position: 'fixed',
                    top: '24px',
                    right: '32px',
                    zIndex: 1055,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                    e.currentTarget.style.color = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.12)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
            >
                <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }} />
                Cerrar sesión
            </button>

            <MainModal />
        </div>
    );

}
