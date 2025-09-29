import React from 'react';
import { Player, Property } from '../types';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
  properties: Property[];
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isCurrentPlayer, properties }) => {
  const playerProperties = properties.filter(prop => player.properties.includes(prop.id));
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-lg ${
      isCurrentPlayer ? 'ring-4 ring-yellow-400' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">{player.name}</h3>
        <div className={`w-4 h-4 rounded-full ${
          player.isAI ? 'bg-red-500' : 'bg-blue-500'
        }`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Money:</span>
          <span className="font-semibold text-green-600">${player.money}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Properties:</span>
          <span className="font-semibold">{player.properties.length}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Position:</span>
          <span className="font-semibold">{player.position}</span>
        </div>
      </div>
      
      {playerProperties.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Owned Properties:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {playerProperties.map(property => (
              <div key={property.id} className="text-xs bg-gray-100 p-1 rounded">
                {property.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;