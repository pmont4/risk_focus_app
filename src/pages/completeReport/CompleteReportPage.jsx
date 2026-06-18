import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useReportQuery } from "../../query/useReportQuery";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ThreatListPrintView } from "./components/ThreatListPrintView";
import { ImpactCriteriaPrintView } from "./components/ImpactCriteriaPrintView";
import { ProbabilityCriteriaPrintView } from "./components/ProbabilityCriteriaPrintView";
import watermarkLogo from "../../img/watermark_logo.png";

export const CompleteReportPage = () => {

    const { idReport } = useParams();
    const navigate = useNavigate();
    const printRef = useRef(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const { useGetById } = useReportQuery();
    const { data: report, isLoading } = useGetById(idReport);

    const reportToShow = report?.at(0);

    useEffect(() => {
        if (reportToShow) {
            const reportName = reportToShow?.plant?.namePlant;
            document.title = `Reporte Completo - ${reportName}`;
        }
        return () => {
            document.title = "Risk Focus App";
        };
    }, [reportToShow]);

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const pages = printRef.current.querySelectorAll('.print-page');
            const pdf = new jsPDF('l', 'mm', 'a4');

            for (let i = 0; i < pages.length; i++) {
                const canvas = await html2canvas(pages[i], {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.85);

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            pdf.save(`Reporte_${reportToShow?.plant?.namePlant || 'Completo'}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando reporte...</span>
                </div>
            </div>
        );
    }

    if (!reportToShow) {
        return (
            <div className="container mt-5 text-center">
                <h3>Reporte no encontrado</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-4 bg-white"
            style={{
                minHeight: '100vh',
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${watermarkLogo})`,
                backgroundSize: '100% 100%, auto 116%',
                backgroundPosition: '0 0, calc(100% + 64px) center',
                backgroundRepeat: 'no-repeat, no-repeat',
                backgroundAttachment: 'fixed, fixed'
            }}
        >
            {/* Cabecera y controles */}
            <div className="d-flex justify-content-between align-items-center mb-4 px-3 max-w-7xl mx-auto" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="d-flex align-items-center gap-3">
                    <h2 className="mb-0 text-dark fw-bold">Vista de Impresión</h2>
                </div>

                <button
                    className="btn btn-danger d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    style={{ borderRadius: '8px' }}
                >
                    {isGeneratingPDF ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Generando PDF...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                            Descargar PDF
                        </>
                    )}
                </button>
            </div>

            {/* Contenedor que simula la hoja A4 y envuelve las áreas imprimibles */}
            <div className="d-flex flex-column align-items-center gap-5 pb-5" style={{ overflowX: 'auto' }} ref={printRef}>

                {/* --- PÁGINA 1: LISTADO DE AMENAZAS --- */}
                <div
                    className="bg-white shadow-lg print-page d-flex flex-column"
                    style={{
                        width: '297mm',
                        minHeight: '210mm',
                        padding: '15mm 20mm',
                        boxSizing: 'border-box',
                        position: 'relative',
                        margin: '0 auto'
                    }}
                >
                    {/* Encabezado del documento */}
                    <div className="text-center mb-5 border-bottom pb-4">
                        <h1 className="fw-bold mb-1" style={{ color: '#1a252f', letterSpacing: '1px' }}>
                            {reportToShow?.report?.plant?.namePlant || reportToShow?.plant?.namePlant || reportToShow?.nameReport || 'REPORTE INTEGRAL DE RIESGOS'}
                        </h1>
                        <h5 className="text-muted fw-normal mt-2">
                            {reportToShow?.reportDate
                                ? `Fecha: ${reportToShow?.reportDate}`
                                : "Fecha no especificada"}
                        </h5>
                    </div>

                    {/* Listado de Amenazas */}
                    <div className="mt-4 pt-1">
                        <ThreatListPrintView hazards={reportToShow.hazards || []} />
                    </div>

                    {/* Footer de la página del PDF */}
                    <footer className="text-center py-4 border-top" style={{ position: 'absolute', bottom: 0, left: '20mm', right: '20mm' }}>
                        <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} GPI Consulting Services
                        </span>
                    </footer>
                </div>

                {/* --- PÁGINA 2: MATRIZ DE CRITERIOS DE IMPACTO --- */}
                <div
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
                    {/* Segunda sección: Matriz de Criterios (ocupa el espacio completo) */}
                    <div className="flex-grow-1 d-flex flex-column">
                        <ImpactCriteriaPrintView criteriaData={reportToShow?.establishImpactCriteria} />
                    </div>

                    {/* Footer de la página del PDF */}
                    <footer className="text-center py-4 border-top" style={{ position: 'absolute', bottom: 0, left: '20mm', right: '20mm' }}>
                        <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} GPI Consulting Services
                        </span>
                    </footer>
                </div>

                {/* --- MATRIZ DE CRITERIOS DE PROBABILIDAD --- */}
                <div
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
                    {/* Tercera sección: Matriz de Probabilidad (ocupa el espacio completo sin header) */}
                    <div className="flex-grow-1 d-flex flex-column">
                        <ProbabilityCriteriaPrintView criteriaData={reportToShow?.establishProbabilityCriteria} />
                    </div>

                    {/* Footer de la página del PDF */}
                    <footer className="text-center py-4 border-top" style={{ position: 'absolute', bottom: 0, left: '20mm', right: '20mm' }}>
                        <span className="text-dark fw-bold" style={{ fontSize: '0.85rem' }}>
                            © {new Date().getFullYear()} GPI Consulting Services
                        </span>
                    </footer>
                </div>

            </div>
        </div>
    );
}