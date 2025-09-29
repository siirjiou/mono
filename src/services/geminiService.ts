import { GameState, Trade } from '../types';

// Mock AI service - replace with actual Gemini API integration
export const generateAIDeal = async (gameState: GameState): Promise<Trade | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const humanPlayer = gameState.players.find(p => !p.isAI);
  const aiPlayer = gameState.players.find(p => p.isAI);
  
  if (!humanPlayer || !aiPlayer) return null;
  
  // Simple logic for generating trades
  if (humanPlayer.properties.length === 0 || aiPlayer.properties.length === 0) {
    return null;
  }
  
  // Random trade generation for demo purposes
  const shouldTrade = Math.random() > 0.7;
  if (!shouldTrade) return null;
  
  const humanProperty = humanPlayer.properties[Math.floor(Math.random() * humanPlayer.properties.length)];
  const aiProperty = aiPlayer.properties[Math.floor(Math.random() * aiPlayer.properties.length)];
  
  const moneyDifference = Math.floor(Math.random() * 200) - 100; // -100 to +100
  
  return {
    fromPlayer: aiPlayer.id,
    toPlayer: humanPlayer.id,
    propertiesOffered: [aiProperty],
    propertiesRequested: [humanProperty],
    moneyOffered: Math.max(0, moneyDifference),
    moneyRequested: Math.max(0, -moneyDifference),
    reasoning: "I think this trade would benefit both of us. My property complements your portfolio and could help you build a monopoly!"
  };
};