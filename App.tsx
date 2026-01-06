import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  BookOpen, 
  Play, 
  AlertTriangle,
  Award,
  Lock,
  ArrowUp,
  ArrowDown,
  Zap,
  Search,
  X,
  ChevronRight,
  Info,
  CheckCircle,
  ThumbsDown,
  ThumbsUp,
  Minus,
  Plus,
  Coffee,
  GraduationCap,
  Activity,
  User,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { ASSETS, CAREERS, COURSES, SIDE_JOBS, INITIAL_CASH, LEVELS } from './constants';
import { GameState, PortfolioItem, Asset, Career, LogEntry, ActiveEffect, GameEvent, SideJob, EducationCourse, LifestyleType } from './types';
import { calculateNetWorth, simulateMarket, calculateDividends, formatBRL, generateRandomEvent } from './utils/gameLogic';

// --- SUB-COMPONENTS ---

const Badge = ({ children, color = "blue" }: { children?: React.ReactNode, color?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 mr-2`}>
    {children}
  </span>
);

const StatCard = ({ title, value, subValue, icon: Icon, color = "emerald" }: any) => (
  <div className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 bg-${color}-500 rounded-md p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
              {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// --- INITIALIZATION ---

const getInitialState = (): GameState => {
  const saved = localStorage.getItem('rumo_financeiro_save');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Migrations e Defaults
    if (!parsed.activeEffects) parsed.activeEffects = [];
    if (parsed.educationProgress !== undefined && parsed.experience === undefined) {
       parsed.experience = parsed.educationProgress;
       delete parsed.educationProgress;
    }
    if (!parsed.lifestyle) parsed.lifestyle = 'NORMAL';
    if (!parsed.completedCourses) parsed.completedCourses = [];
    if (parsed.sideJobUsage === undefined) parsed.sideJobUsage = 0;
    
    return parsed;
  }
  
  // Default State
  const initialPrices: Record<string, number> = {};
  ASSETS.forEach(a => initialPrices[a.id] = a.price);

  return {
    cash: INITIAL_CASH,
    month: 1,
    careerId: 'student',
    experience: 0,
    completedCourses: [],
    lifestyle: 'NORMAL',
    portfolio: [],
    history: [{ month: 1, netWorth: INITIAL_CASH, passiveIncome: 0 }],
    logs: [{ month: 1, type: 'system', message: 'Bem-vindo ao simulador! Comece trabalhando para gerar renda.' }],
    unlockedLevels: [1],
    marketPrices: initialPrices,
    activeEffects: [],
    sideJobUsage: 0
  };
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'portfolio' | 'career'>('home');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [justLeveledUp, setJustLeveledUp] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('rumo_financeiro_save', JSON.stringify(gameState));
  }, [gameState]);

  // Derived Values
  const currentCareer = CAREERS.find(c => c.id === gameState.careerId) || CAREERS[0];
  const netWorth = calculateNetWorth(gameState.cash, gameState.portfolio, gameState.marketPrices);
  const currentLevel = Math.max(...gameState.unlockedLevels);

  // --- ACTIONS ---

  const addLog = useCallback((message: string, type: 'income' | 'expense' | 'dividend' | 'system', amount?: number) => {
    setGameState(prev => ({
      ...prev,
      logs: [{ month: prev.month, message, type, amount } as LogEntry, ...prev.logs].slice(0, 50) 
    }));
  }, []);

  const handleWork = () => {
    setJustLeveledUp(false);
    advanceMonth();
  };

  const handleStudy = () => {
    if (gameState.experience >= 100) return;
    
    const cost = 100; 
    if (gameState.cash < cost) {
      alert("Sem dinheiro para materiais de estudo básico.");
      return;
    }

    // Lógica de XP Variável (Tendendo a menor)
    // Base 2% + Bônus (0 a 18%). Math.random() * Math.random() cria uma curva onde valores baixos são mais comuns.
    const baseGain = 2;
    const maxBonus = 18;
    const variableBonus = Math.floor(maxBonus * (Math.random() * Math.random())); 
    const xpGain = baseGain + variableBonus;

    setGameState(prev => ({
        ...prev,
        cash: prev.cash - cost,
        experience: Math.min(100, prev.experience + xpGain),
        logs: [{ month: prev.month, message: `Estudou o básico (Experiência +${xpGain}%)`, type: 'expense', amount: cost } as LogEntry, ...prev.logs]
    }));
  };

  const handleBuyCourse = (course: EducationCourse) => {
    if (gameState.cash < course.cost) {
      alert("Saldo insuficiente para este curso.");
      return;
    }
    setGameState(prev => ({
        ...prev,
        cash: prev.cash - course.cost,
        completedCourses: [...prev.completedCourses, course.id],
        logs: [{ month: prev.month, message: `Concluiu curso: ${course.title}`, type: 'expense', amount: course.cost } as LogEntry, ...prev.logs]
    }));
  };

  const handleDoSideJob = (job: SideJob) => {
    // Cálculo de Risco Progressivo (Fadiga)
    // Risco Base + 15% por cada uso no mês, teto de 99%
    const riskIncreasePerUse = 0.15;
    const currentRisk = Math.min(0.99, job.risk + (gameState.sideJobUsage * riskIncreasePerUse));
    
    const isBadLuck = Math.random() < currentRisk;
    
    setGameState(prev => {
        const newUsage = prev.sideJobUsage + 1;
        
        if (isBadLuck) {
            return {
                ...prev,
                cash: prev.cash - job.penalty,
                sideJobUsage: newUsage,
                logs: [{ month: prev.month, message: `[FADIGA] ${job.riskMessage} (Risco era ${(currentRisk*100).toFixed(0)}%)`, type: 'event-bad', amount: -job.penalty } as LogEntry, ...prev.logs]
            };
        } else {
            // Sucesso
            const income = Math.floor(Math.random() * (job.maxGain - job.minGain + 1)) + job.minGain;
            return {
                ...prev,
                cash: prev.cash + income,
                sideJobUsage: newUsage,
                logs: [{ month: prev.month, message: `Trabalhou em ${job.title} (+Risco p/ próxima)`, type: 'income', amount: income } as LogEntry, ...prev.logs]
            };
        }
    });
  };

  const handlePromote = (nextCareerId: string) => {
    const nextCareer = CAREERS.find(c => c.id === nextCareerId);
    if (!nextCareer) return;

    setGameState(prev => ({
        ...prev,
        careerId: nextCareerId,
        experience: 0, // Reset XP para novo cargo
        logs: [{ month: prev.month, message: `PROMOVIDO! Agora você é ${nextCareer.title}`, type: 'event-good' } as LogEntry, ...prev.logs]
    }));
  };

  const handleLifestyleChange = (newStyle: LifestyleType) => {
    setGameState(prev => ({ ...prev, lifestyle: newStyle }));
  };

  const handleBuy = (asset: Asset, quantity: number) => {
    const currentPrice = gameState.marketPrices[asset.id];
    const totalCost = currentPrice * quantity;

    if (gameState.cash < totalCost) {
      alert("Saldo insuficiente!");
      return;
    }

    setGameState(prev => {
      const existingItemIndex = prev.portfolio.findIndex(p => p.assetId === asset.id);
      let newPortfolio = [...prev.portfolio];

      if (existingItemIndex >= 0) {
        const item = newPortfolio[existingItemIndex];
        const totalValueOld = item.averagePrice * item.quantity;
        const totalValueNew = totalCost;
        const newAvg = (totalValueOld + totalValueNew) / (item.quantity + quantity);
        
        newPortfolio[existingItemIndex] = {
          ...item,
          quantity: item.quantity + quantity,
          averagePrice: newAvg
        };
      } else {
        newPortfolio.push({
          assetId: asset.id,
          quantity: quantity,
          averagePrice: currentPrice
        });
      }

      return {
        ...prev,
        cash: prev.cash - totalCost,
        portfolio: newPortfolio,
        logs: [{ month: prev.month, message: `Comprou ${quantity}x ${asset.symbol}`, type: 'expense', amount: totalCost } as LogEntry, ...prev.logs]
      };
    });
  };

  const handleSell = (asset: Asset, quantity: number) => {
    const portfolioItem = gameState.portfolio.find(p => p.assetId === asset.id);
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      alert("Quantidade insuficiente para vender.");
      return;
    }

    const currentPrice = gameState.marketPrices[asset.id];
    const totalSale = currentPrice * quantity;

    setGameState(prev => {
      let newPortfolio = prev.portfolio.map(p => {
        if (p.assetId === asset.id) {
          return { ...p, quantity: p.quantity - quantity };
        }
        return p;
      }).filter(p => p.quantity > 0);

      const profit = (currentPrice - portfolioItem.averagePrice) * quantity;
      const msg = `Vendeu ${quantity}x ${asset.symbol}. Lucro/Prejuízo: ${formatBRL(profit)}`;

      return {
        ...prev,
        cash: prev.cash + totalSale,
        portfolio: newPortfolio,
        logs: [{ month: prev.month, message: msg, type: 'income', amount: totalSale } as LogEntry, ...prev.logs]
      };
    });
  };

  const checkLevelUnlocks = (currentNetWorth: number, currentLevels: number[]) => {
    const newLevels = [...currentLevels];
    let updated = false;

    if (currentNetWorth >= 1000 && !newLevels.includes(2)) {
      newLevels.push(2); updated = true;
      addLog("NÍVEL 2 DESBLOQUEADO: Fundos Imobiliários (FIIs) disponíveis!", 'system');
    }
    if (currentNetWorth >= 5000 && !newLevels.includes(3)) {
      newLevels.push(3); updated = true;
      addLog("NÍVEL 3 DESBLOQUEADO: Blue Chips disponíveis!", 'system');
    }
    if (currentNetWorth >= 20000 && !newLevels.includes(4)) {
      newLevels.push(4); updated = true;
      addLog("NÍVEL 4 DESBLOQUEADO: Setor Elétrico e Saneamento!", 'system');
    }
     if (currentNetWorth >= 50000 && !newLevels.includes(5)) {
      newLevels.push(5); updated = true;
      addLog("NÍVEL 5 DESBLOQUEADO: Small Caps & Growth!", 'system');
    }

    return updated ? newLevels : currentLevels;
  };

  const advanceMonth = () => {
    setGameState(prev => {
      const newMonth = prev.month + 1;
      let monthLogs: LogEntry[] = [];
      
      const nextActiveEffects = prev.activeEffects
        .map(e => ({ ...e, duration: e.duration - 1 }))
        .filter(e => e.duration > 0);

      const randomEvent = generateRandomEvent(currentCareer.salary);
      let eventCashModifier = 0;
      let salaryMultiplier = 1;
      let marketModifiers: { type: 'STOCK' | 'ALL', value: number } | null = null;

      if (randomEvent) {
        setActiveEvent(randomEvent); 
        const logType = randomEvent.type === 'BAD' ? 'event-bad' : randomEvent.type === 'GOOD' ? 'event-good' : 'event-info';
        monthLogs.push({ month: newMonth, message: `[EVENTO] ${randomEvent.title}: ${randomEvent.message}`, type: logType } as LogEntry);

        if (randomEvent.immediateCost) eventCashModifier += randomEvent.immediateCost;
        if (typeof randomEvent.salaryMultiplier === 'number') salaryMultiplier = randomEvent.salaryMultiplier;
        if (randomEvent.marketModifier) marketModifiers = randomEvent.marketModifier;
        if (randomEvent.persistentEffect) nextActiveEffects.push(randomEvent.persistentEffect);
      }

      const baseExpenses = currentCareer.baseCostOfLiving;
      
      let lifestyleMult = 1;
      if (prev.lifestyle === 'FRUGAL') lifestyleMult = 0.6;
      if (prev.lifestyle === 'LUXURY') lifestyleMult = 1.8;
      
      const inflationEffect = nextActiveEffects.find(e => e.type === 'INFLATION');
      const inflationMult = inflationEffect ? inflationEffect.value : 1;
      
      const randomVariation = 1 + (Math.random() * 0.1); 

      const finalExpenses = baseExpenses * lifestyleMult * inflationMult * randomVariation;
      const finalSalary = currentCareer.salary * salaryMultiplier;

      let newPrices = simulateMarket(prev.marketPrices);

      if (marketModifiers) {
        Object.keys(newPrices).forEach(assetId => {
          const asset = ASSETS.find(a => a.id === assetId);
          if (asset && (marketModifiers!.type === 'ALL' || (marketModifiers!.type === 'STOCK' && asset.type === 'STOCK'))) {
            newPrices[assetId] = newPrices[assetId] * (1 + marketModifiers!.value);
          }
        });
      }

      const { total: dividends, logs: dividendLogs } = calculateDividends(prev.portfolio, newPrices);

      const newCash = prev.cash + finalSalary - finalExpenses + dividends + eventCashModifier;
      const newNetWorth = calculateNetWorth(newCash, prev.portfolio, newPrices);
      const newLevels = checkLevelUnlocks(newNetWorth, prev.unlockedLevels);

      if (newLevels.length > prev.unlockedLevels.length) {
        setJustLeveledUp(true);
      }

      monthLogs.push({ month: newMonth, message: `Salário: +${formatBRL(finalSalary)} | Gastos: -${formatBRL(finalExpenses)} (${prev.lifestyle})`, type: 'system' } as LogEntry);
      monthLogs = [...monthLogs, ...dividendLogs.map(msg => ({ month: newMonth, message: msg, type: 'dividend', amount: 0 } as LogEntry))];
      
      const updatedLogs = [...monthLogs, ...prev.logs].slice(0, 50);

      const newHistory = [
        ...prev.history, 
        { month: newMonth, netWorth: newNetWorth, passiveIncome: dividends }
      ];

      return {
        ...prev,
        month: newMonth,
        cash: newCash,
        marketPrices: newPrices,
        logs: updatedLogs,
        unlockedLevels: newLevels,
        history: newHistory,
        activeEffects: nextActiveEffects,
        sideJobUsage: 0
      };
    });
  };

  // --- VIEWS ---

  const HomeView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Patrimônio Líquido" value={formatBRL(netWorth)} subValue={`Mês ${gameState.month}`} icon={DollarSign} />
        <StatCard title="Saldo em Conta" value={formatBRL(gameState.cash)} icon={Briefcase} color="blue" />
        <StatCard title="Renda Passiva (Último Mês)" value={formatBRL(gameState.history[gameState.history.length - 1].passiveIncome)} icon={TrendingUp} color="green" />
        <StatCard title="Nível de Investidor" value={LEVELS[currentLevel as keyof typeof LEVELS]?.name || 'Mestre'} icon={Award} color="purple" />
      </div>

      {gameState.activeEffects.length > 0 && (
         <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
           <h3 className="flex items-center text-amber-800 font-bold mb-2">
             <Zap className="w-4 h-4 mr-2" />
             Condições Ativas
           </h3>
           <div className="flex flex-wrap gap-2">
             {gameState.activeEffects.map(effect => (
               <span key={effect.id} className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs border border-amber-300">
                 {effect.name} ({effect.duration} meses restantes)
               </span>
             ))}
           </div>
         </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {justLeveledUp ? 'Nível Concluído!' : 'Próximo Nível'}
        </h3>
        {justLeveledUp ? (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Parabéns! Você alcançou o Nível de {LEVELS[currentLevel as keyof typeof LEVELS]?.name}.
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        ) : currentLevel < 5 ? (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Meta: {LEVELS[(currentLevel + 1) as keyof typeof LEVELS]?.description}</span>
                <span className="text-sm font-medium text-blue-700">
                  {currentLevel === 1 ? `${Math.min(100, (netWorth/1000)*100).toFixed(0)}%` : 
                   currentLevel === 2 ? `${Math.min(100, (netWorth/5000)*100).toFixed(0)}%` :
                   currentLevel === 3 ? `${Math.min(100, (netWorth/20000)*100).toFixed(0)}%` :
                   `${Math.min(100, (netWorth/50000)*100).toFixed(0)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: 
                    currentLevel === 1 ? `${Math.min(100, (netWorth/1000)*100)}%` : 
                    currentLevel === 2 ? `${Math.min(100, (netWorth/5000)*100)}%` :
                    currentLevel === 3 ? `${Math.min(100, (netWorth/20000)*100)}%` :
                    `${Math.min(100, (netWorth/50000)*100)}%`
                  }}
                ></div>
              </div>
            </div>
        ) : (
          <p className="text-green-600 font-bold">Você atingiu o nível máximo de conhecimento desbloqueável!</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Evolução do Patrimônio</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gameState.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: 'Mês', position: 'insideBottomRight', offset: -5 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => [formatBRL(value), "Patrimônio"]} />
              <Line type="monotone" dataKey="netWorth" stroke="#059669" strokeWidth={2} dot={false} name="Patrimônio" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Atividade Recente</h3>
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {gameState.logs.map((log, idx) => (
            <li key={idx} className="py-2 text-sm">
              <span className="font-bold text-gray-500 mr-2">[Mês {log.month}]</span>
              <span className={
                log.type === 'income' || log.type === 'dividend' || log.type === 'event-good' ? 'text-green-600' : 
                log.type === 'expense' || log.type === 'event-bad' ? 'text-red-600' : 
                log.type === 'event-info' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }>
                {log.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const MarketView = () => {
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<'ALL' | 'FIXED' | 'FII' | 'STOCK'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [transactionQty, setTransactionQty] = useState(1);
    const [stepMultiplier, setStepMultiplier] = useState(1);

    const selectedAsset = useMemo(() => ASSETS.find(a => a.id === selectedAssetId), [selectedAssetId]);

    useEffect(() => {
        setTransactionQty(1);
        setStepMultiplier(1);
    }, [selectedAssetId]);

    const incrementQty = () => setTransactionQty(prev => prev + stepMultiplier);
    const decrementQty = () => setTransactionQty(prev => Math.max(1, prev - stepMultiplier));
    const totalTransactionValue = selectedAssetId && gameState.marketPrices[selectedAssetId] 
        ? gameState.marketPrices[selectedAssetId] * transactionQty 
        : 0;

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const filteredAssets = ASSETS.filter(asset => {
      if (filterType !== 'ALL' && asset.type !== filterType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q) || (asset.sector && asset.sector.toLowerCase().includes(q));
      }
      return true;
    });

    const userHasAsset = selectedAsset && gameState.portfolio.some(p => p.assetId === selectedAsset.id);

    return (
      <div className="space-y-6">
        <div 
          onClick={toggleModal}
          className="bg-white border-2 border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-all flex items-center justify-between shadow-sm group"
        >
          <div className="flex items-center text-gray-500 group-hover:text-blue-500">
            <Search className="w-6 h-6 mr-3" />
            <span className="text-lg font-medium">
              {selectedAsset ? 'Trocar Ativo Selecionado' : 'Clique para buscar ativos na Bolsa (B3)...'}
            </span>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded text-xs font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
            Ver Lista
          </div>
        </div>

        {selectedAsset ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200 animate-fade-in">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {selectedAsset.symbol}
                    {selectedAsset.type === 'STOCK' && <Badge color="red">Ação</Badge>}
                    {selectedAsset.type === 'FII' && <Badge color="yellow">FII</Badge>}
                    {selectedAsset.type === 'FIXED' && <Badge color="blue">Renda Fixa</Badge>}
                  </h2>
                  <div className="flex gap-2 text-sm text-slate-500">
                     <span>{selectedAsset.name}</span>
                     {selectedAsset.sector && (
                        <>
                           <span>•</span>
                           <span className="font-medium text-slate-600">{selectedAsset.sector}</span>
                        </>
                     )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{formatBRL(gameState.marketPrices[selectedAsset.id])}</div>
                  <div className="text-xs text-slate-400">Preço Atual</div>
                </div>
             </div>
             
             <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg">{selectedAsset.description}</p>
                
                {selectedAsset.type === 'FIXED' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong className="block mb-1">Atenção: Marcação a Mercado</strong>
                      {selectedAsset.symbol.includes('SELIC') || selectedAsset.symbol.includes('DIÁRIA') ? (
                        <p>Este título é <strong>Pós-Fixado</strong>. O risco de perder dinheiro ao vender antes do vencimento é baixíssimo. Ideal para reservas de emergência.</p>
                      ) : (
                        <p>Este título é <strong>Pré-Fixado ou IPCA+</strong>. Se vender antes do vencimento, o preço pode ter caído devido à alta dos juros (Marcação a Mercado). Segure até o fim para garantir a taxa contratada!</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded">
                    <span className="block text-xs text-gray-500 uppercase">Volatilidade (Risco)</span>
                    <span className="font-bold text-slate-700">
                      {selectedAsset.volatility === 0 ? 'Baixíssima' : selectedAsset.volatility < 0.02 ? 'Média' : 'Alta'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded">
                    <span className="block text-xs text-gray-500 uppercase">Dividend Yield (Est.)</span>
                    <span className="font-bold text-green-600">
                      {(selectedAsset.dividendYield * 100).toFixed(2)}% a.m.
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quantidade a Negociar</span>
                        <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                            <button onClick={() => setStepMultiplier(1)} className={`px-4 py-1.5 text-xs font-bold transition-colors ${stepMultiplier === 1 ? 'bg-slate-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>1x</button>
                            <div className="w-px bg-gray-200"></div>
                            <button onClick={() => setStepMultiplier(10)} className={`px-4 py-1.5 text-xs font-bold transition-colors ${stepMultiplier === 10 ? 'bg-slate-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>10x</button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 mb-4">
                        <button onClick={decrementQty} className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-slate-400 hover:text-slate-700 flex items-center justify-center text-slate-400 transition-all active:scale-95 shadow-sm">
                            <Minus className="w-6 h-6" />
                        </button>
                        
                        <div className="flex-1 text-center bg-white py-3 rounded-lg border border-slate-200 shadow-inner">
                            <span className="text-4xl font-black text-slate-800 tracking-tight">{transactionQty}</span>
                        </div>
                        
                        <button onClick={incrementQty} className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-slate-400 hover:text-slate-700 flex items-center justify-center text-slate-400 transition-all active:scale-95 shadow-sm">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-gray-500">Valor Total da Operação:</span>
                        <div className="text-2xl font-bold text-slate-800">{formatBRL(totalTransactionValue)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleBuy(selectedAsset, transactionQty)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all transform active:scale-95 flex flex-col items-center justify-center"
                  >
                    <span className="text-lg">COMPRAR</span>
                    <span className="text-xs font-normal opacity-90">Total: {formatBRL(totalTransactionValue)}</span>
                  </button>
                  
                  {userHasAsset ? (
                       <button 
                       onClick={() => handleSell(selectedAsset, transactionQty)}
                       className="bg-white border-2 border-red-100 hover:border-red-300 text-red-700 hover:bg-red-50 font-bold py-4 rounded-xl transition-all transform active:scale-95 flex flex-col items-center justify-center"
                     >
                       <span className="text-lg">VENDER</span>
                       <span className="text-xs font-normal opacity-70">Receber: {formatBRL(totalTransactionValue)}</span>
                     </button>
                  ) : (
                    <div className="bg-gray-100 border-2 border-gray-200 text-gray-400 font-bold py-4 rounded-xl flex flex-col items-center justify-center cursor-not-allowed">
                        <span className="text-lg">VENDER</span>
                        <span className="text-xs font-normal">Você não possui este ativo</span>
                    </div>
                  )}
                </div>
             </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
            <TrendingUp className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-600">Nenhum ativo selecionado</h3>
            <p className="text-slate-500">Clique na busca acima para encontrar oportunidades.</p>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl animate-fade-in-up">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-slate-800">Catálogo de Investimentos (B3)</h3>
                <button onClick={toggleModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Buscar por Ticker (ex: VALE3), Nome ou Setor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {[
                    { id: 'ALL', label: 'Todos' },
                    { id: 'FIXED', label: 'Renda Fixa' },
                    { id: 'FII', label: 'FIIs' },
                    { id: 'STOCK', label: 'Ações' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id as any)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                        ${filterType === f.id ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      `}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredAssets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum ativo encontrado para "{searchQuery}".
                    </div>
                ) : filteredAssets.map(asset => {
                  const isLocked = !gameState.unlockedLevels.includes(asset.minLevel);
                  
                  return (
                    <div 
                      key={asset.id} 
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedAssetId(asset.id);
                          toggleModal();
                        }
                      }}
                      className={`
                        relative flex items-center justify-between p-4 rounded-lg border transition-all
                        ${isLocked 
                          ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0
                          ${asset.type === 'STOCK' ? 'bg-red-500' : asset.type === 'FII' ? 'bg-yellow-500' : 'bg-blue-500'}
                        `}>
                          {asset.type[0]}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                             {asset.symbol}
                             {asset.sector && <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{asset.sector}</span>}
                          </div>
                          <div className="text-sm text-slate-500 truncate">{asset.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        {isLocked ? (
                          <div className="flex items-center text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                            <Lock className="w-3 h-3 mr-1" />
                            Nível {asset.minLevel}
                          </div>
                        ) : (
                          <>
                            <div className="text-right">
                              <div className="font-bold text-slate-800">{formatBRL(gameState.marketPrices[asset.id])}</div>
                              {asset.type !== 'FIXED' && <div className="text-xs text-emerald-600">Disponível</div>}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const PortfolioView = () => {
    const totalInvested = gameState.portfolio.reduce((acc, item) => acc + (item.averagePrice * item.quantity), 0);
    const currentValue = gameState.portfolio.reduce((acc, item) => acc + (gameState.marketPrices[item.assetId] * item.quantity), 0);
    const rentability = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Valor Aplicado" value={formatBRL(totalInvested)} icon={DollarSign} color="gray" />
          <StatCard title="Valor Bruto Atual" value={formatBRL(currentValue)} icon={Briefcase} color="blue" />
          <StatCard 
            title="Rentabilidade Geral" 
            value={`${rentability.toFixed(2)}%`} 
            icon={rentability >= 0 ? ArrowUp : ArrowDown} 
            color={rentability >= 0 ? "green" : "red"} 
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Médio</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Atual</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gameState.portfolio.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Sua carteira está vazia. Vá ao Mercado investir!
                  </td>
                </tr>
              )}
              {gameState.portfolio.map(item => {
                const asset = ASSETS.find(a => a.id === item.assetId);
                const currentPrice = gameState.marketPrices[item.assetId];
                const total = currentPrice * item.quantity;
                const profit = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;

                return (
                  <tr key={item.assetId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-bold text-gray-800">{asset?.symbol}</div>
                          <div className="text-xs text-gray-500">{asset?.sector || asset?.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{formatBRL(item.averagePrice)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatBRL(currentPrice)} 
                      <span className={`ml-2 text-xs ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({profit > 0 ? '+' : ''}{profit.toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">{formatBRL(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CareerView = () => {
    const lifestyleMultiplier = gameState.lifestyle === 'FRUGAL' ? 0.6 : gameState.lifestyle === 'LUXURY' ? 1.8 : 1.0;
    const projectedExpenses = currentCareer.baseCostOfLiving * lifestyleMultiplier;
    const projectedSavings = currentCareer.salary - projectedExpenses;

    return (
      <div className="space-y-6">
        {/* --- HEADER: JOB & LIFESTYLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Job Card */}
           <div className="bg-white shadow rounded-lg p-6 col-span-2 border-l-4 border-blue-600">
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentCareer.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">Cargo Atual</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-bold">Salário Bruto</span>
                    <div className="text-2xl font-bold text-green-700">{formatBRL(currentCareer.salary)}</div>
                 </div>
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-bold">Sobra Mensal (Est.)</span>
                    <div className={`text-2xl font-bold ${projectedSavings > 0 ? 'text-blue-700' : 'text-red-600'}`}>
                        {formatBRL(projectedSavings)}
                    </div>
                 </div>
              </div>
           </div>

           {/* Lifestyle Card */}
           <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-4 text-purple-700">
                 <Wallet className="h-5 w-5" />
                 <h3 className="font-bold">Padrão de Vida</h3>
              </div>
              
              <div className="space-y-3">
                 <button 
                   onClick={() => handleLifestyleChange('FRUGAL')}
                   className={`w-full py-2 px-3 rounded text-sm font-medium transition-all flex justify-between
                     ${gameState.lifestyle === 'FRUGAL' ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                   `}
                 >
                   <span>Frugal (-40% Gastos)</span>
                 </button>
                 <button 
                   onClick={() => handleLifestyleChange('NORMAL')}
                   className={`w-full py-2 px-3 rounded text-sm font-medium transition-all flex justify-between
                     ${gameState.lifestyle === 'NORMAL' ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                   `}
                 >
                   <span>Normal</span>
                 </button>
                 <button 
                   onClick={() => handleLifestyleChange('LUXURY')}
                   className={`w-full py-2 px-3 rounded text-sm font-medium transition-all flex justify-between
                     ${gameState.lifestyle === 'LUXURY' ? 'bg-purple-100 text-purple-800 border-2 border-purple-400' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                   `}
                 >
                   <span>Luxo (+80% Gastos)</span>
                 </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Afeta o custo de vida mensal.</p>
           </div>
        </div>

        {/* --- PROMOTION PATH --- */}
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="h-6 w-6 text-slate-700" />
                <h3 className="text-xl font-bold text-gray-900">Plano de Carreira</h3>
            </div>
            
            {/* Generic Exp Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-600">Experiência Profissional</span>
                  <span className="text-blue-600">{gameState.experience}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 flex items-center">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${gameState.experience}%` }}
                  ></div>
                </div>
                <button
                    onClick={handleStudy}
                    disabled={gameState.experience >= 100}
                    className="mt-2 text-xs text-blue-600 hover:underline font-bold disabled:text-gray-400"
                >
                    + Trabalhar/Estudar (Ganhar XP) - R$ 100
                </button>
            </div>

            {/* Next Steps (Branches) */}
            {currentCareer.nextLevelOptions && currentCareer.nextLevelOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentCareer.nextLevelOptions.map(nextId => {
                        const nextJob = CAREERS.find(c => c.id === nextId);
                        if(!nextJob) return null;

                        const hasExp = gameState.experience >= nextJob.requiredExperience;
                        const hasCourse = nextJob.requiredCourseId 
                            ? gameState.completedCourses.includes(nextJob.requiredCourseId) 
                            : true;
                        const courseName = nextJob.requiredCourseId 
                            ? COURSES.find(c => c.id === nextJob.requiredCourseId)?.title 
                            : 'Nenhum';
                        
                        const canPromote = hasExp && hasCourse;

                        return (
                            <div key={nextId} className={`border rounded-xl p-5 flex flex-col justify-between transition-all ${canPromote ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50 opacity-80'}`}>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-1">{nextJob.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4">Salário: {formatBRL(nextJob.salary)}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-xs">
                                            {hasExp ? <CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/> : <Lock className="w-4 h-4 text-gray-400 mr-2"/>}
                                            <span className={hasExp ? 'text-gray-700' : 'text-gray-400'}>Experiência (100%)</span>
                                        </div>
                                        {nextJob.requiredCourseId && (
                                            <div className="flex items-center text-xs">
                                                {hasCourse ? <CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/> : <Lock className="w-4 h-4 text-gray-400 mr-2"/>}
                                                <span className={hasCourse ? 'text-gray-700' : 'text-gray-400'}>Curso: {courseName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePromote(nextId)}
                                    disabled={!canPromote}
                                    className={`w-full py-2 rounded-lg font-bold text-sm shadow-sm
                                        ${canPromote 
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                    `}
                                >
                                    {canPromote ? 'SER PROMOVIDO' : 'BLOQUEADO'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-bold text-yellow-800">Você atingiu o topo da carreira!</p>
                </div>
            )}
        </div>

        {/* --- EDUCATION MARKETPLACE --- */}
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-6 w-6 text-slate-700" />
                <h3 className="text-xl font-bold text-gray-900">Educação e Cursos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {COURSES.map(course => {
                  const isBought = gameState.completedCourses.includes(course.id);
                  return (
                      <div key={course.id} className={`p-4 rounded-xl border ${isBought ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                          <h4 className="font-bold text-gray-800">{course.title}</h4>
                          <p className="text-xs text-gray-500 h-8 mt-1">{course.description}</p>
                          <div className="mt-4 flex justify-between items-center">
                              <span className="text-xs font-semibold text-purple-600">{course.benefit}</span>
                              {isBought ? (
                                  <span className="text-xs font-bold text-blue-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Adquirido</span>
                              ) : (
                                  <button 
                                    onClick={() => handleBuyCourse(course)}
                                    className="bg-slate-800 text-white text-xs py-1.5 px-3 rounded hover:bg-slate-700"
                                  >
                                      Comprar ({formatBRL(course.cost)})
                                  </button>
                              )}
                          </div>
                      </div>
                  )
               })}
            </div>
        </div>

        {/* --- SIDE HUSTLES --- */}
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Coffee className="h-6 w-6 text-slate-700" />
                <h3 className="text-xl font-bold text-gray-900">Renda Extra (Side Hustles)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {SIDE_JOBS.map(job => {
                  const riskIncrement = 0.15;
                  const currentRisk = Math.min(0.99, job.risk + (gameState.sideJobUsage * riskIncrement));
                  const riskColor = currentRisk < 0.2 ? 'text-red-500 bg-red-50' : currentRisk < 0.6 ? 'text-orange-500 bg-orange-50' : 'text-red-800 bg-red-100';

                  return (
                  <div key={job.id} className="border border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors bg-orange-50/30">
                      <h4 className="font-bold text-gray-800">{job.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-3">Ganho Est: {formatBRL(job.minGain)} - {formatBRL(job.maxGain)}</p>
                      
                      <div className={`flex items-center text-xs mb-4 p-2 rounded font-semibold ${riskColor}`}>
                          <ShieldAlert className="w-4 h-4 mr-1.5" />
                          <span>Risco Atual: {(currentRisk * 100).toFixed(0)}%</span>
                      </div>

                      <button 
                        onClick={() => handleDoSideJob(job)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded text-sm shadow-sm"
                      >
                          Trabalhar Agora
                      </button>
                  </div>
               )})}
            </div>
        </div>
      </div>
    );
  };

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center text-amber-600 mb-4">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <h2 className="text-2xl font-bold">Aviso Legal</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Este é um <strong>SIMULADOR EDUCATIVO</strong>. 
              <br/><br/>
              Os valores, ativos e rentabilidades apresentados são fictícios e simplificados para fins de jogo (gamificação). 
              <strong>Isto não é uma recomendação de investimento real.</strong>
            </p>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="w-full bg-slate-900 text-white py-3 rounded font-bold hover:bg-slate-800 transition-colors"
            >
              Entendido, vamos jogar!
            </button>
          </div>
        </div>
      )}

      {/* Random Event Popup */}
      {activeEvent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
           <div className={`
              relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in
              ${activeEvent.type === 'BAD' ? 'border-4 border-red-400' : activeEvent.type === 'GOOD' ? 'border-4 border-emerald-400' : 'border-4 border-blue-400'}
           `}>
              <div className={`p-6 text-center ${activeEvent.type === 'BAD' ? 'bg-red-50' : activeEvent.type === 'GOOD' ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                 <div className="flex justify-center mb-4">
                    {activeEvent.type === 'BAD' && <ThumbsDown className="w-16 h-16 text-red-500" />}
                    {activeEvent.type === 'GOOD' && <ThumbsUp className="w-16 h-16 text-emerald-500" />}
                    {activeEvent.type === 'INFO' && <Info className="w-16 h-16 text-blue-500" />}
                 </div>
                 <h2 className={`text-2xl font-black uppercase mb-2 ${activeEvent.type === 'BAD' ? 'text-red-800' : activeEvent.type === 'GOOD' ? 'text-emerald-800' : 'text-blue-800'}`}>
                   {activeEvent.title}
                 </h2>
              </div>
              
              <div className="p-6">
                 <p className="text-gray-700 text-lg text-center font-medium mb-6 leading-relaxed">
                   {activeEvent.message}
                 </p>
                 
                 {activeEvent.immediateCost && activeEvent.immediateCost !== 0 && (
                   <div className={`text-center mb-6 py-2 px-4 rounded-lg font-bold text-xl ${activeEvent.immediateCost > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {activeEvent.immediateCost > 0 ? '+' : ''}{formatBRL(activeEvent.immediateCost)}
                   </div>
                 )}

                 <button 
                   onClick={() => setActiveEvent(null)}
                   className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all active:scale-95
                    ${activeEvent.type === 'BAD' ? 'bg-red-600 hover:bg-red-700' : activeEvent.type === 'GOOD' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}
                   `}
                 >
                   CONTINUAR
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <span className="font-bold text-lg hidden sm:block">Rumo à Liberdade Financeira</span>
            <span className="font-bold text-lg sm:hidden">RLF</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-xs text-slate-400">Saldo em Conta</span>
              <span className="font-mono font-bold text-emerald-400">{formatBRL(gameState.cash)}</span>
            </div>
            
            <button 
              onClick={handleWork}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors shadow-emerald-900/50 shadow-lg"
            >
              <Play className="h-4 w-4 fill-current" />
              <span className="hidden sm:inline">Avançar Mês</span>
              <span className="sm:hidden">+Mês</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8 overflow-x-auto">
          {[
            { id: 'home', label: 'Dashboard', icon: PieChart },
            { id: 'market', label: 'Mercado', icon: TrendingUp },
            { id: 'portfolio', label: 'Minha Carteira', icon: Briefcase },
            { id: 'career', label: 'Carreira', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap px-4
                ${activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Render */}
        <div className="animate-fade-in">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'market' && <MarketView />}
          {activeTab === 'portfolio' && <PortfolioView />}
          {activeTab === 'career' && <CareerView />}
        </div>
      </main>

      {/* Mobile Sticky Balance (if needed, simplified for now) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-40 border-t border-slate-700">
        <div>
           <span className="text-xs text-slate-400 block">Saldo</span>
           <span className="font-bold text-emerald-400">{formatBRL(gameState.cash)}</span>
        </div>
        <div className="text-right">
           <span className="text-xs text-slate-400 block">Mês</span>
           <span className="font-bold">{gameState.month}</span>
        </div>
      </div>
    </div>
  );
}