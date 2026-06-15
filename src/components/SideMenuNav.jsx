import { useState, useEffect } from "react";
import logo from '../img/gpi_risk_focus_logo.png';

export const SideMenuNav = ({ view, setView, sideMenuDisabled }) => {

    const [expandedMenus, setExpandedMenus] = useState({
        view_base_report_generation: true,
    });

    useEffect(() => {
        if (view === 'view_areas' || view === 'view_ponderation') {
            setExpandedMenus(prev => ({ ...prev, view_base_report_generation: true }));
        }
    }, [view]);

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
    };

    // Side nav element structure
    const menuCategories = [
        {
            category: 'Planta',
            icon: 'bi-building',
            items: [
                {
                    id: 'view_plants',
                    label: 'Plantas',
                    action: () => setView('view_plants'),
                }
            ]
        },
        {
            category: 'Reportes',
            icon: 'bi-file-earmark-text',
            items: [
                {
                    id: 'view_reports',
                    label: 'Bandeja de Reportes',
                    action: () => setView('view_reports')
                },
                {
                    id: 'view_base_report_generation',
                    label: 'Definición de Reportes',
                    action: () => setView('view_base_report_generation'),
                    subItems: [
                        { id: 'view_areas', label: 'Administrar áreas', action: () => setView('view_areas') },
                        { id: 'view_ponderation', label: 'Generar ponderación', action: () => setView('view_ponderation') }
                    ]
                }
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

                {menuCategories.map((categoryGroup, catIndex) => (
                    <div key={catIndex} className="mb-2 d-flex flex-column gap-1">
                        <div className="d-flex align-items-center mb-1 mt-2 px-3">
                            <span
                                className="text-uppercase text-secondary fw-bold d-flex align-items-center gap-1"
                                style={{ fontSize: '0.7rem', letterSpacing: '1px', whiteSpace: 'nowrap' }}
                            >
                                <i className={`bi ${categoryGroup.icon}`} style={{ fontSize: '0.8rem' }}></i>
                                {categoryGroup.category}
                            </span>
                            <div
                                className="ms-2"
                                style={{
                                    width: '150px',
                                    height: '2px',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    borderRadius: '1px'
                                }}
                            />
                        </div>
                        {categoryGroup.items.map(item => (
                            <div key={item.id} className="d-flex flex-column">
                                {/* Main element */}
                                <button
                                    className="btn btn-light text-start border-0 fw-bold"
                                    onClick={() => {
                                        if (item.action) item.action();

                                        if (item.id != "view_base_report_generation" && item.id != "view_plants") {
                                            toggleMenu(item.id)
                                        }
                                    }}
                                    style={{
                                        backgroundColor: view === item.id || (item.subItems && item.subItems.some(subItem => subItem.id === view)) ? '#b4cce4ff' : 'transparent',
                                        color: view === item.id || (item.subItems && item.subItems.some(subItem => subItem.id === view)) ? '#6b6b6bff' : '#333',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        if (view !== item.id && !(item.subItems && item.subItems.some(subItem => subItem.id === view))) {
                                            e.target.style.backgroundColor = '#dadadaff';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (view !== item.id && !(item.subItems && item.subItems.some(subItem => subItem.id === view))) {
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
                                                }}
                                                style={{
                                                    color: '#555',
                                                    backgroundColor: view === subItem.id ? '#f4f7caff' : 'transparent',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (view !== subItem.id) {
                                                        e.target.style.backgroundColor = '#dadadaff';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (view !== subItem.id) {
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
                ))}
            </div>
        </>
    );

}   
