// FIX: Add 'REIT' to AssetType to support US Real Estate Investment Trusts.
export type AssetType = 'FIXED' | 'FII' | 'STOCK' | 'REIT';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  sector?: string;
  type: AssetType;
  price: number;
  volatility: number; // 0 to 1
  dividendYield: number; // Monthly average percentage
  description: string;
  minLevel: number;
  currency?: 'BRL' | 'USD';
}

export interface PortfolioItem {
  assetId: string;
  quantity: number;
  averagePrice: number;
}

export interface Career {
  id: string;
  title: string;
  salary: number;
  baseCostOfLiving: number; 
  requiredExperience: number; // 0 to 100
  requiredCourseId?: string; 
  nextLevelOptions?: string[]; 
}

export interface EducationCourse {
  id: string;
  title: string;
  cost: number;
  description: string;
  benefit: string;
}

export interface SideJob {
  id:string;
  title: string;
  minGain: number;
  maxGain: number;
  energyCost: number; 
  risk: number; // 0-1 chance de evento ruim
  penalty: number; // Custo se der ruim
  riskMessage: string;
}

export type LifestyleType = 'FRUGAL' | 'NORMAL' | 'LUXURY';

export interface LogEntry {
  month: number;
  message: string;
  type: 'income' | 'expense' | 'dividend' | 'system' | 'event-bad' | 'event-good' | 'event-info';
  amount?: number;
}

export interface ActiveEffect {
  id: string;
  name: string;
  type: 'INFLATION' | 'MARKET_BUFF' | 'MARKET_NERF';
  duration: number; 
  value: number; 
}

export type EconomicCycle = 'EXPANSION' | 'NORMAL' | 'RECESSION' | 'CRISIS';

export interface Goal {
    id: string;
    name: string;
    cost: number;
    description: string;
    icon: string; // Lucide icon name
}

export interface GameState {
  cash: number;
  month: number;
  careerId: string;
  experience: number; // Progresso (0-100)
  completedCourses: string[]; 
  lifestyle: LifestyleType;
  portfolio: PortfolioItem[];
  history: { month: number; netWorth: number; passiveIncome: number }[];
  logs: LogEntry[];
  unlockedLevels: number[];
  marketPrices: Record<string, number>; 
  activeEffects: ActiveEffect[];
  sideJobUsage: number;
  economicCycle: EconomicCycle;
  selicRate: number; // e.g., 0.115 for 11.5%
  usdToBrlRate: number;
  goals: string[]; // IDs of purchased goals
  favorites: string[]; // IDs of favorited assets
}

export interface GameEvent {
  id: string;
  title: string;
  message: string;
  type: 'BAD' | 'GOOD' | 'INFO';
  immediateCost?: number;
  salaryMultiplier?: number;
  marketModifier?: {
    type: 'STOCK' | 'ALL';
    value: number;
  };
  persistentEffect?: ActiveEffect;
}
