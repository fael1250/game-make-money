import { Asset, GameState, PortfolioItem, LogEntry, GameEvent, EconomicCycle } from '../types';
import { ASSETS, ECONOMIC_CYCLES } from '../constants';

export const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const formatUSD = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const calculateNetWorth = (cash: number, portfolio: PortfolioItem[], prices: Record<string, number>, usdToBrl: number) => {
  const assetsValue = portfolio.reduce((acc, item) => {
    const asset = ASSETS.find(a => a.id === item.assetId);
    const currentPrice = prices[item.assetId] || 0;
    const exchangeRate = asset?.currency === 'USD' ? usdToBrl : 1;
    return acc + (item.quantity * currentPrice * exchangeRate);
  }, 0);
  return cash + assetsValue;
};

export const simulateSelic = (currentSelic: number, cycle: EconomicCycle) => {
    const cycleMod = ECONOMIC_CYCLES[cycle].selicTrend;
    const randomFactor = (Math.random() - 0.5) * 0.001; // Tiny random fluctuation
    return Math.max(0.02, Math.min(0.20, currentSelic + cycleMod + randomFactor));
};

export const simulateUsdToBrl = (currentRate: number, cycle: EconomicCycle) => {
    const cycleMod = ECONOMIC_CYCLES[cycle].usdTrend;
    const randomFactor = (Math.random() - 0.5) * 0.03;
    return Math.max(3.5, Math.min(8.0, currentRate + cycleMod + randomFactor));
};

export const updateEconomicCycle = (currentCycle: EconomicCycle, month: number): EconomicCycle => {
    // Chance to change every 12 months
    if (month % 12 !== 0 || Math.random() > 0.4) return currentCycle;

    const cycles: EconomicCycle[] = ['CRISIS', 'RECESSION', 'NORMAL', 'EXPANSION'];
    const currentIndex = cycles.indexOf(currentCycle);

    // Higher chance to move to an adjacent state
    const roll = Math.random();
    if (roll < 0.6) { // 60% chance to move to adjacent
        const direction = Math.random() < 0.5 ? -1 : 1;
        const nextIndex = (currentIndex + direction + cycles.length) % cycles.length;
        return cycles[nextIndex];
    } else { // 40% chance to jump to any other state
        const otherCycles = cycles.filter(c => c !== currentCycle);
        return otherCycles[Math.floor(Math.random() * otherCycles.length)];
    }
};

export const simulateMarket = (
    currentPrices: Record<string, number>,
    selicRate: number,
    prevSelicRate: number,
    cycle: EconomicCycle
): Record<string, number> => {
  const newPrices: Record<string, number> = {};
  const selicChange = selicRate - prevSelicRate;
  const cycleInfo = ECONOMIC_CYCLES[cycle];

  ASSETS.forEach(asset => {
    const currentPrice = currentPrices[asset.id] || asset.price;
    let change = 0;

    if (asset.type === 'FIXED') {
      if (asset.symbol.includes('SELIC') || asset.symbol.includes('CDI')) {
        change = currentPrice * (selicRate / 12); // Pós-fixado
      } else {
        // Marcação a Mercado para pré-fixados e IPCA+
        const sensitivity = asset.symbol.includes('2045') ? 10 : 5; // Longer bonds are more sensitive
        change = currentPrice * ((selicRate / 12) - (selicChange * sensitivity));
      }
    } else {
      const randomFactor = (Math.random() * 2) - 1; // -1 to 1
      const cycleTrend = asset.type === 'STOCK' ? cycleInfo.stockTrend : cycleInfo.stockTrend / 2; // FIIs are less volatile
      const totalVolatility = asset.volatility * cycleInfo.volatilityMod;
      change = currentPrice * (cycleTrend + (totalVolatility * randomFactor));
    }
    newPrices[asset.id] = Math.max(0.01, currentPrice + change);
  });
  return newPrices;
};

export const calculateDividends = (portfolio: PortfolioItem[], prices: Record<string, number>, usdToBrl: number): { total: number, logs: string[] } => {
  let totalDividendsInBRL = 0;
  const logs: string[] = [];

  portfolio.forEach(item => {
    const asset = ASSETS.find(a => a.id === item.assetId);
    if (!asset) return;
    
    const paysDividend = asset.type === 'FII' ? true : (Math.random() > 0.7);
    
    if (paysDividend && asset.type !== 'FIXED' && asset.dividendYield > 0) {
      const currentPrice = prices[asset.id];
      const dividendPerShare = currentPrice * (asset.dividendYield * (0.8 + Math.random() * 0.4));
      const amountInAssetCurrency = dividendPerShare * item.quantity;
      
      if (amountInAssetCurrency > 0.01) {
        const exchangeRate = asset.currency === 'USD' ? usdToBrl : 1;
        const amountInBRL = amountInAssetCurrency * exchangeRate;
        totalDividendsInBRL += amountInBRL;
        
        const formattedAmount = asset.currency === 'USD' 
          ? `${formatUSD(amountInAssetCurrency)} (~${formatBRL(amountInBRL)})` 
          : formatBRL(amountInBRL);
          
        logs.push(`Recebeu ${formattedAmount} de proventos de ${asset.symbol}`);
      }
    }
  });
  return { total: totalDividendsInBRL, logs };
};

export const generateRandomEvent = (currentSalary: number): GameEvent | null => {
  if (Math.random() > 0.15) return null;
  const roll = Math.random();

  if (roll < 0.40) { // BAD
    const subRoll = Math.random();
    if (subRoll < 0.3) {
       const cost = currentSalary * (0.5 + Math.random() * 0.5);
       return { id: 'emergency', title: 'Emergência!', message: `Gasto inesperado de ${formatBRL(cost)}.`, type: 'BAD', immediateCost: -cost };
    } else if (subRoll < 0.6) {
      return { id: 'inflation', title: 'Inflação em Alta', message: 'O custo de vida aumentou 10% pelos próximos 3 meses.', type: 'BAD', persistentEffect: { id: `infl-${Date.now()}`, name: 'Inflação Alta', type: 'INFLATION', duration: 3, value: 1.10 }};
    } else {
      return { id: 'layoff', title: 'Corte de Gastos', message: 'A empresa fez cortes. Você ficou este mês sem salário!', type: 'BAD', salaryMultiplier: 0 };
    }
  } else if (roll < 0.80) { // GOOD
    const subRoll = Math.random();
    if (subRoll < 0.4) {
      const bonus = currentSalary * 0.5;
      return { id: 'bonus', title: 'Bônus de Performance', message: `Recebeu um bônus de ${formatBRL(bonus)}.`, type: 'GOOD', immediateCost: bonus };
    } else {
      const refund = currentSalary * (0.2 + Math.random() * 0.3);
      return { id: 'tax_return', title: 'Restituição IR', message: `Receita liberou sua restituição: ${formatBRL(refund)}.`, type: 'GOOD', immediateCost: refund };
    }
  } else { // INFO
    return { id: 'selic_change', title: 'Mudança na Selic', message: 'O Banco Central alterou a taxa de juros, impactando a Renda Fixa e a Bolsa.', type: 'INFO' };
  }
};