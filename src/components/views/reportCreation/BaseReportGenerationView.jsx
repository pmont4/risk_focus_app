import { useReportQuery } from "../../../query/useReportQuery";
import { BaseReportCard } from "../view_components/BaseReportCard";
import { AddButton } from "../view_components/AddButton";
import { DraggableWindow } from "../draggableWindow/DraggableWindow";
import { useState, useRef } from "react";
import { BaseReportCreationView } from "./BaseReportCreationView";
import Swal from "sweetalert2";

export const BaseReportGenerationView = ({ sideMenuDisabled, setSideMenuDisabled }) => {

    const winRef = useRef(null);

    const { useGetAll } = useReportQuery();

    const { data: reportList = [], isLoading, isError } = useGetAll();

    const [isCreating, setIsCreating] = useState(false);

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

    const handleCreateReport = () => {
        setIsCreating(true);
        setSideMenuDisabled(true);
    };

    const handleCloseCreationForm = () => {
        setIsCreating(false);
        setSideMenuDisabled(false);
    }

    const handleCloseCreateReport = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Cancelacion de creación de reporte',
            text: '¿Estas seguro de salir? la información del reporte en progreso no será guardada.',
            showCancelButton: true,
            confirmButtonText: 'Si, salir',
            cancelButtonText: 'No, cancelar',
            target: winRef.current?.getSwalTarget() || document.body
        }).then((result) => {
            if (result.isConfirmed) {
                setIsCreating(false);
                setSideMenuDisabled(false);
            }
        });
    };

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <DraggableWindow
                ref={winRef}
                isOpen={isCreating}
                onClose={handleCloseCreateReport}
                title="Crear Reporte Base"
                width={1400}
                height={"94vh"}
                children={
                    <BaseReportCreationView onClose={handleCloseCreationForm} />
                }
            />
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                    <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Reportes</h2>
                    <AddButton
                        idleElement={<i className="bi bi-plus-lg" style={{ fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}></i>}
                        hoveringElement="Crear reporte"
                        clickAction={handleCreateReport}
                        disabled={sideMenuDisabled}
                    />
                </div>
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
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: '1.5rem',
                        alignItems: 'stretch'
                    }}
                >
                    {reportList.map((item, index) => {
                        return (
                            <BaseReportCard key={index} report={item} sideMenuDisabled={sideMenuDisabled} setSideMenuDisabled={setSideMenuDisabled} />
                        );
                    })}
                </div>
            )}
        </div>
    );

}

