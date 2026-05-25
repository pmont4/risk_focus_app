import { useState } from "react";

export const SideMenuNav = ({ view, setView }) => {

    const [expandedMenus, setExpandedMenus] = useState({
        generate: true
    });

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
            id: 'generate',
            label: 'Generar reportes',
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
                borderRight: '2px solid #e0e0e0', // Línea vertical separadora
                padding: '1.5rem 1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {menuItems.map(item => (
                    <div key={item.id} className="d-flex flex-column">
                        {/* Main element */}
                        <button
                            className="btn btn-light text-start border-0 fw-bold"
                            onClick={() => {
                                if (item.action) item.action();

                                if (item.id != "generate") {
                                    toggleMenu(item.id)
                                }
                            }}
                            style={{
                                backgroundColor: view === item.action.name || (item.subItems && expandedMenus[item.id]) ? '#f8f9fa' : 'transparent',
                                color: '#333'
                            }}
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
                                        onClick={subItem.action}
                                        style={{
                                            color: '#555',
                                            backgroundColor: view === subItem.action.name ? '#e9ecef' : 'transparent',
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#f1f3f5'}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = 'transparent'
                                        }}
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
