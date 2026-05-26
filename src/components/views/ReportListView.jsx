import { useReportQuery } from "../../query/useReportQuery";

export const ReportListView = () => {

    const { useGetAll } = useReportQuery();

    const { data: reportList = [], isLoading, isError } = useGetAll();

    if (isLoading) {
        return <div>Cargando reportes...</div>;
    }

    if (isError) {
        return <div>Error al cargar los reportes.</div>;
    }

    return (
        <div className="d-flex flex-column gap-3">
            <h2>Lista de Reportes</h2>
            {reportList.length === 0 ? (
                <p>No hay reportes disponibles.</p>
            ) : (
                <>
                </>
            )}
        </div>
    );

}