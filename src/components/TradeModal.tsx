import React from 'react';
import { Trade, Property } from '../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: Trade | null;
  onAccept: () => void;
  onDecline: () => void;
  properties: Property[];
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  trade,
  onAccept,
  onDecline,
  properties
}) => {
  if (!isOpen || !trade) return null;

  const getPropertyName = (id: number) => {
    return properties.find(p => p.id === id)?.name || 'Unknown Property';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-xl font-bold mb-4">AI Trade Proposal</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-3">{trade.reasoning}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-3">
            <h3 className="font-semibold text-green-600 mb-2">AI Offers:</h3>
            {trade.propertiesOffered.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium">Properties:</p>
                {trade.propertiesOffered.map(id => (
                  <p key={id} className="text-xs text-gray-600">• {getPropertyName(id)}</p>
                ))}
              </div>
            )}
            {trade.moneyOffered > 0 && (
              <p className="text-sm">Money: <span className="font-semibold">${trade.moneyOffered}</span></p>
            )}
          </div>
          
          <div className="border rounded-lg p-3">
            <h3 className="font-semibold text-red-600 mb-2">AI Wants:</h3>
            {trade.propertiesRequested.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium">Properties:</p>
                {trade.propertiesRequested.map(id => (
                  <p key={id} className="text-xs text-gray-600">• {getPropertyName(id)}</p>
                ))}
              </div>
            )}
            {trade.moneyRequested > 0 && (
              <p className="text-sm">Money: <span className="font-semibold">${trade.moneyRequested}</span></p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;