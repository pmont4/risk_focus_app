import { useState } from "react";
import { SideMenuNav } from "./SideMenuNav";
import { ReportListView } from "./views/ReportListView";

export const MainModal = () => {

    const [view, setView] = useState('view_reports');

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="bg-white shadow-lg rounded-4 d-flex user-select-none" style={{
                    width: '86vw',
                    height: '83vh',
                    overflow: 'hidden'
                }}>
                    <SideMenuNav setView={setView} />
                    {/* MAIN CONTENT */}
                    <div style={{
                        flex: 1,
                        padding: '2rem',
                        overflowY: 'auto',
                        backgroundColor: '#ffffff'
                    }}>
                        {/* Renderizado condicional basado en la opción seleccionada (estado 'view') */}
                        {view === 'view_reports' && (
                            <ReportListView />
                        )}
                        {view === 'view_daily_reports' && (
                            <div>
                                <h2>Reportes Diarios</h2>
                                <p>Aquí puedes ver y gestionar los reportes del día.</p>
                            </div>
                        )}
                        {view === 'view_weekly_reports' && (
                            <div>
                                <h2>Reportes Semanales</h2>
                                <p>Aquí puedes ver el resumen semanal de actividades.</p>
                            </div>
                        )}
                        {view === 'view_inventory' && (
                            <div>
                                <h2>Inventario</h2>
                                <p>Gestión del inventario actual.</p>
                            </div>
                        )}
                        {view === 'view_settings' && (
                            <div>
                                <h2>Configuración</h2>
                                <p>Ajustes generales del sistema.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
