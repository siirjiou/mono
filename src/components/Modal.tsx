import React from 'react';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  actions?: ModalAction[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{content}</p>
        
        <div className="flex space-x-3 justify-end">
          {actions ? (
            actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  action.variant === 'primary'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;