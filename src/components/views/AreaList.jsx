import { useState, useEffect } from 'react';

export const AreaList = ({ report }) => {

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        if (report && report.areas && Array.isArray(report.areas)) {
            const initialAreas = report.areas.map((area) => ({
                idArea: area.idArea || `0`,
                areaName: area.areaName || '',
                subAreas: (area.subAreas || []).map((sub) => ({
                    idSubArea: sub.idSubArea || `0`,
                    nameSubArea: sub.nameSubArea || '',
                }))
            }));
            setAreas(initialAreas.length > 0 ? initialAreas : [{ idArea: `0`, areaName: '', subAreas: [] }]);
        } else {
            setAreas([{ idArea: `0`, areaName: '', subAreas: [] }]);
        }
    }, [report]);

    useEffect(() => {
        console.log(areas);
    }, [areas]);

    const handleAddArea = () => {
        setAreas([...areas, { idArea: `0`, areaName: '', subAreas: [] }]);
    };

    const handleDeleteArea = (idArea) => {
        setAreas(areas.filter(area => area.idArea !== idArea));
    };

    const handleAreaNameChange = (idArea, newName) => {
        setAreas(areas.map(area =>
            area.idArea === idArea ? { ...area, areaName: newName } : area
        ));
    };

    const handleAddSubarea = (idArea) => {
        setAreas(areas.map(area => {
            if (area.idArea === idArea) {
                return {
                    ...area,
                    subAreas: [...area.subAreas, { idSubArea: `0`, nameSubArea: '' }]
                };
            }
            return area;
        }));
    };

    const handleDeleteSubarea = (idArea, idSubArea) => {
        setAreas(areas.map(area => {
            if (area.idArea === idArea) {
                return {
                    ...area,
                    subAreas: area.subAreas.filter(sub => sub.idSubArea !== idSubArea)
                };
            }
            return area;
        }));
    };

    const handleSubareaNameChange = (idArea, idSubArea, newName) => {
        setAreas(areas.map(area => {
            if (area.idArea === idArea) {
                return {
                    ...area,
                    subAreas: area.subAreas.map(sub =>
                        sub.idSubArea === idSubArea ? { ...sub, nameSubArea: newName } : sub
                    )
                };
            }
            return area;
        }));
    };

    const handleApply = () => {
        const cleanedAreas = areas
            .filter(area => area.areaName && area.areaName.trim() !== '')
            .map(area => ({
                ...area,
                subAreas: (area.subAreas || []).filter(sub => sub.nameSubArea && sub.nameSubArea.trim() !== '')
            }))
            .filter(area => area.subAreas.length > 0);

        const updatedReport = {
            ...report,
            areas: cleanedAreas
        };

        console.log('Reporte actualizado listo para mutation:', updatedReport);
    };

    return (
        <div className="d-flex flex-column gap-4 p-3 w-100">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex flex-column gap-2 flex-grow-1 me-3">
                    <h2 className="m-0 fw-bold" style={{ color: '#2c3e50' }}>Gestión de Áreas y Subáreas</h2>
                    <div
                        style={{
                            height: '4px',
                            background: 'linear-gradient(to right, #000000ff, #202020ff 15%, transparent 100%)',
                            borderRadius: '2px',
                            width: '100%',
                        }}
                    />
                </div>
                <button
                    className="btn btn-outline-dark fw-medium d-flex align-items-center gap-2"
                    onClick={handleAddArea}
                >
                    Agregar área
                </button>
            </div>

            {/* Listado de Áreas */}
            <div className="d-flex flex-column gap-4 mt-3">
                {areas.map((area) => (
                    <div key={area.idArea} className="card border-1 shadow-sm rounded-3">
                        {/* Fila del Área */}
                        <div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between">
                            <input
                                type="text"
                                className="form-control fw-bold border-0 border-bottom rounded-0 shadow-none px-0 fs-5"
                                style={{ width: '60%', borderBottomColor: '#dee2e6', outline: 'none' }}
                                placeholder="Nombre del área..."
                                value={area.areaName}
                                onChange={(e) => handleAreaNameChange(area.idArea, e.target.value)}
                            />
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={() => handleAddSubarea(area.idArea)}
                                    title="Agregar subárea"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={() => handleDeleteArea(area.idArea)}
                                    title="Eliminar área"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>

                        {/* Listado de Subáreas */}
                        {area.subAreas.length > 0 && (
                            <div className="card-body pt-0 pb-3 ps-5">
                                <div className="d-flex flex-column gap-3">
                                    {area.subAreas.map((subarea) => (
                                        <div key={subarea.idSubArea} className="d-flex align-items-center justify-content-between">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 border-bottom rounded-0 shadow-none px-0"
                                                style={{ width: '55%', borderBottomColor: '#dee2e6' }}
                                                placeholder="Nombre de la subárea..."
                                                value={subarea.nameSubArea}
                                                onChange={(e) => handleSubareaNameChange(area.idArea, subarea.idSubArea, e.target.value)}
                                            />
                                            <button
                                                className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center me-1"
                                                style={{ width: '32px', height: '32px' }}
                                                onClick={() => handleDeleteSubarea(area.idArea, subarea.idSubArea)}
                                                title="Eliminar subárea"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {areas.length === 0 && (
                    <div className="alert alert-secondary text-center border-0 mb-0">
                        No hay áreas configuradas. Haga clic en "Agregar área" para comenzar.
                    </div>
                )}
            </div>

            {/* Footer con el botón de aplicar */}
            <div className="d-flex justify-content-end mt-3 mb-2">
                <button
                    className="btn btn-dark px-4 py-2 fw-medium"
                    onClick={handleApply}
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
};
