import { useReportQuery } from "../../query/useReportQuery";
import { ReportCard } from "./view_components/ReportCard";

export const ReportListView = () => {

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

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <div className="d-flex flex-column gap-2">
                <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Lista de Reportes</h2>
                <div
                    style={{
                        height: '4px',
                        background: 'linear-gradient(to right, #0d6efd, #0d6efd 15%, transparent 100%)',
                        borderRadius: '2px',
                        width: '100%',
                    }}
                />
            </div>

            {reportList.length === 0 ? (
                <div className="alert alert-info shadow-sm border-0 bg-white" style={{ borderLeft: '4px solid #0dcaf0' }}>
                    No hay reportes disponibles en este momento.
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '1.5rem',
                        alignItems: 'stretch'
                    }}
                >
                    {reportList.map((item, index) => {
                        return (
                            <ReportCard key={index} report={item} />
                        );
                    })}
                </div>

            )}
        </div>
    );
}