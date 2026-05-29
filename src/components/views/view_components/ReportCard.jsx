export const ReportCard = ({ report }) => {

    const threats = report?.topFiveHazards || [];
    const stage = report?.report?.stage;

    const stageMapping = {
        INITIAL_REPORT: "Iniciando reporte",
        EVALUATING_AREAS: "Evaluando areas",
        HAZARD_PONDERATION_SUMMARY_GENERATED: "Ponderación generada",
    };

    const stageText = stageMapping[stage] || stage || "Estado desconocido";
    const isCompleted = stage === "HAZARD_PONDERATION_SUMMARY_GENERATED";

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
            <div className="card-body d-flex flex-column p-4">
                {/* Header */}
                <div className="mb-3 border-bottom pb-3 d-flex justify-content-between align-items-start">
                    <div style={{ maxWidth: '65%' }}>
                        <h4 className="card-title fw-bold mb-1 text-primary text-truncate" title={report?.report?.plant?.namePlant || "Planta Reporte #1"}>
                            {report?.report?.plant?.namePlant || "Planta Reporte #1"}
                        </h4>
                        <h6 className="card-subtitle text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                            {report?.report?.reportDate || "Fecha no especificada"}
                        </h6>
                    </div>
                    <div>
                        <span className="badge" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.75rem', border: '1px solid #c8e6c9' }}>
                            {stageText}
                        </span>
                    </div>
                </div>

                {/* Main content */}
                <div className="mb-4 flex-grow-1 d-flex flex-column">
                    <div className="bg-light p-3 rounded mb-4 text-dark" style={{ fontSize: '0.85rem' }}>
                        <div className="mb-2">
                            <strong>Dirección:</strong> <br />
                            <span className="text-secondary">{report?.report?.plant?.addressPlant || "Dirección no registrada"}</span>
                        </div>
                        <div>
                            <strong>Coordenadas:</strong> <br />
                            <span className="text-secondary">Lat: {report?.report?.plant?.latitudePlant || "N/A"} | Lng: {report?.report?.plant?.longitudePlant || "N/A"}</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-end mb-2">
                            <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>
                                Top {threats.length > 0 ? threats.length : ''} Amenazas Potenciales:
                            </h6>
                            {threats.length > 0 && (
                                <span className="text-muted text-uppercase" style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                                    Puntaje
                                </span>
                            )}
                        </div>
                        {threats.length > 0 ? (
                            <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                                {threats.map((hazardItem, idx) => {
                                    const threatText = hazardItem?.hazard?.nameHazard || "Amenaza desconocida";
                                    const score = hazardItem?.score ?? 0;

                                    return (
                                        <li key={idx} className="mb-2 d-flex align-items-start justify-content-between">
                                            <div>
                                                <span className="text-danger me-2 fw-bold">!</span>
                                                <span className="text-secondary">{threatText}</span>
                                            </div>
                                            <span className="badge bg-danger rounded-pill align-self-start" style={{ minWidth: '2.5rem' }}>
                                                {score}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-secondary fst-italic mb-0" style={{ fontSize: '0.85rem' }}>
                                No se identificaron amenazas potenciales en este reporte.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto">
                    <button
                        className={`btn w-100 fw-semibold shadow-sm position-relative overflow-hidden d-flex justify-content-center align-items-center ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            letterSpacing: '0.3px',
                            border: 'none',
                            opacity: isCompleted ? 1 : 0.65,
                            cursor: isCompleted ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!isCompleted}
                        onClick={() => {
                            console.log('hola');
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: '-2px', // Asegura que cubra completamente el borde izquierdo sin huecos
                                top: 0,
                                bottom: 0,
                                width: '30px', // Franja más delgada, por lo que la curva se pega más a la izquierda
                                background: isCompleted ? 'radial-gradient(circle at 150% 50%, transparent 28px, #f28120 31px)' : 'radial-gradient(circle at 150% 50%, transparent 28px, #6c757d 31px)'
                            }}
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                            {isCompleted ? 'Ver reporte completo' : 'Reporte no disponible'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

}