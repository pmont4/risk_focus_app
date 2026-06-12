import { useState, useRef } from "react";
import { DraggableWindow } from "../draggableWindow/DraggableWindow";
import { AreaList } from "../AreaList";
import Swal from "sweetalert2";

export const AreaCard = ({ data, setView, sideMenuDisabled, setSideMenuDisabled }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isAreaListOpen, setIsAreaListOpen] = useState(false);

    const winRef = useRef(null);

    const item = data;

    const allThreats = item.categories.flatMap(cat =>
        (cat.threats || []).map(threat => ({ name: threat, category: cat.type }))
    );

    const MAX_CHIPS = 10;
    const displayedThreats = allThreats.slice(0, MAX_CHIPS);
    const extraThreatsCount = allThreats.length - MAX_CHIPS;

    const handleOpen = () => {
        setIsAreaListOpen(true);
        setSideMenuDisabled(true);
    };

    const handleClose = (valid = false) => {
        if (!valid) {
            Swal.fire({
                icon: 'warning',
                title: 'Cancelacion de administración de áreas',
                text: '¿Estas seguro de salir? la información de áreas no sera guardada.',
                showCancelButton: true,
                confirmButtonText: 'Si, salir',
                cancelButtonText: 'No, cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsAreaListOpen(false);
                    setSideMenuDisabled(false);
                }
            });
        } else {
            setIsAreaListOpen(false);
            setSideMenuDisabled(false);
        }
    };

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
                isOpen={isAreaListOpen}
                onClose={handleClose}
                title={`Áreas - ${item.plantName}`}
                width={800}
                height={"auto"}
                children={
                    <AreaList report={item.rawReport?.report || item.rawReport} setView={setView} />
                }
            />
            <div className="card-body d-flex flex-column p-4" style={{ minHeight: 0 }}>
                {/* Header */}
                <div className="mb-4 border-bottom pb-3 d-flex align-items-center justify-content-between gap-3" style={{ flexShrink: 0 }}>
                    <div className="d-flex align-items-center gap-3" style={{ minWidth: 0, flex: 1 }}>
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                            style={{
                                width: '42px',
                                height: '42px',
                                border: '1px solid #dee2e6',
                                color: '#0d6efd',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                flexShrink: 0
                            }}
                        >
                            <i className="bi bi-file-earmark-bar-graph-fill" style={{ fontSize: '1.25rem' }}></i>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 className="card-title fw-bold mb-1 text-truncate" title={item.plantName} style={{ color: '#2c3e50', fontSize: '1.15rem' }}>
                                {item.plantName}
                            </h4>
                            <h6 className="card-subtitle text-muted mb-0 d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                                <i className="bi bi-calendar3" style={{ fontSize: '0.75rem' }}></i>
                                {item.date}
                            </h6>
                        </div>
                    </div>
                </div>

                {/* Main content - Chips */}
                <div className="mb-4 flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                    <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexShrink: 0 }}>
                        <h6 className="fw-bold m-0 text-dark" style={{ fontSize: '0.9rem' }}>
                            Amenazas identificadas:
                        </h6>
                        <span className="badge bg-light text-secondary border">
                            Total: {allThreats.length}
                        </span>
                    </div>

                    {allThreats.length === 0 ? (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-75">
                            <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                            <span style={{ fontSize: '0.85rem' }} className="mt-2">No se han registrado amenazas</span>
                        </div>
                    ) : (
                        <div className="d-flex flex-wrap align-content-start gap-2" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                            {displayedThreats.map((threat, idx) => (
                                <div
                                    key={idx}
                                    className="badge d-flex align-items-center px-3 py-2 fw-medium"
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        color: '#495057',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.2px',
                                        whiteSpace: 'normal',
                                        textAlign: 'left'
                                    }}
                                    title={`Categoría: ${threat.category}`}
                                >
                                    <span className="text-danger me-2" style={{ fontSize: '1.2rem', lineHeight: 0 }}>•</span>
                                    {threat.name}
                                </div>
                            ))}
                            {extraThreatsCount > 0 && (
                                <div
                                    className="badge d-flex align-items-center px-3 py-2 fw-bold"
                                    style={{
                                        backgroundColor: '#e0e7ff',
                                        color: '#4338ca',
                                        border: '1px solid #c7d2fe',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        cursor: 'default'
                                    }}
                                    title={`Hay ${extraThreatsCount} amenazas más no mostradas en el resumen.`}
                                >
                                    +{extraThreatsCount} más...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto" style={{ flexShrink: 0 }}>
                    <button
                        className="btn w-100 fw-semibold shadow-sm position-relative overflow-hidden d-flex justify-content-center align-items-center btn-primary"
                        style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            letterSpacing: '0.3px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        disabled={sideMenuDisabled}
                        onClick={handleOpen}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: '-2px',
                                top: 0,
                                bottom: 0,
                                width: isHovered ? 'calc(100% + 4px)' : '30px',
                                background: 'radial-gradient(circle at 150% 50%, transparent 28px, #f28120 31px)',
                                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 0
                            }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                            Administrar áreas
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}