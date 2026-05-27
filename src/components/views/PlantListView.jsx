import { useState } from "react";
import { usePlantQuery } from "../../query/usePlantQuery";
import { PlantCard } from "./view_components/PlantCard";

export const PlantListView = () => {

    const [isHovered, setIsHovered] = useState(false);

    const { useGetAll } = usePlantQuery();
    const { data: plants = [], isLoading, isError } = useGetAll();

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


    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center w-100 mb-1">
                    <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Lista de Plantas</h2>

                    <button
                        className="btn btn-success d-flex align-items-center shadow-sm"
                        style={{
                            borderRadius: '50px',
                            height: '40px',
                            width: isHovered ? '165px' : '40px',
                            padding: 0,
                            justifyContent: 'flex-start',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => console.log('Agregar planta click')}
                    >
                        <i className="bi bi-plus-lg" style={{ fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}></i>
                        <span
                            style={{
                                opacity: isHovered ? 1 : 0,
                                transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                                transition: 'all 0.3s ease',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                paddingRight: '16px'
                            }}
                        >
                            Agregar planta
                        </span>
                    </button>

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
                            <PlantCard key={index} plant={item} />
                        );
                    })}
                </div>

            )}
        </div>
    );

}
