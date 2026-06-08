import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useReportMutation } from "../../query/mutation/useReportMutation";

export const ProbabilityCriteriaView = ({ report, onClose, isCreatingReport, onCriteriaChange }) => {

    const { updateProbability } = useReportMutation();

    const levels = [
        { key: 'veryHighProbabilityCriteria', label: 'Muy Alta (Recurrente)', icon: 'bi-exclamation-octagon-fill', color: '#dc3545', bg: '#f8d7da', border: '#f5c2c7' },
        { key: 'highProbabilityCriteria', label: 'Alta (Probable)', icon: 'bi-exclamation-triangle-fill', color: '#fd7e14', bg: '#fff3cd', border: '#ffecb5' },
        { key: 'midProbabilityCriteria', label: 'Media (Posible)', icon: 'bi-exclamation-circle-fill', color: '#ffc107', bg: '#fff8e6', border: '#ffe69c' },
        { key: 'lowProbabilityCriteria', label: 'Baja (Remota)', icon: 'bi-info-circle-fill', color: '#198754', bg: '#d1e7dd', border: '#badbcc' }
    ];

    const fields = [
        { key: 'probabilityCriteriaDescription', label: 'Descripción' },
        { key: 'probabilityCriteriaIndicators', label: 'Indicadores' }
    ];

    const defaultCriteria = {
        probabilityCriteriaDescription: '',
        probabilityCriteriaIndicators: ''
    };

    const initialData = report?.establishProbabilityCriteria || {
        veryHighProbabilityCriteria: { ...defaultCriteria },
        highProbabilityCriteria: { ...defaultCriteria },
        midProbabilityCriteria: { ...defaultCriteria },
        lowProbabilityCriteria: { ...defaultCriteria }
    };

    const [criteriaData, setCriteriaData] = useState(initialData);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            if (report?.establishProbabilityCriteria) {
                setCriteriaData(report.establishProbabilityCriteria);
            }
            setIsInitialized(true);
        }
    }, [report, isInitialized]);

    useEffect(() => {
        if (isCreatingReport && onCriteriaChange) {
            onCriteriaChange(criteriaData);
        }
    }, [criteriaData, isCreatingReport, onCriteriaChange]);

    const handleInputChange = (levelKey, fieldKey, value) => {
        setCriteriaData(prev => ({
            ...prev,
            [levelKey]: {
                ...(prev[levelKey] || defaultCriteria),
                [fieldKey]: value
            }
        }));
    };

    const handleSave = () => {
        let updatedReport = {
            ...report,
            establishProbabilityCriteria: criteriaData
        };

        updateProbability(updatedReport, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Criterios de probabilidad guardados',
                    text: 'Los criterios de probabilidad se han guardado exitosamente.',
                    icon: 'success',
                    confirmButtonColor: '#0d6efd',
                    timer: 2000,
                }).then(() => {
                    if (onClose) onClose();
                });
            },
            onError: (error) => {
                console.error("Error al actualizar criterios:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al guardar los criterios de probabilidad.',
                    icon: 'error',
                    confirmButtonColor: '#0d6efd',
                    timer: 5000,
                });
            }
        });
    };

    return (
        <div className="d-flex flex-column user-select-none h-100 w-100" style={{ backgroundColor: '#ffffff' }}>

            {/* Header / Top bar */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Criterios de Probabilidad</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Define los criterios de probabilidad para cada nivel.</p>
                </div>
                {!isCreatingReport && (
                    <button
                        onClick={handleSave}
                        className="btn btn-primary px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
                        style={{ borderRadius: '8px', letterSpacing: '0.5px' }}
                    >
                        <i className="bi bi-save2-fill"></i>
                        Guardar Cambios
                    </button>
                )}
            </div>

            {/* Main Content: Table structure */}
            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                <div className="card shadow-sm border-0 h-100 d-flex flex-column" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="card-header bg-white border-bottom py-3 d-flex align-items-center">
                        <i className="bi bi-table text-primary fs-5 me-2"></i>
                        <h5 className="mb-0 fw-bold">Matriz de Probabilidad</h5>
                    </div>

                    <div className="table-responsive flex-grow-1">
                        <table className="table table-bordered mb-0 align-middle h-100" style={{ minWidth: '800px' }}>
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '16%', minWidth: '120px' }}>Estimación</th>
                                    <th scope="col" className="text-center" style={{ width: '42%' }}>Descripción</th>
                                    <th scope="col" className="text-center" style={{ width: '42%' }}>Indicadores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {levels.map((level) => (
                                    <tr key={level.key}>
                                        <td className="text-center align-middle" style={{ backgroundColor: level.bg, borderBottom: `2px solid ${level.border}` }}>
                                            <div className="d-flex flex-column align-items-center justify-content-center gap-2 py-3">
                                                <i className={`bi ${level.icon}`} style={{ fontSize: '1.8rem', color: level.color }}></i>
                                                <span className="fw-bold" style={{ fontSize: '1.1rem', color: level.color }}>
                                                    {level.label}
                                                </span>
                                            </div>
                                        </td>
                                        {fields.map((field) => (
                                            <td key={field.key} className="p-3 bg-white">
                                                <div className="form-group h-100">
                                                    <textarea
                                                        className="form-control bg-light border-0"
                                                        rows="3"
                                                        placeholder={`Ingrese ${field.label.toLowerCase()}...`}
                                                        value={criteriaData[level.key]?.[field.key] || ''}
                                                        onChange={(e) => handleInputChange(level.key, field.key, e.target.value)}
                                                        style={{
                                                            resize: 'none',
                                                            borderRadius: '8px',
                                                            fontSize: '0.9rem',
                                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.075)',
                                                            height: '100%'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.classList.remove('bg-light', 'border-0');
                                                            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                                                            e.target.style.border = '1px solid #86b7fe';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.classList.add('bg-light', 'border-0');
                                                            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,.075)';
                                                            e.target.style.border = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .table-responsive::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .table-responsive::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                    border-radius: 4px;
                }
                .table-responsive::-webkit-scrollbar-thumb {
                    background: #c1c1c1; 
                    border-radius: 4px;
                }
                .table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8; 
                }
            `}} />
        </div>
    );
};
