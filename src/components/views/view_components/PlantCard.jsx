import { useState, useRef } from "react";
import { DraggableWindow } from "../draggableWindow/DraggableWindow";
import { PlantCreationForm } from "../forms/PlantCreationForm";
import Swal from "sweetalert2";
import { usePlantMutation } from "../../../query/mutation/usePlantMutation";

export const PlantCard = ({ plant, sideMenuDisabled, setSideMenuDisabled }) => {

    const winRef = useRef(null);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500,
    });

    const { removeAsync } = usePlantMutation();

    const [isEditing, setIsEditing] = useState(false);

    const plantName = plant.namePlant;
    const address = plant.addressPlant;
    const lat = plant?.latitudePlant || plant?.latitude || plant?.lat || "N/A";
    const lng = plant?.longitudePlant || plant?.longitude || plant?.lng || "N/A";

    const openEditForm = () => {
        setSideMenuDisabled(true);
        setIsEditing(true);
    };

    const closeEditForm = (isSaving) => {
        if (!isSaving) {
            Swal.fire({
                icon: 'warning',
                title: 'Cancelacion de edición de planta',
                text: '¿Estas seguro de salir? los cambios de la planta no serán guardados.',
                showCancelButton: true,
                confirmButtonText: 'Si, salir',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setSideMenuDisabled(false);
                    setIsEditing(false);
                }
            });
        } else {
            setSideMenuDisabled(false);
            setIsEditing(false);
        }
    };

    const deletePlant = (plantId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Eliminacion de planta',
            text: `¿Estas seguro de eliminar la planta "${plantName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                removeAsync(plantId)
                    .then(() => {
                        Toast.fire({
                            icon: 'success',
                            title: "Planta eliminada correctamente"
                        });
                    })
                    .catch(() => {
                        Toast.fire({
                            icon: 'error',
                            title: "Error al eliminar la planta"
                        });
                    });
            }
        });
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
                isOpen={isEditing}
                onClose={() => closeEditForm(false)}
                title="Editar Planta"
                width={560}
                height={"auto"}
                children={
                    <PlantCreationForm plant={plant} onClose={() => closeEditForm(true)} getSwalTarget={winRef.current?.getSwalTarget} />
                }
            />
            <div className="card-body d-flex flex-column p-4">
                <div className="mb-4 border-bottom pb-3 d-flex align-items-center justify-content-between gap-3">
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
                            <i className="bi bi-building-fill" style={{ fontSize: '1.25rem' }}></i>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 className="card-title fw-bold mb-0 text-truncate" title={plantName} style={{ color: '#2c3e50', fontSize: '1.15rem' }}>
                                {plantName}
                            </h4>
                        </div>
                    </div>
                    <div className="d-flex gap-2" style={{ flexShrink: 0 }}>
                        <button
                            className="btn btn-sm btn-primary shadow-sm"
                            title="Editar Planta"
                            style={{ borderRadius: '6px', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={sideMenuDisabled}
                            onClick={openEditForm}
                        >
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-danger shadow-sm"
                            title="Eliminar Planta"
                            style={{ borderRadius: '6px', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={sideMenuDisabled}
                            onClick={() => {
                                deletePlant(plant.idPlant);
                            }}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>
                <div className="flex-grow-1 d-flex flex-column">
                    <div className="bg-light p-3 rounded text-dark h-100" style={{ fontSize: '0.85rem' }}>
                        <div className="mb-2">
                            <strong>Dirección:</strong> <br />
                            <span className="text-secondary">{address}</span>
                        </div>
                        <div>
                            <strong>Coordenadas:</strong> <br />
                            <span className="text-secondary">Lat: {lat} | Lng: {lng}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}