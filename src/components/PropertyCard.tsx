import React from 'react';
import { Property, Player } from '../types';

interface PropertyCardProps {
  property: Property;
  players: Player[];
  currentPlayer: Player;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  players, 
  currentPlayer, 
  className = '' 
}) => {
  const getPropertyColor = (property: Property) => {
    const colorMap: { [key: string]: string } = {
      brown: 'bg-amber-800',
      lightblue: 'bg-sky-300',
      pink: 'bg-pink-400',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-400',
      green: 'bg-green-500',
      darkblue: 'bg-blue-800',
      railroad: 'bg-gray-800',
      utility: 'bg-gray-600',
      special: 'bg-gray-200'
    };
    return colorMap[property.color] || 'bg-gray-200';
  };

  return (
    <div className={`border-2 border-gray-800 bg-white flex flex-col relative ${className}`}>
      {property.type === 'property' && (
        <div className={`h-4 ${getPropertyColor(property)}`} />
      )}
      
      <div className="flex-1 p-1 flex flex-col justify-center">
        <div className="text-xs font-bold text-center leading-tight">
          {property.name}
        </div>
        
        {property.price > 0 && (
          <div className="text-xs text-center mt-1">
            ${property.price}
          </div>
        )}
      </div>
      
      {players.length > 0 && (
        <div className="absolute bottom-1 left-1 flex space-x-1">
          {players.map(player => (
            <div
              key={player.id}
              className={`w-3 h-3 rounded-full ${
                player.isAI ? 'bg-red-500' : 'bg-blue-500'
              } ${player.id === currentPlayer.id ? 'ring-2 ring-yellow-400' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyCard;