import { Asset, GameState, PortfolioItem, LogEntry, GameEvent } from '../types';
import { ASSETS } from '../constants';

// Helper to format currency
export const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Calculate total Net Worth (Cash + Assets Value)
export const calculateNetWorth = (cash: number, portfolio: PortfolioItem[], prices: Record<string, number>) => {
  const assetsValue = portfolio.reduce((acc, item) => {
    const currentPrice = prices[item.assetId] || 0;
    return acc + (item.quantity * currentPrice);
  }, 0);
  return cash + assetsValue;
};

// Simulate Monthly Market Movements
export const simulateMarket = (currentPrices: Record<string, number>): Record<string, number> => {
  const newPrices: Record<string, number> = {};

  ASSETS.forEach(asset => {
    const currentPrice = currentPrices[asset.id] || asset.price;
    let change = 0;

    if (asset.type === 'FIXED') {
      // Renda Fixa: Sobe exatamente 0.9% ao mês (simulação de taxa Selic ~11.5% aa)
      change = currentPrice * 0.009;
    } else if (asset.type === 'FII') {
      // FIIs: Oscilação aleatória entre -1% e +1%
      // Math.random() gera 0 a 1.
      // (Math.random() * 0.02) gera 0 a 0.02.
      // Subtraindo 0.01, temos -0.01 a +0.01 (-1% a +1%)
      const volatility = (Math.random() * 0.02) - 0.01;
      change = currentPrice * volatility;
    } else {
      // Ações (STOCK): Oscilação aleatória entre -4% e +5%
      // Range total é 9% (0.09).
      // (Math.random() * 0.09) gera 0 a 0.09.
      // Subtraindo 0.04, temos -0.04 a +0.05 (-4% a +5%)
      const volatility = (Math.random() * 0.09) - 0.04;
      change = currentPrice * volatility;
    }

    newPrices[asset.id] = Math.max(0.01, currentPrice + change);
  });

  return newPrices;
};

// Calculate Dividends
export const calculateDividends = (portfolio: PortfolioItem[], prices: Record<string, number>): { total: number, logs: string[] } => {
  let totalDividends = 0;
  const logs: string[] = [];

  portfolio.forEach(item => {
    const asset = ASSETS.find(a => a.id === item.assetId);
    if (!asset) return;
    
    // Chance to pay dividend (FIIs always, Stocks sometimes)
    const paysDividend = asset.type === 'FII' ? true : (Math.random() > 0.7); // Stocks pay ~once a quarter
    
    if (paysDividend && asset.type !== 'FIXED' && asset.dividendYield > 0) {
      // Variation in dividend amount
      const currentPrice = prices[asset.id];
      const dividendPerShare = currentPrice * (asset.dividendYield * (0.8 + Math.random() * 0.4));
      const amount = dividendPerShare * item.quantity;
      
      if (amount > 0.01) {
        totalDividends += amount;
        logs.push(`Recebeu ${formatBRL(amount)} de proventos de ${asset.symbol}`);
      }
    }
  });

  return { total: totalDividends, logs };
};

// --- RANDOM EVENTS SYSTEM ---

export const generateRandomEvent = (currentSalary: number): GameEvent | null => {
  // 15% Chance of Event
  if (Math.random() > 0.15) return null;

  const roll = Math.random();

  // 40% Bad, 40% Good, 20% Info/Neutral
  if (roll < 0.40) {
    // BAD EVENTS
    const subRoll = Math.random();
    if (subRoll < 0.3) {
       // Emergência
       const cost = currentSalary * (0.5 + Math.random() * 0.5); // 50% to 100% of salary
       return {
         id: 'emergency',
         title: 'Emergência!',
         message: `Seu carro quebrou ou surgiu uma emergência médica. Gasto inesperado de ${formatBRL(cost)}.`,
         type: 'BAD',
         immediateCost: -cost
       };
    } else if (subRoll < 0.6) {
      // Inflação
      return {
        id: 'inflation',
        title: 'Inflação em Alta',
        message: 'A inflação subiu! O custo de vida aumentou 10% pelos próximos 3 meses.',
        type: 'BAD',
        persistentEffect: {
          id: `infl-${Date.now()}`,
          name: 'Inflação Alta',
          type: 'INFLATION',
          duration: 3,
          value: 1.10
        }
      };
    } else if (subRoll < 0.8) {
      // Bear Market
      return {
        id: 'bear_market',
        title: 'Bear Market (Crise)',
        message: 'Crise política no país. Ações caíram ~8% este mês.',
        type: 'BAD',
        marketModifier: { type: 'STOCK', value: -0.08 }
      };
    } else {
      // Demissão
      return {
        id: 'layoff',
        title: 'Corte de Gastos',
        message: 'A empresa fez cortes. Você ficou este mês sem salário! Use sua reserva de emergência.',
        type: 'BAD',
        salaryMultiplier: 0
      };
    }
  } else if (roll < 0.80) {
    // GOOD EVENTS
    const subRoll = Math.random();
    if (subRoll < 0.4) {
      // Bônus
      const bonus = currentSalary * 0.5;
      return {
        id: 'bonus',
        title: 'Bônus de Performance',
        message: `Você se destacou! Recebeu um bônus de ${formatBRL(bonus)}.`,
        type: 'GOOD',
        immediateCost: bonus // Positive means gain
      };
    } else if (subRoll < 0.7) {
      // Bull Market
      return {
        id: 'bull_market',
        title: 'Bull Market (Otimismo)',
        message: 'Otimismo no mercado externo! Ações valorizaram ~10% extra.',
        type: 'GOOD',
        marketModifier: { type: 'STOCK', value: 0.10 }
      };
    } else {
      // Restituição IR
      const refund = currentSalary * (0.2 + Math.random() * 0.3);
      return {
        id: 'tax_return',
        title: 'Restituição IR',
        message: `A Receita Federal liberou sua restituição: ${formatBRL(refund)}.`,
        type: 'GOOD',
        immediateCost: refund
      };
    }
  } else {
    // EDUCATIONAL / INFO
    return {
      id: 'selic_up',
      title: 'Copom Aumentou a Selic',
      message: 'O Banco Central aumentou a taxa de juros. Sua Renda Fixa vai render mais, mas a Bolsa pode oscilar.',
      type: 'INFO',
      // Could add a modifier to Fixed Income here, keeping simple for now
    };
  }
};