export type AssetType = 'FIXED' | 'FII' | 'STOCK';

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
  baseCostOfLiving: number; // Renomeado para base
  requiredExperience: number; // 0 to 100
  requiredCourseId?: string; // Curso específico necessário
  nextLevelOptions?: string[]; // IDs das próximas carreiras (Ramificação)
}

export interface EducationCourse {
  id: string;
  title: string;
  cost: number;
  description: string;
  benefit: string;
}

export interface SideJob {
  id: string;
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

export interface GameState {
  cash: number;
  month: number;
  careerId: string;
  experience: number; // Progresso (0-100)
  completedCourses: string[]; // IDs dos cursos comprados
  lifestyle: LifestyleType;
  portfolio: PortfolioItem[];
  history: { month: number; netWorth: number; passiveIncome: number }[];
  logs: LogEntry[];
  unlockedLevels: number[];
  marketPrices: Record<string, number>; 
  activeEffects: ActiveEffect[];
  sideJobUsage: number; // Contador de usos de renda extra no mês atual
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