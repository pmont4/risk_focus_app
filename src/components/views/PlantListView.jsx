import { usePlantQuery } from "../../query/usePlantQuery";
import { PlantCard } from "./view_components/PlantCard";
import { AddButton } from "./view_components/AddButton";
import { useRef, useState } from "react";
import { DraggableWindow } from "./draggableWindow/DraggableWindow";
import { PlantCreationForm } from "./forms/PlantCreationForm";
import Swal from "sweetalert2";

export const PlantListView = ({ sideMenuDisabled, setSideMenuDisabled }) => {

    const winRef = useRef(null);

    const { useGetAll } = usePlantQuery();
    const { data: plants = [], isLoading, isError } = useGetAll();

    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando plantas...</span>
                </div>
                <span className="ms-3 fw-medium">Cargando plantas...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3 shadow-sm border-0" role="alert">
                <strong>Error:</strong> No se pudieron cargar las plantas. Intente nuevamente más tarde.
            </div>
        );
    }

    const openPlantCreation = () => {
        setIsCreating(true);
        setSideMenuDisabled(true);
    };

    const closePlantCreate = (isSaving) => {
        if (!isSaving) {
            Swal.fire({
                icon: 'warning',
                title: 'Cancelacion de creacion de planta',
                text: '¿Estas seguro de salir? la nueva planta no será guardada.',
                showCancelButton: true,
                confirmButtonText: 'Si, salir',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsCreating(false);
                    setSideMenuDisabled(false);
                }
            });
        } else {
            setIsCreating(false);
            setSideMenuDisabled(false);
        }
    }

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <DraggableWindow
                ref={winRef}
                isOpen={isCreating}
                onClose={() => closePlantCreate(false)}
                title="Nueva Planta"
                width={560}
                height={"auto"}
                children={
                    <PlantCreationForm onClose={closePlantCreate} getSwalTarget={winRef.current?.getSwalTarget} />
                }
            />
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                    <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Lista de Plantas</h2>
                    <AddButton
                        idleElement={<i className="bi bi-plus-lg" style={{ fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}></i>}
                        hoveringElement="Agregar planta"
                        clickAction={() => {
                            openPlantCreation();
                        }}
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

            {plants.length === 0 ? (
                <div className="alert alert-info shadow-sm border-0 bg-white" style={{ borderLeft: '4px solid #0dcaf0' }}>
                    No hay plantas disponibles en este momento.
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
                    {plants.map((item, index) => {
                        return (
                            <PlantCard key={index} plant={item} sideMenuDisabled={sideMenuDisabled} setSideMenuDisabled={setSideMenuDisabled} />
                        );
                    })}
                </div>

            )}
        </div>
    );

}
