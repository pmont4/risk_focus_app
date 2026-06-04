import { useRef, useState } from "react";
import { DraggableWindow } from "../draggableWindow/DraggableWindow";
import { HazardTableView } from "../HazardTableView";

export const BaseReportCard = ({ report, sideMenuDisabled, setSideMenuDisabled }) => {

    const winRef = useRef(null);

    const [hoverThreats, setHoverThreats] = useState(false);
    const [hoverCriteria, setHoverCriteria] = useState(false);

    const plantName = report?.report?.plant?.namePlant || "Planta Reporte";
    const reportDate = report?.report?.reportDate || "Fecha no especificada";

    const [isWatchingHazards, setIsWatchingHazards] = useState(false);

    const openHazardViewer = () => {
        setIsWatchingHazards(true);
        setSideMenuDisabled(true);
    }

    const closeHazardViewer = () => {
        setIsWatchingHazards(false);
        setSideMenuDisabled(false);
    }

    return (
        <div
            className="card shadow-sm border-0 d-flex flex-column h-100"
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
            }}
        >
            <DraggableWindow
                ref={winRef}
                isOpen={isWatchingHazards}
                onClose={closeHazardViewer}
                title="Amenazas del Reporte"
                width={1360}
                height={"auto"}
                children={
                    <HazardTableView report={report?.report} onClose={closeHazardViewer} />
                }
            />
            <div className="card-body d-flex flex-column p-4">
                {/* Header */}
                <div className="mb-4 border-bottom pb-3 d-flex align-items-center gap-3">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                        style={{
                            width: '42px',
                            height: '42px',
                            border: '1px solid #dee2e6',
                            color: '#0d6efd',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        <i className="bi bi-file-earmark-bar-graph-fill" style={{ fontSize: '1.25rem' }}></i>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 className="card-title fw-bold mb-1 text-truncate" title={plantName} style={{ color: '#2c3e50', fontSize: '1.15rem' }}>
                            {plantName}
                        </h4>
                        <h6 className="card-subtitle text-muted mb-0 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                            <i className="bi bi-calendar3" style={{ fontSize: '0.75rem' }}></i>
                            {reportDate}
                        </h6>
                    </div>
                </div>

                {/* Main Content & Buttons wrapped in styled boxes */}
                <div className="mt-auto d-flex flex-column gap-3">
                    <div className="bg-light p-3 rounded-3 border" style={{ borderColor: '#dee2e6' }}>
                        <button
                            className="btn btn-primary w-100 fw-semibold shadow-sm position-relative overflow-hidden d-flex justify-content-center align-items-center"
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '8px',
                                letterSpacing: '0.3px',
                                border: 'none',
                                backgroundColor: '#0d6efd',
                                fontSize: '0.9rem'
                            }}
                            onMouseEnter={() => setHoverThreats(true)}
                            onMouseLeave={() => setHoverThreats(false)}
                            disabled={sideMenuDisabled}
                            onClick={openHazardViewer}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '-2px',
                                    top: 0,
                                    bottom: 0,
                                    width: hoverThreats ? 'calc(100% + 4px)' : '24px',
                                    background: 'radial-gradient(circle at 150% 50%, transparent 22px, #f28120 24px)',
                                    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: 0
                                }}
                            />
                            <span style={{ position: 'relative', zIndex: 1 }}>Ver amenazas</span>
                        </button>
                    </div>

                    <div className="bg-light p-3 rounded-3 border" style={{ borderColor: '#dee2e6' }}>
                        <button
                            className="btn btn-primary w-100 fw-semibold shadow-sm position-relative overflow-hidden d-flex justify-content-center align-items-center"
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '8px',
                                letterSpacing: '0.3px',
                                border: 'none',
                                backgroundColor: '#0d6efd',
                                fontSize: '0.9rem'
                            }}
                            onMouseEnter={() => setHoverCriteria(true)}
                            onMouseLeave={() => setHoverCriteria(false)}
                            onClick={() => {
                                console.log('Ver criterios del reporte:', report?.report?.idReport);
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '-2px',
                                    top: 0,
                                    bottom: 0,
                                    width: hoverCriteria ? 'calc(100% + 4px)' : '24px',
                                    background: 'radial-gradient(circle at 150% 50%, transparent 22px, #f28120 24px)',
                                    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: 0
                                }}
                            />
                            <span style={{ position: 'relative', zIndex: 1 }}>Ver criterios</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
