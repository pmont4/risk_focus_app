import { useState, useEffect } from 'react';
import { useReportMutation } from '../../query/mutation/useReportMutation';
import Swal from 'sweetalert2';

export const AreaList = ({ report, onClose }) => {

    const { updateAreaAndSubarea } = useReportMutation();
    const [areas, setAreas] = useState([]);

    const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

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
            setAreas(initialAreas.length > 0 ? initialAreas : [{ idArea: generateTempId(), areaName: '', subAreas: [] }]);
        } else {
            setAreas([{ idArea: generateTempId(), areaName: '', subAreas: [] }]);
        }
    }, [report]);

    useEffect(() => {
        console.log(areas);
    }, [areas]);

    const handleAddArea = () => {
        setAreas([...areas, { idArea: generateTempId(), areaName: '', subAreas: [] }]);
    };

    const handleDeleteArea = (idArea) => {
        Swal.fire({
            title: '¿Eliminar área?',
            text: 'Esta acción puede modificar la estructura y la ponderación del reporte. ¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setAreas(areas.filter(area => area.idArea !== idArea));
            }
        });
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
                    subAreas: [...area.subAreas, { idSubArea: generateTempId(), nameSubArea: '' }]
                };
            }
            return area;
        }));
    };

    const handleDeleteSubarea = (idArea, idSubArea) => {
        Swal.fire({
            title: '¿Eliminar subárea?',
            text: 'Esta acción puede modificar la estructura y la ponderación del reporte. ¿Desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setAreas(areas.map(area => {
                    if (area.idArea === idArea) {
                        return {
                            ...area,
                            subAreas: area.subAreas.filter(sub => sub.idSubArea !== idSubArea)
                        };
                    }
                    return area;
                }));
            }
        });
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
        const hasEmptyName = areas.some(area => 
            !area.areaName || area.areaName.trim() === '' || 
            (area.subAreas && area.subAreas.some(sub => !sub.nameSubArea || sub.nameSubArea.trim() === ''))
        );

        if (hasEmptyName) {
            Swal.fire({
                title: 'Nombres incompletos',
                text: 'Hay áreas o subáreas con el nombre vacío. Por favor, asegúrese de asignar un nombre a todas antes de aplicar los cambios.',
                icon: 'warning',
                confirmButtonColor: '#0d6efd',
            });
            return;
        }

        const areasToSave = areas.map(area => ({
            ...area,
            idArea: area.idArea.toString().startsWith('temp-') ? '0' : area.idArea,
            subAreas: area.subAreas.map(sub => ({
                ...sub,
                idSubArea: sub.idSubArea.toString().startsWith('temp-') ? '0' : sub.idSubArea
            }))
        }));

        const updatedReport = {
            ...report,
            areas: areasToSave
        };

        updateAreaAndSubarea(false, updatedReport, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Reporte actualizado',
                    text: 'Las áreas y subáreas han sido actualizadas correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#0d6efd',
                    timer: 2000,
                }).then(() => {
                    if (onClose) onClose(true);
                });
            },
            onError: (error) => {
                console.error("Error al actualizar áreas:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar las áreas',
                    icon: 'error',
                    confirmButtonColor: '#0d6efd',
                    timer: 5000,
                });
            }
        });
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
