import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useReportMutation } from "../../query/mutation/useReportMutation";

export const ImpactCriteriaView = ({ report, onClose }) => {

    const { updateCriteria } = useReportMutation();

    const levels = [
        { key: 'veryHighImpactCriteria', label: 'Muy Alto', icon: 'bi-exclamation-octagon-fill', color: '#dc3545', bg: '#f8d7da', border: '#f5c2c7' },
        { key: 'highImpactCriteria', label: 'Alto', icon: 'bi-exclamation-triangle-fill', color: '#fd7e14', bg: '#fff3cd', border: '#ffecb5' },
        { key: 'moderateImpactCriteria', label: 'Medio', icon: 'bi-exclamation-circle-fill', color: '#ffc107', bg: '#fff8e6', border: '#ffe69c' },
        { key: 'lowImpactCriteria', label: 'Bajo', icon: 'bi-info-circle-fill', color: '#198754', bg: '#d1e7dd', border: '#badbcc' }
    ];

    const impacts = [
        { key: 'financialImpact', label: 'Impacto Financiero' },
        { key: 'operationalImpact', label: 'Impacto Operativo o Estratégico' },
        { key: 'humanResourceImpact', label: 'Impacto en Recursos Humanos' }
    ];

    const defaultCriteria = {
        financialImpact: '',
        operationalImpact: '',
        humanResourceImpact: ''
    };

    const initialData = report?.establishImpactCriteria || {
        veryHighImpactCriteria: { ...defaultCriteria },
        highImpactCriteria: { ...defaultCriteria },
        moderateImpactCriteria: { ...defaultCriteria },
        lowImpactCriteria: { ...defaultCriteria }
    };

    const [criteriaData, setCriteriaData] = useState(initialData);

    // Initialize with report data if establishImpactCriteria exists
    useEffect(() => {
        if (report?.establishImpactCriteria) {
            setCriteriaData(report.establishImpactCriteria);
        }
    }, [report]);

    const handleInputChange = (levelKey, impactKey, value) => {
        setCriteriaData(prev => ({
            ...prev,
            [levelKey]: {
                ...(prev[levelKey] || defaultCriteria),
                [impactKey]: value
            }
        }));
    };

    const handleSave = () => {
        let updatedReport = {
            ...report,
            establishImpactCriteria: criteriaData
        };

        updateCriteria(updatedReport, {
            onSuccess: () => {
                Swal.fire({
                    title: 'Criterios de impacto guardados',
                    text: 'Los criterios de impacto se han guardado exitosamente.',
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
                    text: 'Hubo un problema al guardar los criterios de impacto.',
                    icon: 'error',
                    confirmButtonColor: '#0d6efd',
                    timer: 5000,
                });
            }
        });
    };

    return (
        <div className="d-flex flex-column user-select-none" style={{ backgroundColor: '#ffffff', height: '100%' }}>

            {/* Header / Top bar */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Criterios de Impacto</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Define los criterios de impacto para cada nivel.</p>
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

            {/* Main Content: Table structure */}
            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="card-header bg-white border-bottom py-3 d-flex align-items-center">
                        <i className="bi bi-table text-primary fs-5 me-2"></i>
                        <h5 className="mb-0 fw-bold">Matriz de Criterios</h5>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 align-middle" style={{ minWidth: '800px' }}>
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="text-center" style={{ width: '15%', minWidth: '120px' }}>Nivel</th>
                                    <th scope="col" className="text-center">Criterios de Impacto (Financiero, Operativo, RR.HH.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {levels.map((level) => (
                                    <tr key={level.key}>
                                        <td className="text-center align-middle" style={{ backgroundColor: level.bg, borderBottom: `2px solid ${level.border}` }}>
                                            <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                                                <i className={`bi ${level.icon}`} style={{ fontSize: '1.8rem', color: level.color }}></i>
                                                <span className="fw-bold" style={{ fontSize: '1.1rem', color: level.color }}>
                                                    {level.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 bg-white">
                                            <div className="d-flex flex-column gap-3">
                                                {impacts.map((impact) => (
                                                    <div key={impact.key} className="form-group">
                                                        <label className="fw-semibold mb-1" style={{ fontSize: '0.85rem', color: '#0d6efd' }}>
                                                            {impact.label}
                                                        </label>
                                                        <textarea
                                                            className="form-control bg-light border-0"
                                                            rows="2"
                                                            placeholder={`Ingrese el ${impact.label.toLowerCase()}...`}
                                                            value={criteriaData[level.key]?.[impact.key] || ''}
                                                            onChange={(e) => handleInputChange(level.key, impact.key, e.target.value)}
                                                            style={{
                                                                resize: 'vertical',
                                                                borderRadius: '8px',
                                                                fontSize: '0.9rem',
                                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,.075)'
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
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles if needed */}
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
}
