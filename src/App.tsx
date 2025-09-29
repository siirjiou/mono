import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import PlayerInfo from './components/PlayerInfo';
import Dice from './components/Dice';
import Modal from './components/Modal';
import TradeModal from './components/TradeModal';
import { Player, Property, GameState } from './types';
import { properties } from './constants';
import { generateAIDeal } from './services/geminiService';

const initialPlayers: Player[] = [
  { id: 1, name: 'Player 1', money: 1500, position: 0, properties: [], isAI: false },
  { id: 2, name: 'AI Player', money: 1500, position: 0, properties: [], isAI: true },
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentPlayerIndex: 0,
    diceValues: [1, 1],
    gamePhase: 'rolling',
    winner: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<any>(null);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prev => ({
      ...prev,
      diceValues: [dice1, dice2],
      gamePhase: 'moving'
    }));

    setTimeout(() => {
      movePlayer(dice1 + dice2);
    }, 1000);
  };

  const movePlayer = (steps: number) => {
    const newPosition = (currentPlayer.position + steps) % 40;
    const passedGo = newPosition < currentPlayer.position;

    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
        money: passedGo ? currentPlayer.money + 200 : currentPlayer.money
      };

      return {
        ...prev,
        players: updatedPlayers,
        gamePhase: 'landed'
      };
    });

    setTimeout(() => {
      handleLanding(newPosition);
    }, 500);
  };

  const handleLanding = (position: number) => {
    const property = properties.find(p => p.position === position);
    
    if (!property) {
      // Special spaces (Go, Jail, etc.)
      nextTurn();
      return;
    }

    const owner = gameState.players.find(p => p.properties.includes(property.id));
    
    if (!owner) {
      // Property is available for purchase
      if (currentPlayer.money >= property.price) {
        setModalContent(`Do you want to buy ${property.name} for $${property.price}?`);
        setShowModal(true);
      } else {
        setModalContent(`You don't have enough money to buy ${property.name}.`);
        setShowModal(true);
      }
    } else if (owner.id !== currentPlayer.id) {
      // Pay rent
      const rent = property.rent;
      payRent(owner, rent);
    } else {
      // Player owns this property
      nextTurn();
    }
  };

  const buyProperty = () => {
    const property = properties.find(p => p.position === currentPlayer.position);
    if (!property) return;

    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        money: currentPlayer.money - property.price,
        properties: [...currentPlayer.properties, property.id]
      };

      return {
        ...prev,
        players: updatedPlayers
      };
    });

    setShowModal(false);
    nextTurn();
  };

  const payRent = (owner: Player, amount: number) => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      const currentPlayerIndex = prev.currentPlayerIndex;
      const ownerIndex = updatedPlayers.findIndex(p => p.id === owner.id);

      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        money: Math.max(0, updatedPlayers[currentPlayerIndex].money - amount)
      };

      updatedPlayers[ownerIndex] = {
        ...updatedPlayers[ownerIndex],
        money: updatedPlayers[ownerIndex].money + amount
      };

      return {
        ...prev,
        players: updatedPlayers
      };
    });

    setModalContent(`You paid $${amount} rent to ${owner.name}.`);
    setShowModal(true);
  };

  const nextTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      gamePhase: 'rolling'
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    nextTurn();
  };

  // AI Turn Logic
  useEffect(() => {
    if (currentPlayer.isAI && gameState.gamePhase === 'rolling') {
      setTimeout(() => {
        rollDice();
      }, 1500);
    }
  }, [currentPlayer.isAI, gameState.gamePhase]);

  // AI Deal Generation
  useEffect(() => {
    const checkForAIDeals = async () => {
      if (Math.random() < 0.3) { // 30% chance per turn
        try {
          const deal = await generateAIDeal(gameState);
          if (deal) {
            setPendingTrade(deal);
            setShowTradeModal(true);
          }
        } catch (error) {
          console.error('Error generating AI deal:', error);
        }
      }
    };

    if (gameState.gamePhase === 'rolling' && !currentPlayer.isAI) {
      checkForAIDeals();
    }
  }, [gameState.currentPlayerIndex]);

  const handleTradeResponse = (accepted: boolean) => {
    if (accepted && pendingTrade) {
      // Execute the trade
      setGameState(prev => {
        const updatedPlayers = [...prev.players];
        const humanPlayerIndex = updatedPlayers.findIndex(p => !p.isAI);
        const aiPlayerIndex = updatedPlayers.findIndex(p => p.isAI);

        if (humanPlayerIndex !== -1 && aiPlayerIndex !== -1) {
          // Update human player
          updatedPlayers[humanPlayerIndex] = {
            ...updatedPlayers[humanPlayerIndex],
            money: updatedPlayers[humanPlayerIndex].money + pendingTrade.moneyOffered - pendingTrade.moneyRequested,
            properties: [
              ...updatedPlayers[humanPlayerIndex].properties.filter(id => !pendingTrade.propertiesRequested.includes(id)),
              ...pendingTrade.propertiesOffered
            ]
          };

          // Update AI player
          updatedPlayers[aiPlayerIndex] = {
            ...updatedPlayers[aiPlayerIndex],
            money: updatedPlayers[aiPlayerIndex].money + pendingTrade.moneyRequested - pendingTrade.moneyOffered,
            properties: [
              ...updatedPlayers[aiPlayerIndex].properties.filter(id => !pendingTrade.propertiesOffered.includes(id)),
              ...pendingTrade.propertiesRequested
            ]
          };
        }

        return {
          ...prev,
          players: updatedPlayers
        };
      });
    }

    setShowTradeModal(false);
    setPendingTrade(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          AI Monopoly - Dynamic Deal
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <GameBoard 
              players={gameState.players} 
              currentPlayer={currentPlayer}
              properties={properties}
            />
          </div>
          
          <div className="space-y-6">
            {gameState.players.map(player => (
              <PlayerInfo 
                key={player.id} 
                player={player} 
                isCurrentPlayer={player.id === currentPlayer.id}
                properties={properties}
              />
            ))}
            
            <Dice 
              values={gameState.diceValues}
              onRoll={rollDice}
              disabled={gameState.gamePhase !== 'rolling' || currentPlayer.isAI}
              currentPlayer={currentPlayer.name}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Property Action"
        content={modalContent}
        actions={[
          {
            label: 'Buy',
            onClick: buyProperty,
            variant: 'primary'
          },
          {
            label: 'Pass',
            onClick: closeModal,
            variant: 'secondary'
          }
        ]}
      />

      <TradeModal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        trade={pendingTrade}
        onAccept={() => handleTradeResponse(true)}
        onDecline={() => handleTradeResponse(false)}
        properties={properties}
      />
    </div>
  );
}

export default App;