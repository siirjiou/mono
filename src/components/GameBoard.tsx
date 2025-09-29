import React from 'react';
import { Player, Property } from '../types';
import PropertyCard from './PropertyCard';

interface GameBoardProps {
  players: Player[];
  currentPlayer: Player;
  properties: Property[];
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayer, properties }) => {
  const getPlayerAtPosition = (position: number) => {
    return players.filter(player => player.position === position);
  };

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

  const renderCorner = (position: number, className: string) => {
    const property = properties.find(p => p.position === position);
    const playersHere = getPlayerAtPosition(position);
    
    return (
      <div className={`${className} border-2 border-gray-800 flex flex-col items-center justify-center p-2 relative`}>
        <div className="text-xs font-bold text-center">{property?.name}</div>
        {playersHere.length > 0 && (
          <div className="absolute bottom-1 flex space-x-1">
            {playersHere.map(player => (
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

  const renderSide = (positions: number[], className: string) => {
    return positions.map(position => {
      const property = properties.find(p => p.position === position);
      const playersHere = getPlayerAtPosition(position);
      
      return (
        <PropertyCard
          key={position}
          property={property!}
          players={playersHere}
          currentPlayer={currentPlayer}
          className={className}
        />
      );
    });
  };

  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-11 grid-rows-11 gap-1 aspect-square max-w-4xl mx-auto">
        {/* Top row */}
        {renderCorner(20, 'col-start-1 row-start-1')}
        {renderSide([21, 22, 23, 24, 25, 26, 27, 28, 29], 'row-start-1')}
        {renderCorner(30, 'col-start-11 row-start-1')}
        
        {/* Left side */}
        {renderSide([19, 18, 17, 16, 15, 14, 13, 12, 11], 'col-start-1')}
        
        {/* Center area */}
        <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-green-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-2">MONOPOLY</h2>
            <p className="text-lg text-green-700">AI Dynamic Deal</p>
            <div className="mt-4 text-sm text-green-600">
              Current Player: <span className="font-bold">{currentPlayer.name}</span>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        {renderSide([31, 32, 33, 34, 35, 36, 37, 38, 39], 'col-start-11')}
        
        {/* Bottom row */}
        {renderCorner(10, 'col-start-1 row-start-11')}
        {renderSide([9, 8, 7, 6, 5, 4, 3, 2, 1], 'row-start-11')}
        {renderCorner(0, 'col-start-11 row-start-11')}
      </div>
    </div>
  );
};

export default GameBoard;