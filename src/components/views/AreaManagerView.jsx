import { useReportQuery } from "../../query/useReportQuery";
import { useTypeHazardQuery } from "../../query/useTypeHazardQuery";
import { AreaCard } from "./view_components/AreaCard";

export const AreaManagerView = ({ sideMenuDisabled, setSideMenuDisabled, setView }) => {

    const { useGetAll } = useReportQuery();
    const { data: reportList = [], isLoading: isLoadingReports } = useGetAll();

    const { useGetAll: useGetAllTypes } = useTypeHazardQuery();
    const { data: typesHazard = [], isLoading: isLoadingTypes } = useGetAllTypes();

    if (isLoadingReports || isLoadingTypes) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos...</span>
                </div>
            </div>
        );
    }

    const displayList = reportList;

    const CATEGORY_ORDER = [
        "AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
        "AMENAZAS INDUSTRIALES",
        "AMENAZAS OCUPACIONALES",
        "AMENAZA TERRORISMO / FACTOR HUMANO",
        "AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL"
    ];

    const mappedReports = displayList.map(reportItem => {
        const reportHazards = reportItem?.report?.hazards || [];

        let categories = typesHazard.map(type => {
            const threatsForType = reportHazards
                .filter(h => h?.typeHazard?.idTypeHazard === type.idTypeHazard)
                .map(h => h.nameHazard);

            return {
                type: type.nameTypeHazard,
                threats: threatsForType
            };
        });

        categories.sort((a, b) => {
            const indexA = CATEGORY_ORDER.indexOf(a.type);
            const indexB = CATEGORY_ORDER.indexOf(b.type);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.type.localeCompare(b.type);
        });

        return {
            id: reportItem?.report?.idReport || reportItem?.idReport,
            plantName: reportItem?.report?.plant?.namePlant || "Planta Desconocida",
            date: reportItem?.report?.reportDate || "Sin Fecha",
            categories: categories,
            rawReport: reportItem
        };
    });

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <div className="d-flex flex-column gap-2">
                <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Administrar Áreas</h2>
                <div
                    style={{
                        height: '4px',
                        background: 'linear-gradient(to right, #000000ff, #202020ff 15%, transparent 100%)',
                        borderRadius: '2px',
                        width: '100%',
                    }}
                />
                <p className="text-secondary mb-0">Seleccione un reporte para gestionar sus áreas.</p>
            </div>

            {mappedReports.length === 0 ? (
                <div className="alert alert-info shadow-sm border-0 bg-white" style={{ borderLeft: '4px solid #0dcaf0' }}>
                    No hay reportes disponibles.
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
                    {mappedReports.map((report, index) => (
                        <AreaCard key={index} data={report} setView={setView} sideMenuDisabled={sideMenuDisabled} setSideMenuDisabled={setSideMenuDisabled} />
                    ))}
                </div>
            )}
        </div>
    );
}
