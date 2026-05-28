import { useState } from "react";
import { SideMenuNav } from "./SideMenuNav";
import { ReportListView } from "./views/ReportListView";
import { AnimatedWindow } from "./animation/AnimatedWindow";
import { PlantListView } from "./views/PlantListView";

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
                    <SideMenuNav setView={setView} sideMenuDisabled={sideMenuDisabled} />
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
                                <ReportListView />
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
                    </div>

                </div>
            </div>
        </>
    );

}
