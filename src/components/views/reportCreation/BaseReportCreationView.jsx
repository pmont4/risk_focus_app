import { useEffect, useState, useCallback } from 'react';
import { BaseReportCreationPlantSelector } from './BaseReportCreationPlantSelector';
import { HazardTableView } from '../HazardTableView';
import { CriteriaView } from '../CriteriaView';

export const BaseReportCreationView = ({ sideMenuDisabled, setSideMenuDisabled }) => {

    const [currentStep, setCurrentStep] = useState(1);

    const [reportPayload, setReportPayload] = useState({
        idReport: 0,
        stage: "INITIAL_REPORT",
        reportDate: new Date().toISOString().split('T')[0], // FECHA_DE_HOY
        plant: null,
        hazards: [],
        establishImpactCriteria: null,
        establishProbabilityCriteria: {
            idProbabilityCriteria: 0,
            veryHighProbabilityCriteria: {
                probabilityCriteriaDescription: "Susceptible de ocurrir cada año",
                probabilityCriteriaIndicators: "Posibilidad de que suceda varias veces en el período de tiempo (por ejemplo, 1 mes). Ha ocurrido recientemente y se espera que siga ocurriendo"
            },
            highProbabilityCriteria: {
                probabilityCriteriaDescription: "Susceptible de ocurrir varias veces cada 1 a 5 años",
                probabilityCriteriaIndicators: "Posibilidad de que suceda varias veces en el período de tiempo (por ejemplo, 1 año). Ha ocurrido recientemente."
            },
            midProbabilityCriteria: {
                probabilityCriteriaDescription: "Susceptible de ocurrir cada 5 a 10 años",
                probabilityCriteriaIndicators: "Podría suceder más de una vez en el período de tiempo (por ejemplo, 1 año). Podría ser difícil de controlar debido a varias influencias externas"
            },
            lowProbabilityCriteria: {
                probabilityCriteriaDescription: "Susceptible de ocurrir de cómo máximo 1 vez cada 10 años",
                probabilityCriteriaIndicators: "No ha sucedido. Poco probable que suceda"
            }
        },
        areas: null,
        hazardTotalPonderations: null
    });

    useEffect(() => {
        console.log(reportPayload);
    }, [reportPayload])

    const handleHazardsChange = useCallback((hazards) => {
        setReportPayload(prev => ({ ...prev, hazards }));
    }, []);

    const handleImpactChange = useCallback((impact) => {
        setReportPayload(prev => ({ ...prev, establishImpactCriteria: impact }));
    }, []);

    const handleProbabilityChange = useCallback((probability) => {
        setReportPayload(prev => ({ ...prev, establishProbabilityCriteria: probability }));
    }, []);

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const renderStepIndicator = () => {
        const steps = [
            { id: 1, label: 'Seleccionar una planta' },
            { id: 2, label: 'Establecer amenazas' },
            { id: 3, label: 'Establecer criterios' },
        ];
        return (
            <div className="d-flex justify-content-center align-items-center mb-3 position-relative">
                {/* Background Line */}
                <div
                    className="position-absolute top-50 start-50 translate-middle w-75"
                    style={{
                        height: '3px',
                        background: 'linear-gradient(to right, transparent, #e9ecef 15px, #e9ecef calc(100% - 15px), transparent)',
                        zIndex: 0
                    }}
                ></div>

                {/* Progress Line */}
                <div
                    className="position-absolute top-50 start-0 translate-middle-y"
                    style={{
                        height: '3px',
                        background: 'linear-gradient(to right, transparent, #0d6efd 15px, #0d6efd calc(100% - 15px), transparent)',
                        zIndex: 0,
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 75}%`,
                        marginLeft: '12.5%',
                        transition: 'width 0.3s ease'
                    }}
                ></div>
                <div className="d-flex justify-content-between w-75 position-relative" style={{ zIndex: 1 }}>
                    {steps.map((step) => {
                        const isActive = currentStep >= step.id;
                        return (
                            <div key={step.id} className="d-flex flex-column align-items-center" style={{ width: '120px', marginLeft: '-37.5px', marginRight: '-37.5px' }}>
                                <div
                                    className={`rounded-circle d-flex justify-content-center align-items-center fw-bold transition-all shadow-sm ${isActive ? 'bg-primary text-white' : 'bg-white text-secondary'}`}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        transition: 'all 0.3s ease',
                                        border: isActive ? '2px solid #0d6efd' : '2px solid #dee2e6',
                                        zIndex: 2
                                    }}
                                >
                                    {step.id}
                                </div>
                                <span className={`mt-2 small text-center ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} style={{ zIndex: 2 }}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    return (
        <div className="d-flex flex-column px-2 pt-2 pb-0 w-100 flex-grow-1" style={{ minHeight: 0 }}>
            {/* Header / Indicator */}
            {renderStepIndicator()}
            {/* Content Area */}

            <div className="border rounded-3 p-3 mb-3 bg-white d-flex flex-column shadow-sm flex-grow-1" style={{ minHeight: '350px' }}>
                {currentStep === 1 ? (
                    <div className="w-100 flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                        <BaseReportCreationPlantSelector
                            selectedPlant={reportPayload.plant}
                            onSelectPlant={(plant) => setReportPayload(prev => ({ ...prev, plant }))}
                        />
                    </div>
                ) : currentStep === 2 ? (
                    <div className="w-100 flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                        <HazardTableView
                            report={reportPayload}
                            isCreatingReport={true}
                            onHazardsChange={handleHazardsChange}
                        />
                    </div>
                ) : currentStep === 3 ? (
                    <div className="w-100 flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                        <CriteriaView
                            report={reportPayload}
                            isCreatingReport={true}
                            onImpactChange={handleImpactChange}
                            onProbabilityChange={handleProbabilityChange}
                        />
                    </div>
                ) : (
                    <div className="w-100 flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                        <div className="text-center text-muted">
                            <h3 className="mb-3">Contenido del Paso {currentStep}</h3>
                            <p className="fs-5">Aquí irá la ventana correspondiente al paso {currentStep}.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Navigation */}
            <div className={`d-flex ${currentStep === 1 ? 'justify-content-end' : 'justify-content-between'} mt-auto pb-1`}>
                {currentStep > 1 && (
                    <button
                        className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center fw-medium"
                        onClick={handlePrev}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Atrás
                    </button>
                )}
                {currentStep < totalSteps ? (
                    <button
                        className="btn btn-primary px-4 py-2 d-flex align-items-center fw-medium shadow-sm"
                        onClick={handleNext}
                        disabled={currentStep === 1 && !reportPayload.plant}
                    >
                        Siguiente <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                ) : (
                    <button
                        className="btn btn-success px-4 py-2 d-flex align-items-center fw-medium shadow-sm"
                        onClick={() => { /* Lógica para crear el reporte */ }}
                    >
                        Crear <i className="bi bi-check2 ms-2"></i>
                    </button>
                )}
            </div>
        </div>
    );

}
