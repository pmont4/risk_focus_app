import React from 'react';

export const WeightSummaryPrintView = ({ hazardTotalPonderations = [] }) => {
    const CATEGORIES = [
        {
            key: "AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
            title: "A. AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
            bgColor: "#dfe8e2"
        },
        {
            key: "AMENAZAS OCUPACIONALES",
            title: "B. AMENAZAS OCUPACIONALES",
            bgColor: "#dfe6e8"
        },
        {
            key: "AMENAZAS INDUSTRIALES",
            title: "C. AMENAZAS INDUSTRIALES",
            bgColor: "#e8e6df"
        },
        {
            key: "AMENAZA TERRORISMO / FACTOR HUMANO",
            title: "D. AMENAZA TERRORISMO / FACTOR HUMANO",
            bgColor: "#eadddd"
        },
        {
            key: "AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL",
            title: "E. AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL",
            bgColor: "#e1e1e8"
        }
    ];

    const safePonderations = Array.isArray(hazardTotalPonderations) ? hazardTotalPonderations : [];

    // Group hazards by category
    const groupedPonderations = CATEGORIES.reduce((acc, cat) => {
        acc[cat.key] = safePonderations
            .filter(item => item.hazard?.typeHazard?.nameTypeHazard === cat.key)
            .sort((a, b) => {
                const totalA = a.total ?? 0;
                const totalB = b.total ?? 0;
                if (totalB !== totalA) {
                    return totalB - totalA;
                }

                return a.hazard?.nameHazard?.localeCompare(b.hazard?.nameHazard || "") || 0;
            });
        return acc;
    }, {});

    // Get categories that have at least one hazard
    const activeCategories = CATEGORIES.filter(cat => groupedPonderations[cat.key].length > 0);

    // Configuración de paginación
    const MAX_ROWS_PER_PAGE = 20; // Aproximadamente 20 filas encajan perfectamente en el alto disponible de A4 Landscape
    const MAX_CATEGORIES_PER_PAGE = 2;

    const pages = [];
    let currentPage = {
        categoriesCount: 0,
        rowsCount: 0,
        rows: []
    };

    activeCategories.forEach((cat) => {
        const hazards = groupedPonderations[cat.key];

        // Regla 1: Si ya tenemos 2 categorías en la página actual, forzar una nueva página antes de agregar esta
        if (currentPage.categoriesCount >= MAX_CATEGORIES_PER_PAGE && currentPage.rowsCount > 0) {
            pages.push(currentPage);
            currentPage = { categoriesCount: 0, rowsCount: 0, rows: [] };
        }

        currentPage.categoriesCount += 1;

        // Regla 2: Si la página ya está llena, forzar nueva página antes del encabezado
        if (currentPage.rowsCount >= MAX_ROWS_PER_PAGE) {
            pages.push(currentPage);
            currentPage = { categoriesCount: 1, rowsCount: 0, rows: [] };
        }

        // Agregar encabezado de categoría
        currentPage.rows.push({ type: 'header', cat, isContinuation: false });
        currentPage.rowsCount += 1; // El encabezado cuenta como 1 fila

        // Agregar cada amenaza
        hazards.forEach((item) => {
            // Regla 3: Si al agregar una fila nos pasamos del límite, crear nueva página y repetir encabezado
            if (currentPage.rowsCount >= MAX_ROWS_PER_PAGE) {
                pages.push(currentPage);
                currentPage = { categoriesCount: 1, rowsCount: 0, rows: [] };

                // Repetir encabezado indicando continuación
                currentPage.rows.push({ type: 'header', cat, isContinuation: true });
                currentPage.rowsCount += 1;
            }

            currentPage.rows.push({ type: 'hazard', cat, item });
            currentPage.rowsCount += 1;
        });
    });

    if (currentPage.rowsCount > 0) {
        pages.push(currentPage);
    }

    if (pages.length === 0) {
        return null;
    }

    return (
        <>
            {pages.map((page, pageIndex) => (
                <div
                    key={`weight-summary-page-${pageIndex}`}
                    className="bg-white shadow-lg print-page d-flex flex-column"
                    style={{
                        width: '297mm', // A4 Landscape width
                        minHeight: '210mm', // A4 Landscape height
                        padding: '15mm 20mm',
                        boxSizing: 'border-box',
                        position: 'relative',
                        margin: '0 auto'
                    }}
                >
                    <div className="flex-grow-1 d-flex flex-column pb-4">
                        <h5 className="fw-bold mb-3 text-uppercase" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50', paddingBottom: '0.5rem' }}>
                            Resumen de Ponderación {pages.length > 1 && `- Hoja ${pageIndex + 1}`}
                        </h5>

                        <div className="w-100 d-flex flex-column mt-4">
                            <table className="table table-bordered mb-0 mx-auto" style={{
                                fontSize: '0.85rem',
                                tableLayout: 'fixed',
                                width: '100%',
                                borderCollapse: 'collapse',
                                border: '2px solid #000'
                            }}>
                                <thead>
                                    <tr>
                                        <th className="align-middle text-center" style={{ width: '80%', padding: '12px 6px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#ffffff', color: '#000' }}>
                                            Tipos de Amenazas
                                        </th>
                                        <th className="align-middle text-center" style={{ width: '20%', padding: '12px 6px', fontWeight: 'bold', border: '1px solid #000', backgroundColor: '#ffffff', color: '#000', whiteSpace: 'pre-wrap' }}>
                                            {"Ponderación\nGeneral\nde Amenazas"}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.rows.map((row, index) => {
                                        if (row.type === 'header') {
                                            return (
                                                <tr key={`header-${pageIndex}-${index}`}>
                                                    <th colSpan={2} className="text-center align-middle" style={{
                                                        backgroundColor: '#e9ecef',
                                                        border: '1px solid #000',
                                                        color: '#000',
                                                        padding: '8px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {row.cat.title} {row.isContinuation ? "(Continuación)" : ""}
                                                    </th>
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr key={`hazard-${pageIndex}-${index}`}>
                                                    <td style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #000',
                                                        backgroundColor: row.cat.bgColor,
                                                        color: '#000'
                                                    }}>
                                                        {row.item.hazard?.nameHazard || "Desconocida"}
                                                    </td>
                                                    <td className="text-center align-middle" style={{
                                                        padding: '8px',
                                                        border: '1px solid #000',
                                                        backgroundColor: '#ffffff',
                                                        color: '#000',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {row.item.total ?? 0}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer de la página del PDF */}
                    <footer className="text-center py-4 border-top" style={{ position: 'absolute', bottom: 0, left: '20mm', right: '20mm' }}>
                        <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} GPI Consulting Services
                        </span>
                    </footer>
                </div>
            ))}
        </>
    );
};
