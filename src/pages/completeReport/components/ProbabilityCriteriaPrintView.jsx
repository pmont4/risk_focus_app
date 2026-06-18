import React from 'react';

export const ProbabilityCriteriaPrintView = ({ criteriaData }) => {
    
    const levels = [
        { key: 'veryHighProbabilityCriteria', label: 'Muy Alta (Recurrente)', icon: 'bi-exclamation-octagon-fill', color: '#dc3545', bg: '#f8d7da' },
        { key: 'highProbabilityCriteria', label: 'Alta (Probable)', icon: 'bi-exclamation-triangle-fill', color: '#fd7e14', bg: '#fff3cd' },
        { key: 'midProbabilityCriteria', label: 'Media (Posible)', icon: 'bi-exclamation-circle-fill', color: '#ffc107', bg: '#fff8e6' },
        { key: 'lowProbabilityCriteria', label: 'Baja (Remota)', icon: 'bi-info-circle-fill', color: '#198754', bg: '#d1e7dd' }
    ];

    const fields = [
        { key: 'probabilityCriteriaDescription', label: 'Descripción' },
        { key: 'probabilityCriteriaIndicators', label: 'Indicadores' }
    ];

    const safeData = criteriaData || {};

    return (
        <div className="probability-criteria-print-container h-100 d-flex flex-column pb-4">
            <h5 className="fw-bold mb-3 text-uppercase" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '0.5rem' }}>
                Matriz de Criterios de Probabilidad
            </h5>

            <div className="w-100 d-flex flex-grow-1 mt-4">
                <table className="table table-bordered mb-0 mx-auto" style={{
                    height: '100%', 
                    fontSize: '0.85rem', // Slightly larger as we have fewer columns than impact
                    tableLayout: 'fixed',
                    width: '100%',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    borderCollapse: 'collapse',
                    border: '1px solid #000'
                }}>
                    <thead>
                        <tr>
                            <th colSpan={3} className="text-center align-middle" style={{ backgroundColor: '#c6e0b4', border: '1px solid #000', color: '#000', padding: '6px' }}>
                                <div className="fw-bold">Probabilidad</div>
                                <div className="fw-bold">Definido en función de # Eventos por año</div>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className="align-middle text-center" style={{ width: '20%', padding: '8px 4px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
                                Estimación
                            </th>
                            {fields.map(field => (
                                <th key={field.key} scope="col" className="align-middle text-center" style={{ width: '40%', padding: '8px 4px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#e2e8f0', color: '#0f172a' }}>
                                    {field.label}
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
                                {fields.map((field) => (
                                    <td key={field.key} className="align-middle text-center" style={{ 
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #000',
                                        padding: '12px 10px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {safeData[level.key]?.[field.key] || ''}
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
