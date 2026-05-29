import { useState } from "react";
import logo from '../img/gpi_risk_focus_logo.png';

export const SideMenuNav = ({ setView, sideMenuDisabled }) => {

    const [expandedMenus, setExpandedMenus] = useState({
        generate: true,
    });

    const [activeView, setActiveView] = useState('view_reports');

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
    };

    // Side nav element structure
    const menuItems = [
        {
            id: 'view_reports',
            label: 'Reportes existentes',
            action: () => setView('view_reports')
        },
        {
            id: 'plants',
            label: 'Plantas',
            action: () => setView('view_plants'),
        },
        {
            id: 'generate',
            label: 'Generar reporte',
            action: () => setView('view_base_report_generation'),
            subItems: [
                { id: 'base', label: 'Generar reporte base', action: () => setView('view_base_report_generation') },
            ]
        }
    ];

    return (
        <>
            <div style={{
                width: '250px',
                minWidth: '250px',
                borderRight: '2px solid #e0e0e0',
                padding: '1.5rem 1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <div className="text-center">
                    <img src={logo} alt="GPI Risk Focus Logo" className="img-fluid mx-auto d-block" style={{ width: '85%' }} />
                </div>
                <hr style={{ border: 'none', borderTop: '2px solid #e0e0e0', opacity: 1, margin: '-0.2rem -1rem 1rem -1rem' }} />

                {menuItems.map(item => (
                    <div key={item.id} className="d-flex flex-column">
                        {/* Main element */}
                        <button
                            className="btn btn-light text-start border-0 fw-bold"
                            onClick={() => {
                                if (item.action) item.action();

                                if (item.id != "generate" && item.id != "plants") {
                                    toggleMenu(item.id)
                                }

                                setActiveView(item.id);
                            }}
                            style={{
                                backgroundColor: activeView === item.id || (item.subItems && item.subItems.some(subItem => subItem.id === activeView)) ? '#b4cce4ff' : 'transparent',
                                color: activeView === item.id || (item.subItems && item.subItems.some(subItem => subItem.id === activeView)) ? '#6b6b6bff' : '#333'
                            }}
                            onMouseOver={(e) => {
                                if (activeView !== item.id && !(item.subItems && item.subItems.some(subItem => subItem.id === activeView))) {
                                    e.target.style.backgroundColor = '#dadadaff';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (activeView !== item.id && !(item.subItems && item.subItems.some(subItem => subItem.id === activeView))) {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                            disabled={sideMenuDisabled}
                        >
                            {item.label}
                        </button>

                        {/* sub-elements */}
                        {item.subItems && expandedMenus[item.id] && (
                            <div className="d-flex flex-column mt-1" style={{ paddingLeft: '1.5rem', gap: '0.25rem' }}>
                                {item.subItems.map(subItem => (
                                    <button
                                        key={subItem.id}
                                        className="btn btn-sm text-start border-0"
                                        onClick={() => {
                                            subItem.action();

                                            setActiveView(subItem.id);
                                        }}
                                        style={{
                                            color: '#555',
                                            backgroundColor: activeView === subItem.id ? '#f4f7caff' : 'transparent',
                                        }}
                                        onMouseOver={(e) => {
                                            if (activeView !== subItem.id) {
                                                e.target.style.backgroundColor = '#dadadaff';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (activeView !== subItem.id) {
                                                e.target.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                        disabled={sideMenuDisabled}
                                    >
                                        {subItem.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );

}   
