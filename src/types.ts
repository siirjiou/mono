export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  properties: number[];
  isAI: boolean;
}

export interface Property {
  id: number;
  name: string;
  position: number;
  price: number;
  rent: number;
  color: string;
  type: 'property' | 'railroad' | 'utility' | 'special';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValues: [number, number];
  gamePhase: 'rolling' | 'moving' | 'landed';
  winner: Player | null;
}

export interface Trade {
  fromPlayer: number;
  toPlayer: number;
  propertiesOffered: number[];
  propertiesRequested: number[];
  moneyOffered: number;
  moneyRequested: number;
  reasoning: string;
}