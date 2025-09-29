import React from 'react';

interface DiceProps {
  values: [number, number];
  onRoll: () => void;
  disabled: boolean;
  currentPlayer: string;
}

const Dice: React.FC<DiceProps> = ({ values, onRoll, disabled, currentPlayer }) => {
  const renderDie = (value: number) => {
    const dots = [];
    const positions = [
      [], // 0 (not used)
      [[2, 2]], // 1
      [[1, 1], [3, 3]], // 2
      [[1, 1], [2, 2], [3, 3]], // 3
      [[1, 1], [1, 3], [3, 1], [3, 3]], // 4
      [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]], // 5
      [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]], // 6
    ];

    for (let i = 0; i < positions[value].length; i++) {
      const [row, col] = positions[value][i];
      dots.push(
        <div
          key={i}
          className="w-2 h-2 bg-gray-800 rounded-full"
          style={{
            gridRow: row,
            gridColumn: col,
          }}
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-white border-2 border-gray-800 rounded-lg grid grid-cols-3 grid-rows-3 place-items-center">
        {dots}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold mb-3 text-center">Dice</h3>
      
      <div className="flex justify-center space-x-4 mb-4">
        {renderDie(values[0])}
        {renderDie(values[1])}
      </div>
      
      <div className="text-center mb-3">
        <span className="text-2xl font-bold">{values[0] + values[1]}</span>
      </div>
      
      <button
        onClick={onRoll}
        disabled={disabled}
        className={`w-full py-2 px-4 rounded-lg font-semibold ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {disabled ? `${currentPlayer}'s Turn` : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;