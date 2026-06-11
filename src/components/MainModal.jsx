import { useState } from "react";
import { SideMenuNav } from "./SideMenuNav";
import { ReportListView } from "./views/ReportListView";
import { AnimatedWindow } from "./animation/AnimatedWindow";
import { PlantListView } from "./views/PlantListView";
import { BaseReportGenerationView } from "./views/reportCreation/BaseReportGenerationView";
import { AreaManagerView } from "./views/AreaManagerView";

export const MainModal = () => {

    const [view, setView] = useState('view_reports');
    const [sideMenuDisabled, setSideMenuDisabled] = useState(false);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.001)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="shadow-lg rounded-3 d-flex user-select-none" style={{
                    width: '87.5vw',
                    height: '83vh',
                    overflow: 'hidden',
                    backgroundColor: '#f3f3f3ff'
                }}>
                    <SideMenuNav view={view} setView={setView} sideMenuDisabled={sideMenuDisabled} />
                    {/* MAIN CONTENT */}
                    <div style={{
                        flex: 1,
                        padding: '1.8rem',
                        overflowY: 'auto',
                        backgroundColor: '#ffffff'
                    }}>
                        <AnimatedWindow
                            condition={view === 'view_reports'}
                            children={
                                <ReportListView setView={setView} />
                            }
                        />
                        <AnimatedWindow
                            condition={view === 'view_plants'}
                            children={
                                <PlantListView
                                    sideMenuDisabled={sideMenuDisabled}
                                    setSideMenuDisabled={setSideMenuDisabled}
                                />
                            }
                        />
                        <AnimatedWindow
                            condition={view === 'view_base_report_generation'}
                            children={
                                <BaseReportGenerationView
                                    sideMenuDisabled={sideMenuDisabled}
                                    setSideMenuDisabled={setSideMenuDisabled}
                                />
                            }
                        />
                        <AnimatedWindow
                            condition={view === 'view_areas'}
                            children={
                                <AreaManagerView sideMenuDisabled={sideMenuDisabled} setSideMenuDisabled={setSideMenuDisabled} setView={setView} />
                            }
                        />
                        <AnimatedWindow
                            condition={view === 'view_ponderation'}
                            children={
                                <>
                                    ponderacion
                                </>
                            }
                        />
                    </div>

                </div>
            </div>
        </>
    );

}
