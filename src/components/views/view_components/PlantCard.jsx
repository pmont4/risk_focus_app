export const PlantCard = ({ plant }) => {

    const plantName = plant?.namePlant || plant?.name || "Planta sin nombre";
    const address = plant?.addressPlant || plant?.address || "Dirección no registrada";
    const lat = plant?.latitudePlant || plant?.latitude || plant?.lat || "N/A";
    const lng = plant?.longitudePlant || plant?.longitude || plant?.lng || "N/A";

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
                {/* Header con título y botones de acción */}
                <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                    <div style={{ maxWidth: '70%' }}>
                        <h4 className="card-title fw-bold mb-1 text-primary text-truncate" title={plantName}>
                            {plantName}
                        </h4>
                    </div>
                    {/* Botones de acción */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-primary shadow-sm"
                            title="Editar Planta"
                            style={{ borderRadius: '6px', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => console.log('Editar planta', plant)}
                        >
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-danger shadow-sm"
                            title="Eliminar Planta"
                            style={{ borderRadius: '6px', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => console.log('Eliminar planta', plant)}
                        >
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Main content - Información de la planta */}
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