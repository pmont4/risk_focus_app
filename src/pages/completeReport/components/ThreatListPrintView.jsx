import React from 'react';

export const ThreatListPrintView = ({ hazards = [] }) => {

    const CATEGORIES = [
        {
            key: "AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
            title: "A. AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
            bgColor: "#dfe8e2", // Muted Green Gray
            textColor: "#0f172a"
        },
        {
            key: "AMENAZAS OCUPACIONALES",
            title: "B. AMENAZAS OCUPACIONALES",
            bgColor: "#dfe6e8", // Muted Cyan Gray
            textColor: "#0f172a"
        },
        {
            key: "AMENAZAS INDUSTRIALES",
            title: "C. AMENAZAS INDUSTRIALES",
            bgColor: "#e8e6df", // Muted Amber Gray
            textColor: "#0f172a"
        },
        {
            key: "AMENAZA TERRORISMO / FACTOR HUMANO",
            title: "D. AMENAZA TERRORISMO / FACTOR HUMANO",
            bgColor: "#eadddd", // Muted Rose Gray
            textColor: "#0f172a"
        },
        {
            key: "AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL",
            title: "E. AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL",
            bgColor: "#e1e1e8", // Muted Indigo Gray
            textColor: "#0f172a"
        }
    ];

    // Group hazards by category
    const groupedHazards = CATEGORIES.reduce((acc, cat) => {
        acc[cat.key] = hazards
            .filter(h => h.typeHazard?.nameTypeHazard === cat.key)
            .sort((a, b) => a.nameHazard.localeCompare(b.nameHazard)); // Sort alphabetically
        return acc;
    }, {});

    // Find the maximum number of items in any category to know how many rows to render
    const maxRows = Math.max(
        ...CATEGORIES.map(cat => groupedHazards[cat.key]?.length || 0),
        1 // Ensure at least 1 row is rendered even if empty
    );

    return (
        <div className="threat-list-print-container mb-5">
            <h5 className="fw-bold mb-3 text-uppercase" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '0.5rem' }}>
                Listado de Amenazas
            </h5>

            <div className="w-100 d-flex justify-content-center">
                <table className="table table-bordered mb-0 mx-auto" style={{
                    fontSize: '0.65rem',
                    tableLayout: 'fixed',
                    width: '100%',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    borderCollapse: 'collapse',
                    border: '1px solid #000'
                }}>
                    <thead>
                        <tr>
                            {CATEGORIES.map(cat => (
                                <th
                                    key={cat.key}
                                    className="align-middle text-center"
                                    style={{
                                        backgroundColor: cat.bgColor,
                                        color: cat.textColor,
                                        width: '20%',
                                        padding: '6px 4px',
                                        fontWeight: 'bold',
                                        whiteSpace: 'normal',
                                        border: '1px solid #000'
                                    }}
                                >
                                    {cat.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: maxRows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {CATEGORIES.map(cat => {
                                    const hazard = groupedHazards[cat.key][rowIndex];
                                    return (
                                        <td
                                            key={`${cat.key}-${rowIndex}`}
                                            style={{
                                                verticalAlign: 'middle',
                                                padding: '8px 6px',
                                                backgroundColor: '#ffffff',
                                                height: '32px', // Altura mayor para estirar la tabla
                                                whiteSpace: 'normal',
                                                border: '1px solid #000'
                                            }}
                                        >
                                            {hazard ? hazard.nameHazard : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="text-center" style={{
                                backgroundColor: '#f8f9fa', // Un tono gris muy suave que combina con el layout
                                color: '#495057',
                                padding: '8px',
                                fontSize: '0.65rem',
                                border: '1px solid #000'
                            }}>
                                <strong>A:</strong> Pérdida Económica &nbsp;&nbsp;&nbsp; 
                                <strong>B:</strong> Pérdida Flujo Caja &nbsp;&nbsp;&nbsp; 
                                <strong>C:</strong> Pérdida Imagen &nbsp;&nbsp;&nbsp; 
                                <strong>D:</strong> Detiene Servicio Clientes &nbsp;&nbsp;&nbsp; 
                                <strong>E:</strong> Detiene Servicio Proveedores &nbsp;&nbsp;&nbsp; 
                                <strong>F:</strong> Pérdida Productividad
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
