import { useState } from "react"

export const AddButton = ({ idleElement, hoveringElement, clickAction }) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <button
                className="btn btn-success d-flex align-items-center shadow-sm"
                style={{
                    borderRadius: '50px',
                    height: '40px',
                    width: isHovered ? '165px' : '40px',
                    padding: 0,
                    justifyContent: 'flex-start',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                    clickAction();
                }}
            >
                {idleElement}
                <span
                    style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        paddingRight: '16px'
                    }}
                >
                    {hoveringElement}
                </span>
            </button>
        </>
    );

}
