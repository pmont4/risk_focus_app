import { useReportQuery } from "../../query/useReportQuery";
import { ReportCard } from "./view_components/ReportCard";

export const ReportListView = ({ setView }) => {

    const { useGetAll } = useReportQuery();

    const { data: reportList = [], isLoading, isError } = useGetAll();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando reportes...</span>
                </div>
                <span className="ms-3 fw-medium">Cargando reportes...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3 shadow-sm border-0" role="alert">
                <strong>Error:</strong> No se pudieron cargar los reportes. Intente nuevamente más tarde.
            </div>
        );
    }

    const STAGE_ORDER = ["INITIAL_REPORT", "EVALUATING_AREAS", "HAZARD_PONDERATION_SUMMARY_GENERATED"];

    const stageMapping = {
        INITIAL_REPORT: "Iniciando reporte",
        EVALUATING_AREAS: "Evaluando áreas",
        HAZARD_PONDERATION_SUMMARY_GENERATED: "Ponderación generada",
    };

    const groupedReports = reportList.reduce((acc, report) => {
        const stage = report?.report?.stage || report?.stage || "UNKNOWN";
        if (!acc[stage]) acc[stage] = [];
        acc[stage].push(report);
        return acc;
    }, {});

    const sortedStages = Object.keys(groupedReports).sort((a, b) => {
        const indexA = STAGE_ORDER.indexOf(a);
        const indexB = STAGE_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
    });

    const allCompleted = sortedStages.length === 1 && sortedStages[0] === "HAZARD_PONDERATION_SUMMARY_GENERATED";

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <div className="d-flex flex-column gap-2">
                <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Lista de Reportes</h2>
                <div
                    style={{
                        height: '4px',
                        background: 'linear-gradient(to right, #000000ff, #202020ff 15%, transparent 100%)',
                        borderRadius: '2px',
                        width: '100%',
                    }}
                />
            </div>

            {reportList.length === 0 ? (
                <div className="alert alert-info shadow-sm border-0 bg-white" style={{ borderLeft: '4px solid #0dcaf0' }}>
                    No hay reportes disponibles en este momento.
                </div>
            ) : allCompleted ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '1.5rem',
                        alignItems: 'stretch'
                    }}
                >
                    {reportList.map((item, index) => (
                        <ReportCard key={index} report={item} setView={setView} />
                    ))}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {sortedStages.map(stage => (
                        <div key={stage} className="d-flex flex-column gap-3">
                            <h5 className="m-0 fw-bold text-secondary border-bottom pb-2">
                                <i className="bi bi-tag-fill me-2" style={{ fontSize: '0.9rem' }}></i>
                                {stageMapping[stage] || stage}
                            </h5>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                    gap: '1.5rem',
                                    alignItems: 'stretch'
                                }}
                            >
                                {groupedReports[stage].map((item, index) => (
                                    <ReportCard key={`${stage}-${index}`} report={item} setView={setView} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}