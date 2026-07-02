import { useState } from 'react';
import { ImpactCriteriaView } from './ImpactCriteriaView';
import { ProbabilityCriteriaView } from './ProbabilityCriteriaView';

export const CriteriaView = ({ report, onClose, isCreatingReport, onImpactChange, onProbabilityChange }) => {
    const [activeTab, setActiveTab] = useState('impact'); // 'impact' | 'probability'

    return (
        <div className="d-flex flex-column h-100 w-100" style={{
            backgroundColor: '#ffffff',
            ...(isCreatingReport ? { flexGrow: 1, minHeight: 0 } : { height: '80vh', minHeight: '650px', maxHeight: '850px' }),
            borderRadius: '8px',
            overflow: 'hidden'
        }}>

            {/* Custom Tab Navigation */}
            <div className="d-flex justify-content-center align-items-center pt-3 pb-2 bg-light border-bottom">
                <div className="btn-group bg-white p-1 rounded-pill shadow-sm border" role="group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="criteriaTabs"
                        id="tabImpact"
                        autoComplete="off"
                        checked={activeTab === 'impact'}
                        onChange={() => setActiveTab('impact')}
                    />
                    <label
                        className={`btn rounded-pill px-4 fw-semibold ${activeTab === 'impact' ? 'border-0' : 'btn-outline-light text-dark border-0'}`}
                        htmlFor="tabImpact"
                        style={{
                            transition: 'all 0.3s ease',
                            ...(activeTab === 'impact' ? { backgroundColor: '#f39200', color: '#ffffff' } : {})
                        }}
                    >
                        <i className="bi bi-lightning-charge-fill me-2"></i>
                        Impacto
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="criteriaTabs"
                        id="tabProbability"
                        autoComplete="off"
                        checked={activeTab === 'probability'}
                        onChange={() => setActiveTab('probability')}
                    />
                    <label
                        className={`btn rounded-pill px-4 fw-semibold ${activeTab === 'probability' ? 'border-0' : 'btn-outline-light text-dark border-0'}`}
                        htmlFor="tabProbability"
                        style={{
                            transition: 'all 0.3s ease',
                            ...(activeTab === 'probability' ? { backgroundColor: '#43a047', color: '#ffffff' } : {})
                        }}
                    >
                        <i className="bi bi-dice-5-fill me-2"></i>
                        Probabilidad
                    </label>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0, overflowY: 'auto' }}>
                {activeTab === 'impact' ? (
                    <ImpactCriteriaView report={report} onClose={onClose} isCreatingReport={isCreatingReport} onCriteriaChange={onImpactChange} />
                ) : (
                    <ProbabilityCriteriaView report={report} onClose={onClose} isCreatingReport={isCreatingReport} onCriteriaChange={onProbabilityChange} />
                )}
            </div>
        </div>
    );
};
