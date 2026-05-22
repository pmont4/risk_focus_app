import { MainModal } from '../components/MainModal';
import watermarkLogo from '../img/watermark_logo.png';

export const MainPage = () => {

    return (
        <div
            className="flex-fill d-flex flex-column w-100"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${watermarkLogo})`,
                backgroundSize: 'auto 116%',
                backgroundPosition: 'calc(100% + 53px) center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <MainModal />
        </div>
    );

}
