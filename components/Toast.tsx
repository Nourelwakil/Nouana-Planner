import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const icons = {
    success: 'fa-solid fa-check-circle',
    error: 'fa-solid fa-times-circle',
};

const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
        }, 4000); // 4 seconds visible
        
        const closeTimer = setTimeout(() => {
            onClose();
        }, 4300); // 4.3 seconds to allow fade out

        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);
    
    const handleClose = () => {
         setIsFadingOut(true);
         setTimeout(() => {
            onClose();
        }, 300);
    }

    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${colors[type]} ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <i className={`${icons[type]} text-xl mr-3`}></i>
            <p className="flex-grow font-medium">{message}</p>
            <button onClick={handleClose} className="ml-4 text-white/80 hover:text-white">
                <i className="fa-solid fa-times"></i>
            </button>
        </div>
    );
};
