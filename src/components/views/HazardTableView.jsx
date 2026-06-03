import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useHazardQuery } from "../../query/useHazardQuery";

export const HazardTableView = ({ report, onClose, onSave }) => {

    const { useGetAll } = useHazardQuery();
    const { data: allHazards = [], isLoading, isError } = useGetAll();

    const [availableHazards, setAvailableHazards] = useState([]);
    const [reportHazards, setReportHazards] = useState([]);

    // Para identificar qué elemento estamos arrastrando
    const [draggedHazardId, setDraggedHazardId] = useState(null);

    // Inicializar las listas una vez que tengamos los datos
    useEffect(() => {
        if (allHazards.length > 0) {
            // Asumimos que el reporte tiene sus hazards en report.report.hazards o report.hazards
            const currentReportHazards = report?.report?.hazards || report?.hazards || [];

            // Extraer los IDs de las amenazas que ya están en el reporte para filtrar
            const reportHazardIds = new Set(currentReportHazards.map(h => h.idHazard));

            // Si el reporte ya viene con las amenazas populadas, usamos esas (para no perder datos extra si los hay)
            // Si no, podríamos buscarlas en allHazards. Vamos a usar allHazards como fuente de verdad para el renderizado consistente.
            const initialReportHazards = allHazards.filter(h => reportHazardIds.has(h.idHazard));
            const initialAvailableHazards = allHazards.filter(h => !reportHazardIds.has(h.idHazard));

            setReportHazards(initialReportHazards);
            setAvailableHazards(initialAvailableHazards);
        }
    }, [allHazards, report]);

    // Función para agrupar amenazas por categoría
    const groupHazardsByCategory = (hazardsArray) => {
        return hazardsArray.reduce((acc, hazard) => {
            const categoryName = hazard?.typeHazard?.nameTypeHazard || 'Sin Categoría';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(hazard);
            return acc;
        }, {});
    };

    const groupedAvailable = groupHazardsByCategory(availableHazards);
    const groupedReport = groupHazardsByCategory(reportHazards);

    // Drag and Drop handlers
    const handleDragStart = (e, hazardId) => {
        setDraggedHazardId(hazardId);
        e.dataTransfer.setData("hazardId", hazardId);
        // Efecto visual al arrastrar
        e.dataTransfer.effectAllowed = "move";

        // Timeout para que no desaparezca inmediatamente el original mientras se arrastra (bug en Chrome)
        setTimeout(() => {
            if (e.target) e.target.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e) => {
        setDraggedHazardId(null);
        if (e.target) e.target.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necesario para permitir el drop
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, destination) => {
        e.preventDefault();
        const hazardIdStr = e.dataTransfer.getData("hazardId");
        if (!hazardIdStr) return;

        const hazardId = Number(hazardIdStr) || hazardIdStr; // Por si el ID es numérico

        if (destination === "report") {
            moveHazard(hazardId, availableHazards, setAvailableHazards, reportHazards, setReportHazards);
        } else if (destination === "available") {
            moveHazard(hazardId, reportHazards, setReportHazards, availableHazards, setAvailableHazards);
        }
        setDraggedHazardId(null);
    };

    // Función genérica para mover una amenaza de una lista a otra
    const moveHazard = (hazardId, sourceList, setSourceList, destList, setDestList) => {
        const hazardToMove = sourceList.find(h => h.idHazard === hazardId || String(h.idHazard) === String(hazardId));
        if (!hazardToMove) return;

        setSourceList(prev => prev.filter(h => h.idHazard !== hazardToMove.idHazard));
        setDestList(prev => [...prev, hazardToMove]);
    };

    const handleSave = () => {
        // Acoplar la lista de hazards a la estructura completa del reporte
        let updatedReport;
        if (report?.report) {
            updatedReport = {
                ...report,
                report: {
                    ...report.report,
                    hazards: reportHazards
                }
            };
        } else {
            updatedReport = {
                ...report,
                hazards: reportHazards
            };
        }

        // Log para visualizar la estructura del JSON del reporte completo actualizado
        console.log("JSON del Reporte completo a guardar:", JSON.stringify(updatedReport, null, 2));

        if (onSave) {
            onSave(updatedReport);
        }

        // Aquí simulamos el guardado de los hazards en el reporte actual.
        // Se puede emitir el array a un backend o actualizar el estado del parent.
        Swal.fire({
            title: 'Reporte actualizado',
            text: 'Revisa la consola para ver el JSON completo del reporte actualizado.',
            icon: 'success',
            confirmButtonColor: '#0d6efd'
        }).then(() => {
            if (onClose) onClose();
        });
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando amenazas...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-4 border-0 shadow-sm" role="alert">
                Hubo un problema al cargar las amenazas. Por favor, intenta de nuevo.
            </div>
        );
    }

    // Renderizador de listas por categoría
    const renderHazardList = (groupedData, droppableId) => {
        const categories = Object.keys(groupedData).sort();

        if (categories.length === 0) {
            return (
                <div className="d-flex flex-column justify-content-center align-items-center p-5 text-muted h-100" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', border: '2px dashed #dee2e6' }}>
                    <i className="bi bi-inbox fs-1 mb-2"></i>
                    <p className="mb-0">No hay amenazas en esta lista.</p>
                </div>
            );
        }

        return (
            <div className="d-flex flex-column gap-3 w-100 pb-2">
                {categories.map((category) => (
                    <div key={category} className="category-section">
                        <div className="d-flex align-items-center mb-2 px-2">
                            <i className="bi bi-tags-fill me-2" style={{ color: '#0d6efd' }}></i>
                            <h6 className="fw-bold mb-0 text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {category}
                            </h6>
                            <span className="badge bg-secondary ms-auto rounded-pill" style={{ opacity: 0.8 }}>
                                {groupedData[category].length}
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <AnimatePresence>
                                {groupedData[category].map((hazard) => (
                                    <motion.div
                                        key={hazard.idHazard}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, hazard.idHazard)}
                                        onDragEnd={handleDragEnd}
                                        className={`card border-0 shadow-sm ${draggedHazardId === hazard.idHazard ? 'dragging' : ''}`}
                                        style={{
                                            cursor: 'grab',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0d6efd',
                                            backgroundColor: '#ffffff',
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (draggedHazardId !== hazard.idHazard) {
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (draggedHazardId !== hazard.idHazard) {
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                                            }
                                        }}
                                    >
                                        <div className="card-body p-3 d-flex align-items-center justify-content-between gap-2">
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px', backgroundColor: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' }}
                                                >
                                                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '0.9rem' }}></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                                        {hazard.nameHazard}
                                                    </h6>
                                                </div>
                                            </div>

                                            {/* Action buttons based on which list it is in */}
                                            {droppableId === "available" ? (
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center hover-primary"
                                                    style={{ width: '28px', height: '28px', transition: 'all 0.2s' }}
                                                    onClick={() => moveHazard(hazard.idHazard, availableHazards, setAvailableHazards, reportHazards, setReportHazards)}
                                                    title="Añadir al reporte"
                                                >
                                                    <i className="bi bi-arrow-right-short fs-5 text-secondary"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center hover-danger"
                                                    style={{ width: '28px', height: '28px', transition: 'all 0.2s' }}
                                                    onClick={() => moveHazard(hazard.idHazard, reportHazards, setReportHazards, availableHazards, setAvailableHazards)}
                                                    title="Quitar del reporte"
                                                >
                                                    <i className="bi bi-x-lg text-danger" style={{ fontSize: '0.8rem' }}></i>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="d-flex flex-column" style={{ backgroundColor: '#ffffff', height: '70vh', minHeight: '500px', maxHeight: '800px' }}>

            {/* Header / Top bar */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Gestión de Amenazas</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Arrastra las amenazas para incluirlas o excluirlas del reporte.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="btn btn-primary px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', letterSpacing: '0.5px' }}
                >
                    <i className="bi bi-save2-fill"></i>
                    Guardar Cambios
                </button>
            </div>

            {/* Main Content: Two Columns */}
            <div className="d-flex flex-grow-1 p-4 gap-4" style={{ overflow: 'hidden' }}>

                {/* Column 1: Available Hazards */}
                <div
                    className="d-flex flex-column flex-grow-1 rounded-4 shadow-sm"
                    style={{
                        flexBasis: '50%',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        overflow: 'hidden'
                    }}
                >
                    <div className="p-3 border-bottom d-flex align-items-center gap-2" style={{ backgroundColor: '#ffffff' }}>
                        <div className="bg-primary bg-opacity-10 p-2 rounded">
                            <i className="bi bi-list-task text-primary fs-5"></i>
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Amenazas Disponibles</h5>
                    </div>

                    <div
                        className="flex-grow-1 p-3"
                        style={{ overflowY: 'auto' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, "available")}
                    >
                        {renderHazardList(groupedAvailable, "available")}
                    </div>
                </div>

                {/* Drop Zone Divider */}
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
                        <i className="bi bi-arrow-left-right fs-5"></i>
                    </div>
                </div>

                {/* Column 2: Report Hazards */}
                <div
                    className="d-flex flex-column flex-grow-1 rounded-4 shadow-sm"
                    style={{
                        flexBasis: '50%',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        overflow: 'hidden'
                    }}
                >
                    <div className="p-3 border-bottom d-flex align-items-center gap-2" style={{ backgroundColor: '#ffffff' }}>
                        <div className="bg-success bg-opacity-10 p-2 rounded">
                            <i className="bi bi-clipboard2-check-fill text-success fs-5"></i>
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Amenazas del Reporte</h5>
                    </div>

                    <div
                        className="flex-grow-1 p-3"
                        style={{ overflowY: 'auto' }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, "report")}
                    >
                        {renderHazardList(groupedReport, "report")}
                    </div>
                </div>

            </div>

            {/* Global Styles para hovers sutiles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-primary:hover {
                    background-color: rgba(13, 110, 253, 0.1) !important;
                }
                .hover-primary:hover i {
                    color: #0d6efd !important;
                }
                .hover-danger:hover {
                    background-color: rgba(220, 53, 69, 0.1) !important;
                }
                .dragging {
                    opacity: 0.5;
                    border: 2px dashed #0d6efd !important;
                }
            `}} />
        </div>
    );

}