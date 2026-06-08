import { useState, useMemo } from 'react';
import { usePlantQuery } from '../../../query/usePlantQuery';

export const BaseReportCreationPlantSelector = ({ selectedPlant, onSelectPlant }) => {

    const { useGetAll } = usePlantQuery();
    const { data: plants = [], isLoading, isError } = useGetAll();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlants = useMemo(() => {
        if (!searchTerm) return plants;
        return plants.filter(plant =>
            plant.namePlant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.addressPlant?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [plants, searchTerm]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5 w-100 h-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando plantas...</span>
                </div>
                <span className="ms-3 fw-medium">Cargando plantas...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3 shadow-sm border-0 w-100" role="alert">
                <strong>Error:</strong> No se pudieron cargar las plantas.
            </div>
        );
    }

    return (
        <div className="w-100 d-flex flex-column h-100">
            <h4 className="mb-4 text-start fw-bold" style={{ color: '#2c3e50' }}>Seleccionar Planta</h4>

            {plants.length > 7 && (
                <div className="input-group mb-4 shadow-sm" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Buscar planta por nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            <div className="table-responsive shadow-sm rounded border bg-white flex-grow-1" style={{ overflowY: 'auto' }}>
                <table className="table table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                        <tr>
                            <th className="fw-semibold text-secondary px-4 py-3 border-bottom">Nombre de planta</th>
                            <th className="fw-semibold text-secondary px-4 py-3 border-bottom">Dirección de planta</th>
                            <th className="fw-semibold text-secondary px-4 py-3 border-bottom text-center" style={{ width: '150px' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlants.length > 0 ? (
                            filteredPlants.map((plant) => {
                                const isSelected = selectedPlant?.idPlant === plant.idPlant;
                                return (
                                    <tr key={plant.idPlant} className={isSelected ? 'table-primary border-bottom' : 'border-bottom'}>
                                        <td className="px-4 py-3 fw-medium" style={{ color: '#2c3e50' }}>{plant.namePlant}</td>
                                        <td className="px-4 py-3 text-muted">{plant.addressPlant}</td>
                                        <td className="px-4 py-3 text-center">
                                            {isSelected ? (
                                                <button
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center w-100 shadow-sm transition-all"
                                                    onClick={() => onSelectPlant(null)}
                                                >
                                                    <i className="bi bi-x-circle-fill me-2"></i> Borrar
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn btn-sm btn-primary d-flex align-items-center justify-content-center w-100 shadow-sm transition-all"
                                                    onClick={() => onSelectPlant(plant)}
                                                >
                                                    <i className="bi bi-check-circle me-2"></i> Seleccionar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted">
                                    <i className="bi bi-building-x fs-1 d-block mb-2"></i>
                                    No se encontraron plantas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

};
