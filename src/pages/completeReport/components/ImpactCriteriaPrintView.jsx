import React from 'react';

export const ImpactCriteriaPrintView = ({ criteriaData }) => {
    
    const levels = [
        { key: 'veryHighImpactCriteria', label: 'Muy Alto', icon: 'bi-exclamation-octagon-fill', color: '#dc3545', bg: '#f8d7da' },
        { key: 'highImpactCriteria', label: 'Alto', icon: 'bi-exclamation-triangle-fill', color: '#fd7e14', bg: '#fff3cd' },
        { key: 'moderateImpactCriteria', label: 'Medio', icon: 'bi-exclamation-circle-fill', color: '#ffc107', bg: '#fff8e6' },
        { key: 'lowImpactCriteria', label: 'Bajo', icon: 'bi-info-circle-fill', color: '#198754', bg: '#d1e7dd' }
    ];

    const impacts = [
        { key: 'financialImpact', label: 'Impacto Financiero' },
        { key: 'operationalImpact', label: 'Impacto Operativo o Estratégico' },
        { key: 'humanResourceImpact', label: 'Impacto en Recursos Humanos' }
    ];

    // Evitar errores si no vienen los datos
    const safeData = criteriaData || {};

    return (
        <div className="impact-criteria-print-container h-100 d-flex flex-column pb-4">
            <h5 className="fw-bold mb-3 text-uppercase" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '0.5rem' }}>
                Matriz de Criterios de Impacto
            </h5>

            <div className="w-100 d-flex flex-grow-1 mt-4">
                <table className="table table-bordered mb-0 mx-auto" style={{
                    height: '100%', // Forzar que la tabla llene el espacio liberado
                    fontSize: '0.75rem',
                    tableLayout: 'fixed',
                    width: '100%',
                    lineHeight: '1.3',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    borderCollapse: 'collapse',
                    border: '1px solid #000'
                }}>
                    <thead>
                        <tr>
                            <th scope="col" className="align-middle text-center" style={{ width: '15%', padding: '8px 4px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
                                Nivel
                            </th>
                            {impacts.map(impact => (
                                <th key={impact.key} scope="col" className="align-middle text-center" style={{ width: '28.33%', padding: '8px 4px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
                                    {impact.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {levels.map((level) => (
                            <tr key={level.key}>
                                <td className="text-center align-middle" style={{ 
                                    backgroundColor: level.bg, 
                                    border: '1px solid #000',
                                    padding: '12px 6px' 
                                }}>
                                    <div className="d-flex flex-column align-items-center justify-content-center gap-1">
                                        <i className={`bi ${level.icon}`} style={{ fontSize: '1.4rem', color: level.color }}></i>
                                        <span className="fw-bold" style={{ fontSize: '0.85rem', color: level.color }}>
                                            {level.label}
                                        </span>
                                    </div>
                                </td>
                                {impacts.map((impact) => (
                                    <td key={impact.key} className="align-middle" style={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #000',
                                        padding: '12px 10px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {safeData[level.key]?.[impact.key] || ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
