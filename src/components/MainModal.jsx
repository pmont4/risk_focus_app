export const MainModal = () => {

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="bg-white shadow-lg rounded-4 d-flex flex-column" style={{
                    width: '86vw',
                    height: '83vh',
                    padding: '2rem',
                    overflow: 'auto'
                }}>

                </div>
            </div>
        </>
    );

}
