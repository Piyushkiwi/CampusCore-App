// src/components/common/Modal.jsx
import React from 'react';

const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-10 flex items-center justify-center z-50">
            <div
                className="bg-slate-100 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"> {/* Increased max-w-md to max-w-2xl for wider modal, and decreased max-h to max-h-[80vh] to allow more vertical space */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                        &times;
                    </button>
                </div>
                <div className="py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
