import { useReportQuery } from "../../query/useReportQuery";
import { useTypeHazardQuery } from "../../query/useTypeHazardQuery";
import { PonderationCard } from "./view_components/PonderationCard";
import { useRef, useState } from "react";
import { DraggableWindow } from "./draggableWindow/DraggableWindow";
import { PonderationReportView } from "./PonderationReportView";

export const PonderationListView = ({ sideMenuDisabled, setSideMenuDisabled, setView }) => {

    const winRef = useRef(null);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
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

    // Filtrar los reportes que tengan al menos un área
    const displayList = reportList.filter(reportItem => {
        const areas = reportItem?.report?.areas || reportItem?.areas || [];
        return areas.length > 0;
    });

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

    const handleOpenPonderation = (reportData) => {
        const reportContent = reportData?.report || reportData;
        setSelectedReport(reportContent);
        setIsWindowOpen(true);
        setSideMenuDisabled(true);
    };

    const closePonderation = () => {
        setIsWindowOpen(false);
        setSideMenuDisabled(false);
        setTimeout(() => setSelectedReport(null), 300); // Delay clearing to allow animation
    };

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <DraggableWindow
                ref={winRef}
                isOpen={isWindowOpen}
                onClose={closePonderation}
                title="Matriz de Ponderación"
                width={"95vw"}
                height={"auto"}
                children={
                    selectedReport ? <PonderationReportView reportData={selectedReport} onClose={closePonderation} getSwalTarget={() => winRef.current?.getSwalTarget()} /> : null
                }
            />
            <div className="d-flex flex-column gap-2">
                <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Ponderación de Reportes</h2>
                <div
                    style={{
                        height: '4px',
                        background: 'linear-gradient(to right, #000000ff, #202020ff 15%, transparent 100%)',
                        borderRadius: '2px',
                        width: '100%',
                    }}
                />
                <p className="text-secondary mb-0">Seleccione un reporte con áreas definidas para realizar la ponderación.</p>
            </div>

            {mappedReports.length === 0 ? (
                <div className="alert alert-info shadow-sm border-0 bg-white" style={{ borderLeft: '4px solid #0dcaf0' }}>
                    No hay reportes con áreas disponibles para ponderar.
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
                        <PonderationCard key={index} data={report} setView={setView} sideMenuDisabled={sideMenuDisabled} onPonderateClick={handleOpenPonderation} />
                    ))}
                </div>
            )}
        </div>
    );
}
