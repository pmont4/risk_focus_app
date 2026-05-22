import watermarkLogo from '../img/watermark_logo.png';

export const MainPage = () => {

    return (
        <div
            className="flex-fill d-flex flex-column w-100"
            style={{
                // minHeight: '85vh' eliminado por redundancia e inestabilidad
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${watermarkLogo})`,
                backgroundSize: 'auto 115%',
                backgroundPosition: 'calc(100% + 55px) center',
                backgroundRepeat: 'no-repeat'
            }}
        >

        </div>
    );

}
