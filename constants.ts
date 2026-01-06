import { Asset, Career, EducationCourse, SideJob } from './types';

export const INITIAL_CASH = 0;

export const COURSES: EducationCourse[] = [
  { id: 'excel', title: 'Excel Avançado', cost: 400, description: 'Essencial para cargos iniciais.', benefit: 'Requisito: Analista Jr.' },
  { id: 'english', title: 'Inglês Fluente', cost: 2500, description: 'Abre portas para multinacionais.', benefit: 'Requisito: Especialista Sr.' },
  { id: 'mba', title: 'MBA em Gestão', cost: 12000, description: 'Focado em liderança e negócios.', benefit: 'Requisito: Gerente' },
  { id: 'tech_cert', title: 'Certificação Tech', cost: 8000, description: 'Especialização técnica profunda.', benefit: 'Requisito: Especialista Tech' },
  { id: 'consulting', title: 'Mentoria de Negócios', cost: 5000, description: 'Como abrir sua própria empresa.', benefit: 'Requisito: Empresário' },
];

export const SIDE_JOBS: SideJob[] = [
  { 
    id: 'freelance', 
    title: 'Freelance Online', 
    minGain: 200, 
    maxGain: 600, 
    energyCost: 1, 
    risk: 0.15, 
    penalty: 300, 
    riskMessage: 'Burnout! Gastou com farmácia.' 
  },
  { 
    id: 'sales', 
    title: 'Vender Doces', 
    minGain: 50, 
    maxGain: 200, 
    energyCost: 1, 
    risk: 0.05, 
    penalty: 100, 
    riskMessage: 'Prejuízo com produtos encalhados.' 
  },
  { 
    id: 'consulting_gig', 
    title: 'Consultoria Rápida', 
    minGain: 800, 
    maxGain: 1500, 
    energyCost: 2, 
    risk: 0.25, 
    penalty: 0, 
    riskMessage: 'Cliente deu calote. 0 ganhos.' 
  }
];

export const CAREERS: Career[] = [
  {
    id: 'student',
    title: 'Estudante / Estagiário',
    salary: 800,
    baseCostOfLiving: 600, 
    requiredExperience: 0,
    nextLevelOptions: ['junior']
  },
  {
    id: 'junior',
    title: 'Analista Jr. (CLT)',
    salary: 3500,
    baseCostOfLiving: 2200,
    requiredExperience: 100, // Precisa encher a barra
    requiredCourseId: 'excel',
    nextLevelOptions: ['senior']
  },
  {
    id: 'senior',
    title: 'Analista Sênior (CLT)',
    salary: 7500,
    baseCostOfLiving: 4500,
    requiredExperience: 100,
    requiredCourseId: 'english',
    nextLevelOptions: ['specialist', 'manager', 'entrepreneur'] // BRANCHING!
  },
  // --- BRANCHES ---
  {
    id: 'specialist',
    title: 'Especialista Tech (PJ)',
    salary: 16000,
    baseCostOfLiving: 7000, // Custo alto (equipamentos, saúde própria)
    requiredExperience: 100,
    requiredCourseId: 'tech_cert',
    nextLevelOptions: [] // Topo da carreira técnica
  },
  {
    id: 'manager',
    title: 'Gerente Executivo (CLT)',
    salary: 14000,
    baseCostOfLiving: 8500, // Custo alto (aparência, social)
    requiredExperience: 100,
    requiredCourseId: 'mba',
    nextLevelOptions: ['director']
  },
  {
    id: 'director',
    title: 'Diretor (CLT)',
    salary: 28000,
    baseCostOfLiving: 15000,
    requiredExperience: 100,
    nextLevelOptions: []
  },
  {
    id: 'entrepreneur',
    title: 'Empresário',
    salary: 5000, // Começa baixo! (Pro labore)
    baseCostOfLiving: 4000,
    requiredExperience: 100,
    requiredCourseId: 'consulting',
    nextLevelOptions: ['entrepreneur_success']
  },
  {
    id: 'entrepreneur_success',
    title: 'Empresário de Sucesso',
    salary: 45000, 
    baseCostOfLiving: 20000,
    requiredExperience: 100,
    nextLevelOptions: []
  }
];

export const LEVELS = {
  1: { name: 'Iniciante', description: 'Renda Fixa desbloqueada.' },
  2: { name: 'Investidor', description: 'FIIs desbloqueados (Patrimônio > R$ 1k).' },
  3: { name: 'Sócio', description: 'Blue Chips desbloqueadas (Patrimônio > R$ 5k).' },
  4: { name: 'Estrategista', description: 'Setor Elétrico/Saneamento desbloqueado (Patrimônio > R$ 20k).' },
  5: { name: 'Arrojado', description: 'Small Caps & Growth desbloqueadas (Patrimônio > R$ 50k).' }
};

export const ASSETS: Asset[] = [
  // --- NÍVEL 1: RENDA FIXA ---
  
  // 1. Pós-Fixados (Segurança e Liquidez)
  {
    id: 'tesouro_selic',
    symbol: 'TESOURO SELIC',
    name: 'Tesouro Selic 2029 (LFT)',
    sector: 'Governo (Pós-fixado)',
    type: 'FIXED',
    price: 145.00, // Preço unitário fracionado base
    volatility: 0.001, // Baixíssima
    dividendYield: 0, 
    description: 'O investimento mais seguro do país. O valor sobe todo dia acompanhando a taxa Selic. Baixo risco de marcação a mercado.',
    minLevel: 1
  },
  {
    id: 'cdb_liquidez',
    symbol: 'CDB 100% CDI',
    name: 'CDB Liquidez Diária',
    sector: 'Bancário (Pós-fixado)',
    type: 'FIXED',
    price: 100.00,
    volatility: 0,
    dividendYield: 0,
    description: 'Empréstimo para bancos. Rende 100% do CDI. Possui garantia do FGC até R$ 250 mil.',
    minLevel: 1
  },

  // 2. Pré-Fixados (Travar Taxa)
  {
    id: 'tesouro_pre_2030',
    symbol: 'TESOURO PRE 2030',
    name: 'Tesouro Prefixado 2030 (LTN)',
    sector: 'Governo (Pré-fixado)',
    type: 'FIXED',
    price: 800.00, // Preço teórico unitário
    volatility: 0.05, // Média (Sofre Marcação a Mercado)
    dividendYield: 0,
    description: 'Taxa fixa contratada (ex: 11% a.a). Se os juros subirem, o preço deste título CAI temporariamente (Marcação a Mercado).',
    minLevel: 1
  },
  {
    id: 'cdb_pre',
    symbol: 'CDB PRE 14%',
    name: 'CDB Prefixado 3 Anos',
    sector: 'Bancário (Pré-fixado)',
    type: 'FIXED',
    price: 1000.00,
    volatility: 0.02,
    dividendYield: 0,
    description: 'Garante uma taxa alta fixa. Ideal quando a tendência é de queda de juros. Sem liquidez diária.',
    minLevel: 1
  },

  // 3. Híbridos (IPCA + Taxa Real)
  {
    id: 'tesouro_ipca_2045',
    symbol: 'TESOURO IPCA+ 2045',
    name: 'Tesouro IPCA+ 2045 (NTN-B)',
    sector: 'Governo (Híbrido)',
    type: 'FIXED',
    price: 2200.00,
    volatility: 0.08, // Alta (Sofre muita Marcação a Mercado)
    dividendYield: 0, // Principal não paga cupom semestral neste simulador simplificado
    description: 'Proteção contra inflação + Juros reais. Excelente para aposentadoria. Altíssima volatilidade no curto prazo.',
    minLevel: 1
  },
  {
    id: 'debenture_incentivada',
    symbol: 'DEBENTURE VALE IPCA+',
    name: 'Debênture Incentivada Vale',
    sector: 'Corporativo (Híbrido)',
    type: 'FIXED',
    price: 1000.00,
    volatility: 0.04,
    dividendYield: 0,
    description: 'Empréstimo para empresas (Risco de Crédito). Isento de Imposto de Renda para Pessoa Física.',
    minLevel: 1
  },
  {
    id: 'lci_lca',
    symbol: 'LCI/LCA IPCA+',
    name: 'LCI Imobiliária IPCA+',
    sector: 'Imobiliário (Híbrido)',
    type: 'FIXED',
    price: 1000.00,
    volatility: 0.01,
    dividendYield: 0,
    description: 'Lastro imobiliário. Isento de IR. Combina correção da inflação com uma taxa fixa.',
    minLevel: 1
  },

  // --- NÍVEL 2: FIIs (Lista Atualizada) ---
  // Base 10 (Acessíveis)
  { id: 'MXRF11', symbol: 'MXRF11', name: 'MAXI RENDA', sector: 'Híbrido (Papel)', type: 'FII', price: 10.50, volatility: 0.01, dividendYield: 0.010, description: 'O FII mais popular da bolsa.', minLevel: 2 },
  { id: 'VGHF11', symbol: 'VGHF11', name: 'VALOR HEDGE', sector: 'Hedge Fund', type: 'FII', price: 9.30, volatility: 0.015, dividendYield: 0.011, description: 'Fundo multi-estratégia.', minLevel: 2 },
  { id: 'KISU11', symbol: 'KISU11', name: 'KILIMA', sector: 'Fundo de Fundos', type: 'FII', price: 8.50, volatility: 0.01, dividendYield: 0.009, description: 'Segue o índice SUNO 30.', minLevel: 2 },
  { id: 'GARE11', symbol: 'GARE11', name: 'GUARDIAN REAL ESTATE', sector: 'Híbrido', type: 'FII', price: 9.20, volatility: 0.01, dividendYield: 0.012, description: 'Fundo híbrido de tijolo e papel.', minLevel: 2 },
  { id: 'TORD11', symbol: 'TORD11', name: 'TORDESILHAS EI', sector: 'Desenvolvimento', type: 'FII', price: 2.00, volatility: 0.05, dividendYield: 0.000, description: 'Fundo high yield em reestruturação.', minLevel: 2 },
  { id: 'VIUR11', symbol: 'VIUR11', name: 'VINCI IMOB URBANO', sector: 'Fundo de Papel', type: 'FII', price: 7.00, volatility: 0.01, dividendYield: 0.010, description: 'Fundo de recebíveis.', minLevel: 2 },
  { id: 'XPSF11', symbol: 'XPSF11', name: 'XP SELECTION', sector: 'Fundo de Fundos', type: 'FII', price: 8.40, volatility: 0.01, dividendYield: 0.009, description: 'FoF da XP Asset.', minLevel: 2 },

  // Papel / Recebíveis (CRI)
  { id: 'KNCR11', symbol: 'KNCR11', name: 'KINEA RENDIMENTOS', sector: 'Fundo de Papel', type: 'FII', price: 104.00, volatility: 0.005, dividendYield: 0.009, description: 'Fundo High Grade indexado ao CDI.', minLevel: 2 },
  { id: 'KNIP11', symbol: 'KNIP11', name: 'KINEA IP', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.008, dividendYield: 0.010, description: 'Fundo High Grade indexado ao IPCA.', minLevel: 2 },
  { id: 'CPTS11', symbol: 'CPTS11', name: 'CAPITANIA SECURITIES', sector: 'Fundo de Papel', type: 'FII', price: 8.50, volatility: 0.01, dividendYield: 0.010, description: 'Gestão ativa em CRIs.', minLevel: 2 },
  { id: 'HCTR11', symbol: 'HCTR11', name: 'HECTARE CE', sector: 'Fundo de Papel', type: 'FII', price: 30.00, volatility: 0.04, dividendYield: 0.012, description: 'High Yield com alta volatilidade.', minLevel: 2 },
  { id: 'DEVA11', symbol: 'DEVA11', name: 'DEVANT RECEBIVEIS', sector: 'Fundo de Papel', type: 'FII', price: 40.00, volatility: 0.03, dividendYield: 0.013, description: 'High Yield focado em crédito.', minLevel: 2 },
  { id: 'RECR11', symbol: 'RECR11', name: 'REC RECEBIVEIS', sector: 'Fundo de Papel', type: 'FII', price: 85.00, volatility: 0.01, dividendYield: 0.011, description: 'Fundo de recebíveis pulverizado.', minLevel: 2 },
  { id: 'IRDM11', symbol: 'IRDM11', name: 'IRIDIUM RECEBIVEIS', sector: 'Fundo de Papel', type: 'FII', price: 75.00, volatility: 0.02, dividendYield: 0.011, description: 'Fundo de papel híbrido.', minLevel: 2 },
  { id: 'CACR11', symbol: 'CACR11', name: 'CARTESIA FII', sector: 'Fundo de Papel', type: 'FII', price: 102.00, volatility: 0.01, dividendYield: 0.012, description: 'Fundo de CRI.', minLevel: 2 },
  { id: 'AFHI11', symbol: 'AFHI11', name: 'FII AFHI CRI', sector: 'Fundo de Papel', type: 'FII', price: 96.00, volatility: 0.01, dividendYield: 0.011, description: 'Foco em recebíveis imobiliários.', minLevel: 2 },
  { id: 'RZAT11', symbol: 'RZAT11', name: 'FII ARCTIUM', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.012, description: 'Gestão Riza Asset.', minLevel: 2 },
  { id: 'FATN11', symbol: 'FATN11', name: 'FII ATHENA I', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.010, description: 'Fundo de papel Athena.', minLevel: 2 },
  { id: 'BCRI11', symbol: 'BCRI11', name: 'FII BEES CRI', sector: 'Fundo de Papel', type: 'FII', price: 101.00, volatility: 0.01, dividendYield: 0.011, description: 'Banestes Recebíveis.', minLevel: 2 },
  { id: 'BTCI11', symbol: 'BTCI11', name: 'FII BTG CRI', sector: 'Fundo de Papel', type: 'FII', price: 10.00, volatility: 0.01, dividendYield: 0.010, description: 'BTG Pactual Crédito.', minLevel: 2 },
  { id: 'CCME11', symbol: 'CCME11', name: 'FII CANUMA', sector: 'Fundo de Papel', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.011, description: 'Fundo Canuma Capital.', minLevel: 2 },
  { id: 'ICRI11', symbol: 'ICRI11', name: 'FII CI IPCA', sector: 'Fundo de Papel', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.010, description: 'Indosuez CRI.', minLevel: 2 },
  { id: 'CLIN11', symbol: 'CLIN11', name: 'FII CLAVE IN', sector: 'Fundo de Papel', type: 'FII', price: 98.00, volatility: 0.01, dividendYield: 0.011, description: 'Clave Índices.', minLevel: 2 },
  { id: 'CYCR11', symbol: 'CYCR11', name: 'FII CYRELA', sector: 'Fundo de Papel', type: 'FII', price: 10.00, volatility: 0.01, dividendYield: 0.011, description: 'Cyrela Crédito.', minLevel: 2 },
  { id: 'VRTA11', symbol: 'VRTA11', name: 'FII FATOR VE', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.010, description: 'Fator Verita.', minLevel: 2 },
  { id: 'HABT11', symbol: 'HABT11', name: 'FII HABIT II', sector: 'Fundo de Papel', type: 'FII', price: 92.00, volatility: 0.02, dividendYield: 0.012, description: 'Habitat High Yield.', minLevel: 2 },
  { id: 'HGCR11', symbol: 'HGCR11', name: 'FII HGCR PAX', sector: 'Fundo de Papel', type: 'FII', price: 104.00, volatility: 0.01, dividendYield: 0.011, description: 'CSHG Recebíveis.', minLevel: 2 },
  { id: 'HSAF11', symbol: 'HSAF11', name: 'FII HSI CRI', sector: 'Fundo de Papel', type: 'FII', price: 85.00, volatility: 0.01, dividendYield: 0.010, description: 'HSI Ativos Financeiros.', minLevel: 2 },
  { id: 'ITRI11', symbol: 'ITRI11', name: 'FII ITRI', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'Integral Brei.', minLevel: 2 },
  { id: 'JSCR11', symbol: 'JSCR11', name: 'FII JSCR', sector: 'Fundo de Papel', type: 'FII', price: 80.00, volatility: 0.02, dividendYield: 0.010, description: 'Safra Asset.', minLevel: 2 },
  { id: 'KCRE11', symbol: 'KCRE11', name: 'FII KINEA CR', sector: 'Fundo de Papel', type: 'FII', price: 98.00, volatility: 0.01, dividendYield: 0.011, description: 'Kinea Crédito.', minLevel: 2 },
  { id: 'KNHY11', symbol: 'KNHY11', name: 'FII KINEA HY', sector: 'Fundo de Papel', type: 'FII', price: 102.00, volatility: 0.01, dividendYield: 0.012, description: 'Kinea High Yield.', minLevel: 2 },
  { id: 'KNSC11', symbol: 'KNSC11', name: 'FII KINEA SC', sector: 'Fundo de Papel', type: 'FII', price: 9.00, volatility: 0.01, dividendYield: 0.010, description: 'Kinea Securities.', minLevel: 2 },
  { id: 'KNUQ11', symbol: 'KNUQ11', name: 'FII KINEA UN', sector: 'Fundo de Papel', type: 'FII', price: 101.00, volatility: 0.01, dividendYield: 0.010, description: 'Kinea Unique.', minLevel: 2 },
  { id: 'KIVO11', symbol: 'KIVO11', name: 'FII KIVO', sector: 'Fundo de Papel', type: 'FII', price: 88.00, volatility: 0.02, dividendYield: 0.012, description: 'Kivo High Yield.', minLevel: 2 },
  { id: 'KORE11', symbol: 'KORE11', name: 'FII KORE', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'Kora Recebíveis.', minLevel: 2 },
  { id: 'LIFE11', symbol: 'LIFE11', name: 'FII LIFE', sector: 'Fundo de Papel', type: 'FII', price: 10.00, volatility: 0.02, dividendYield: 0.013, description: 'Life Capital.', minLevel: 2 },
  { id: 'MCCI11', symbol: 'MCCI11', name: 'FII MAUA', sector: 'Fundo de Papel', type: 'FII', price: 92.00, volatility: 0.01, dividendYield: 0.010, description: 'Mauá Capital Recebíveis.', minLevel: 2 },
  { id: 'MCRE11', symbol: 'MCRE11', name: 'FII MAUA RE', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.011, description: 'Mauá Recebíveis.', minLevel: 2 },
  { id: 'OUJP11', symbol: 'OUJP11', name: 'FII OURI JPP', sector: 'Fundo de Papel', type: 'FII', price: 96.00, volatility: 0.01, dividendYield: 0.011, description: 'Ourinvest JPP.', minLevel: 2 },
  { id: 'PCIP11', symbol: 'PCIP11', name: 'FII PCIP PAX', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.011, description: 'Plural Recebíveis.', minLevel: 2 },
  { id: 'PMIS11', symbol: 'PMIS11', name: 'FII PMIS', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.010, description: 'Plural Místico.', minLevel: 2 },
  { id: 'PORD11', symbol: 'PORD11', name: 'FII POLO CRI', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.011, description: 'Polo Recebíveis.', minLevel: 2 },
  { id: 'PSEC11', symbol: 'PSEC11', name: 'FII PSEC PAX', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.010, description: 'Plural Securities.', minLevel: 2 },
  { id: 'RBRY11', symbol: 'RBRY11', name: 'FII RBR PCRI', sector: 'Fundo de Papel', type: 'FII', price: 98.00, volatility: 0.01, dividendYield: 0.011, description: 'RBR Private Crédito.', minLevel: 2 },
  { id: 'RPRI11', symbol: 'RPRI11', name: 'FII RBR PR', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'RBR Premium.', minLevel: 2 },
  { id: 'RBRR11', symbol: 'RBRR11', name: 'FII RBRHGRAD', sector: 'Fundo de Papel', type: 'FII', price: 92.00, volatility: 0.009, dividendYield: 0.010, description: 'RBR High Grade.', minLevel: 2 },
  { id: 'RZAK11', symbol: 'RZAK11', name: 'FII RIZA AKN', sector: 'Fundo de Papel', type: 'FII', price: 88.00, volatility: 0.02, dividendYield: 0.013, description: 'Riza Akin.', minLevel: 2 },
  { id: 'SNCI11', symbol: 'SNCI11', name: 'FII SUNO CRI', sector: 'Fundo de Papel', type: 'FII', price: 99.00, volatility: 0.01, dividendYield: 0.011, description: 'Suno Recebíveis.', minLevel: 2 },
  { id: 'TVRI11', symbol: 'TVRI11', name: 'FII TIVIO RI', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'Tivio Renda Imob.', minLevel: 2 },
  { id: 'TOPP11', symbol: 'TOPP11', name: 'FII TOPP', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'Top Capital.', minLevel: 2 },
  { id: 'URPR11', symbol: 'URPR11', name: 'FII URCA REN', sector: 'Fundo de Papel', type: 'FII', price: 88.00, volatility: 0.03, dividendYield: 0.014, description: 'Urca Prime Renda.', minLevel: 2 },
  { id: 'VGIP11', symbol: 'VGIP11', name: 'FII VALORAIP', sector: 'Fundo de Papel', type: 'FII', price: 92.00, volatility: 0.01, dividendYield: 0.011, description: 'Valora IPCA.', minLevel: 2 },
  { id: 'VGIR11', symbol: 'VGIR11', name: 'FII VALREIII', sector: 'Fundo de Papel', type: 'FII', price: 9.80, volatility: 0.01, dividendYield: 0.012, description: 'Valora RE III.', minLevel: 2 },
  { id: 'VCJR11', symbol: 'VCJR11', name: 'FII VECTIS', sector: 'Fundo de Papel', type: 'FII', price: 94.00, volatility: 0.01, dividendYield: 0.011, description: 'Vectis Juros Real.', minLevel: 2 },
  { id: 'VGRI11', symbol: 'VGRI11', name: 'FII VGRI', sector: 'Fundo de Papel', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.011, description: 'Valora Green.', minLevel: 2 },
  { id: 'VRTM11', symbol: 'VRTM11', name: 'FII VRTM', sector: 'Fundo de Papel', type: 'FII', price: 10.00, volatility: 0.01, dividendYield: 0.010, description: 'Fator Verita Multi.', minLevel: 2 },
  { id: 'XPCI11', symbol: 'XPCI11', name: 'FII XP CRED', sector: 'Fundo de Papel', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.010, description: 'XP Crédito Imob.', minLevel: 2 },

  // Tijolo - Logística
  { id: 'HGLG11', symbol: 'HGLG11', name: 'CSHG LOGISTICA', sector: 'Logística', type: 'FII', price: 165.00, volatility: 0.005, dividendYield: 0.007, description: 'Líder em galpões logísticos.', minLevel: 2 },
  { id: 'BTLG11', symbol: 'BTLG11', name: 'BTG LOGISTICA', sector: 'Logística', type: 'FII', price: 105.00, volatility: 0.006, dividendYield: 0.008, description: 'Fundo de logística do BTG.', minLevel: 2 },
  { id: 'XPLG11', symbol: 'XPLG11', name: 'XP LOG', sector: 'Logística', type: 'FII', price: 108.00, volatility: 0.006, dividendYield: 0.0075, description: 'Galpões XP Asset.', minLevel: 2 },
  { id: 'LVBI11', symbol: 'LVBI11', name: 'VBI LOGISTICA', sector: 'Logística', type: 'FII', price: 115.00, volatility: 0.006, dividendYield: 0.0075, description: 'VBI Logística.', minLevel: 2 },
  { id: 'VILG11', symbol: 'VILG11', name: 'VINCI LOGISTICA', sector: 'Logística', type: 'FII', price: 98.00, volatility: 0.007, dividendYield: 0.007, description: 'Vinci Logística.', minLevel: 2 },
  { id: 'BLMG11', symbol: 'BLMG11', name: 'FII BLUE LOG', sector: 'Logística', type: 'FII', price: 45.00, volatility: 0.02, dividendYield: 0.009, description: 'BlueMacaw Logística.', minLevel: 2 },
  { id: 'BRCO11', symbol: 'BRCO11', name: 'FII BRESCO', sector: 'Logística', type: 'FII', price: 118.00, volatility: 0.005, dividendYield: 0.007, description: 'Bresco Logística.', minLevel: 2 },
  { id: 'GGRC11', symbol: 'GGRC11', name: 'FII GGRCOVEP', sector: 'Logística/Ind', type: 'FII', price: 110.00, volatility: 0.007, dividendYield: 0.008, description: 'GGR Covepi Renda.', minLevel: 2 },
  { id: 'GRUL11', symbol: 'GRUL11', name: 'FII GRUL', sector: 'Logística', type: 'FII', price: 100.00, volatility: 0.005, dividendYield: 0.000, description: 'GR Guarulhos.', minLevel: 2 },
  { id: 'HSLG11', symbol: 'HSLG11', name: 'FII HSI LOG', sector: 'Logística', type: 'FII', price: 92.00, volatility: 0.006, dividendYield: 0.007, description: 'HSI Logística.', minLevel: 2 },
  { id: 'PATL11', symbol: 'PATL11', name: 'FII PATL VBI', sector: 'Logística', type: 'FII', price: 68.00, volatility: 0.01, dividendYield: 0.008, description: 'Pátria Logística.', minLevel: 2 },
  { id: 'RBRL11', symbol: 'RBRL11', name: 'FII RBR LOG', sector: 'Logística', type: 'FII', price: 85.00, volatility: 0.007, dividendYield: 0.008, description: 'RBR Logística.', minLevel: 2 },
  { id: 'TRBL11', symbol: 'TRBL11', name: 'FII SDI LOG', sector: 'Logística', type: 'FII', price: 98.00, volatility: 0.006, dividendYield: 0.007, description: 'Tellus Rio Bravo.', minLevel: 2 },

  // Tijolo - Shopping
  { id: 'XPML11', symbol: 'XPML11', name: 'XP MALLS', sector: 'Shopping', type: 'FII', price: 115.00, volatility: 0.008, dividendYield: 0.008, description: 'Portfólio de Shoppings XP.', minLevel: 2 },
  { id: 'VISC11', symbol: 'VISC11', name: 'VINCI SHOPPING', sector: 'Shopping', type: 'FII', price: 120.00, volatility: 0.007, dividendYield: 0.008, description: 'Vinci Shopping Centers.', minLevel: 2 },
  { id: 'HGBS11', symbol: 'HGBS11', name: 'FII HEDGEBS', sector: 'Shopping', type: 'FII', price: 215.00, volatility: 0.006, dividendYield: 0.007, description: 'Hedge Brasil Shopping.', minLevel: 2 },
  { id: 'HSML11', symbol: 'HSML11', name: 'FII HSI MALL', sector: 'Shopping', type: 'FII', price: 95.00, volatility: 0.007, dividendYield: 0.008, description: 'HSI Malls.', minLevel: 2 },
  { id: 'BPML11', symbol: 'BPML11', name: 'FII BTG SHOP', sector: 'Shopping', type: 'FII', price: 98.00, volatility: 0.007, dividendYield: 0.000, description: 'BTG Pactual Shoppings.', minLevel: 2 },
  { id: 'CPSH11', symbol: 'CPSH11', name: 'FII CPSH', sector: 'Shopping', type: 'FII', price: 100.00, volatility: 0.007, dividendYield: 0.000, description: 'Capitânia Shoppings.', minLevel: 2 },
  { id: 'PMLL11', symbol: 'PMLL11', name: 'FII PMLL PAX', sector: 'Shopping', type: 'FII', price: 100.00, volatility: 0.007, dividendYield: 0.000, description: 'Pátria Malls.', minLevel: 2 },
  { id: 'SPXS11', symbol: 'SPXS11', name: 'FII SPX SYN', sector: 'Shopping', type: 'FII', price: 100.00, volatility: 0.007, dividendYield: 0.000, description: 'SPX Syn.', minLevel: 2 },

  // Tijolo - Lajes Corporativas (Escritórios)
  { id: 'KNRI11', symbol: 'KNRI11', name: 'FII KINEA', sector: 'Lajes/Híbrido', type: 'FII', price: 160.00, volatility: 0.005, dividendYield: 0.0065, description: 'Kinea Renda Imobiliária.', minLevel: 2 },
  { id: 'BRCR11', symbol: 'BRCR11', name: 'FII BC FUND', sector: 'Lajes Corporativas', type: 'FII', price: 55.00, volatility: 0.01, dividendYield: 0.008, description: 'BTG Corporate Office.', minLevel: 2 },
  { id: 'JSRE11', symbol: 'JSRE11', name: 'FII JS REAL', sector: 'Lajes Corporativas', type: 'FII', price: 70.00, volatility: 0.01, dividendYield: 0.007, description: 'JS Real Estate Multigestão.', minLevel: 2 },
  { id: 'HGRE11', symbol: 'HGRE11', name: 'FII HGRE PAX', sector: 'Lajes Corporativas', type: 'FII', price: 115.00, volatility: 0.01, dividendYield: 0.006, description: 'CSHG Real Estate.', minLevel: 2 },
  { id: 'PVBI11', symbol: 'PVBI11', name: 'FII PVBI VBI', sector: 'Lajes Corporativas', type: 'FII', price: 102.00, volatility: 0.006, dividendYield: 0.0065, description: 'VBI Prime Properties.', minLevel: 2 },
  { id: 'RECT11', symbol: 'RECT11', name: 'FII REC REND', sector: 'Lajes Corporativas', type: 'FII', price: 38.00, volatility: 0.02, dividendYield: 0.010, description: 'REC Renda Imobiliária.', minLevel: 2 },
  { id: 'BROF11', symbol: 'BROF11', name: 'FII BROF', sector: 'Lajes Corporativas', type: 'FII', price: 60.00, volatility: 0.01, dividendYield: 0.009, description: 'BRPR Corporate.', minLevel: 2 },
  { id: 'GTWR11', symbol: 'GTWR11', name: 'FII G TOWERS', sector: 'Lajes Corporativas', type: 'FII', price: 80.00, volatility: 0.01, dividendYield: 0.009, description: 'Green Towers.', minLevel: 2 },
  { id: 'RBRP11', symbol: 'RBRP11', name: 'FII RBR PROP', sector: 'Lajes Corporativas', type: 'FII', price: 55.00, volatility: 0.01, dividendYield: 0.000, description: 'RBR Properties.', minLevel: 2 },
  { id: 'RCRB11', symbol: 'RCRB11', name: 'FII RIOB RC', sector: 'Lajes Corporativas', type: 'FII', price: 140.00, volatility: 0.005, dividendYield: 0.000, description: 'Rio Bravo Renda.', minLevel: 2 },
  { id: 'TEPP11', symbol: 'TEPP11', name: 'FII TEL PROP', sector: 'Lajes Corporativas', type: 'FII', price: 90.00, volatility: 0.008, dividendYield: 0.007, description: 'Tellus Properties.', minLevel: 2 },
  { id: 'VINO11', symbol: 'VINO11', name: 'FII VINCI OF', sector: 'Lajes Corporativas', type: 'FII', price: 8.00, volatility: 0.02, dividendYield: 0.008, description: 'Vinci Offices.', minLevel: 2 },

  // Fundo de Fundos (FoF) e Hedge
  { id: 'HFOF11', symbol: 'HFOF11', name: 'FII HTOPFOF3', sector: 'Fundo de Fundos', type: 'FII', price: 78.00, volatility: 0.01, dividendYield: 0.008, description: 'Hedge Top FOF.', minLevel: 2 },
  { id: 'BCIA11', symbol: 'BCIA11', name: 'FII BCIA', sector: 'Fundo de Fundos', type: 'FII', price: 105.00, volatility: 0.01, dividendYield: 0.008, description: 'Bradesco Carteira.', minLevel: 2 },
  { id: 'KFOF11', symbol: 'KFOF11', name: 'FII KINEAFOF', sector: 'Fundo de Fundos', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.008, description: 'Kinea FOF.', minLevel: 2 },
  { id: 'SNFF11', symbol: 'SNFF11', name: 'FII SUNOFOFI', sector: 'Fundo de Fundos', type: 'FII', price: 90.00, volatility: 0.01, dividendYield: 0.008, description: 'Suno FOF.', minLevel: 2 },
  { id: 'RBFF11', symbol: 'RBFF11', name: 'FII RIOB FF', sector: 'Fundo de Fundos', type: 'FII', price: 60.00, volatility: 0.01, dividendYield: 0.008, description: 'Rio Bravo Fundo de Fundos.', minLevel: 2 },
  { id: 'JSAF11', symbol: 'JSAF11', name: 'FII JS A FIN', sector: 'Fundo de Fundos', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.009, description: 'JS Ativos Financeiros.', minLevel: 2 },
  { id: 'BTHF11', symbol: 'BTHF11', name: 'FII BTHF', sector: 'Hedge Fund', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.010, description: 'BTG Hedge Fund.', minLevel: 2 },
  { id: 'KNHF11', symbol: 'KNHF11', name: 'FII KINEA HF', sector: 'Hedge Fund', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.000, description: 'Kinea Hedge.', minLevel: 2 },
  { id: 'MANA11', symbol: 'MANA11', name: 'FII MANATI', sector: 'Hedge Fund', type: 'FII', price: 9.50, volatility: 0.01, dividendYield: 0.011, description: 'Manatí Capital.', minLevel: 2 },
  { id: 'RBRX11', symbol: 'RBRX11', name: 'FII RBR MULT', sector: 'Hedge Fund', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.010, description: 'RBR Multi.', minLevel: 2 },

  // Agro, Desenvolvimento e Outros
  { id: 'BTAL11', symbol: 'BTAL11', name: 'FII BTG AGRO', sector: 'Fiagro/Log', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.010, description: 'BTG Agro Logística.', minLevel: 2 },
  { id: 'RZTR11', symbol: 'RZTR11', name: 'FII RIZA TX', sector: 'Fiagro/Terras', type: 'FII', price: 95.00, volatility: 0.01, dividendYield: 0.009, description: 'Riza Terrax.', minLevel: 2 },
  { id: 'SNEL11', symbol: 'SNEL11', name: 'FII SUNO EL', sector: 'Energia', type: 'FII', price: 10.00, volatility: 0.01, dividendYield: 0.011, description: 'Suno Energias Limpas.', minLevel: 2 },
  { id: 'TGAR11', symbol: 'TGAR11', name: 'FII TG ATIVO', sector: 'Desenvolvimento', type: 'FII', price: 115.00, volatility: 0.02, dividendYield: 0.012, description: 'TG Ativo Real.', minLevel: 2 },
  { id: 'MFII11', symbol: 'MFII11', name: 'FII MERITO I', sector: 'Desenvolvimento', type: 'FII', price: 90.00, volatility: 0.02, dividendYield: 0.010, description: 'Mérito Desenvolvimento.', minLevel: 2 },
  { id: 'TRXF11', symbol: 'TRXF11', name: 'FII TRX REAL', sector: 'Varejo', type: 'FII', price: 110.00, volatility: 0.006, dividendYield: 0.008, description: 'TRX Real Estate (Big Boxes).', minLevel: 2 },
  { id: 'HGRU11', symbol: 'HGRU11', name: 'FII HGRU PAX', sector: 'Varejo/Educ', type: 'FII', price: 130.00, volatility: 0.006, dividendYield: 0.007, description: 'CSHG Renda Urbana.', minLevel: 2 },
  { id: 'RBVA11', symbol: 'RBVA11', name: 'FII RIOB VA', sector: 'Varejo', type: 'FII', price: 110.00, volatility: 0.007, dividendYield: 0.009, description: 'Rio Bravo Varejo.', minLevel: 2 },
  { id: 'HTMX11', symbol: 'HTMX11', name: 'FII HOTEL MX', sector: 'Hotelaria', type: 'FII', price: 160.00, volatility: 0.03, dividendYield: 0.000, description: 'Hotel Maxinvest.', minLevel: 2 },
  { id: 'ALZR11', symbol: 'ALZR11', name: 'FII ALIANZA', sector: 'Híbrido', type: 'FII', price: 115.00, volatility: 0.006, dividendYield: 0.007, description: 'Alianza Trust Renda.', minLevel: 2 },
  { id: 'GZIT11', symbol: 'GZIT11', name: 'FII GAZIT', sector: 'Híbrido', type: 'FII', price: 50.00, volatility: 0.02, dividendYield: 0.000, description: 'Gazit Properties.', minLevel: 2 },
  { id: 'WHGR11', symbol: 'WHGR11', name: 'FII WHG REAL', sector: 'Híbrido', type: 'FII', price: 9.80, volatility: 0.01, dividendYield: 0.009, description: 'WHG Real Estate.', minLevel: 2 },
  { id: 'AZPL11', symbol: 'AZPL11', name: 'FII AZPL', sector: 'Indefinido', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.000, description: 'Az Quest PL.', minLevel: 2 },
  { id: 'BBIG11', symbol: 'BBIG11', name: 'FII BBIG', sector: 'Indefinido', type: 'FII', price: 100.00, volatility: 0.01, dividendYield: 0.000, description: 'BB IG.', minLevel: 2 },
  
  // --- NÍVEL 3: BLUE CHIPS (Top Tier) ---
  { id: 'VALE3', symbol: 'VALE3', name: 'VALE DO RIO DOCE', sector: 'Materiais', type: 'STOCK', price: 61.00, volatility: 0.04, dividendYield: 0.008, description: 'Gigante da mineração global.', minLevel: 3 },
  { id: 'ITUB4', symbol: 'ITUB4', name: 'ITAU UNIBANCO HOLDING PREF SA', sector: 'Produtos financeiros', type: 'STOCK', price: 35.00, volatility: 0.03, dividendYield: 0.006, description: 'Maior banco privado do país.', minLevel: 3 },
  { id: 'PETR4', symbol: 'PETR4', name: 'PETROLEO BRASILEIRO PREF SA', sector: 'Energia', type: 'STOCK', price: 38.00, volatility: 0.05, dividendYield: 0.015, description: 'Estatal de petróleo (PN).', minLevel: 3 },
  { id: 'PETR3', symbol: 'PETR3', name: 'PETROLEO BRASILEIRO SA PETROBRAS', sector: 'Energia', type: 'STOCK', price: 41.00, volatility: 0.05, dividendYield: 0.015, description: 'Estatal de petróleo (ON).', minLevel: 3 },
  { id: 'BBDC4', symbol: 'BBDC4', name: 'BANCO BRADESCO PREF SA', sector: 'Produtos financeiros', type: 'STOCK', price: 15.00, volatility: 0.03, dividendYield: 0.007, description: 'Grande banco de varejo.', minLevel: 3 },
  { id: 'BBAS3', symbol: 'BBAS3', name: 'BANCO DO BRASIL SA', sector: 'Produtos financeiros', type: 'STOCK', price: 28.00, volatility: 0.04, dividendYield: 0.009, description: 'Banco estatal histórico.', minLevel: 3 },
  { id: 'WEGE3', symbol: 'WEGE3', name: 'WEG SA', sector: 'Bens Industriais', type: 'STOCK', price: 54.00, volatility: 0.03, dividendYield: 0.003, description: 'Multinacional de motores.', minLevel: 3 },
  { id: 'ABEV3', symbol: 'ABEV3', name: 'AMBEV SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 13.00, volatility: 0.02, dividendYield: 0.005, description: 'Líder em bebidas.', minLevel: 3 },
  { id: 'B3SA3', symbol: 'B3SA3', name: 'B3 BRASIL BOLSA BALCAO SA', sector: 'Produtos financeiros', type: 'STOCK', price: 11.00, volatility: 0.04, dividendYield: 0.004, description: 'A bolsa do Brasil.', minLevel: 3 },
  { id: 'ITSA4', symbol: 'ITSA4', name: 'ITAUSA INVESTIMENTOS ITAU PREF SA', sector: 'Produtos financeiros', type: 'STOCK', price: 10.00, volatility: 0.03, dividendYield: 0.006, description: 'Holding do Itaú.', minLevel: 3 },
  { id: 'BPAC11', symbol: 'BPAC11', name: 'BCO BTG PACTUAL UNT SA', sector: 'Produtos financeiros', type: 'STOCK', price: 35.00, volatility: 0.04, dividendYield: 0.004, description: 'Banco de investimento.', minLevel: 3 },

  // --- NÍVEL 4: DEFENSIVAS (Serviços Públicos) ---
  { id: 'AXIA3', symbol: 'AXIA3', name: 'CENTRAIS ELETR BRAS-ELETROBRAS SA', sector: 'Serviços públicos', type: 'STOCK', price: 40.00, volatility: 0.03, dividendYield: 0.005, description: 'Geração e transmissão.', minLevel: 4 },
  { id: 'SBSP3', symbol: 'SBSP3', name: 'COMPANHIA DE SANEAMENTO BASICO DE', sector: 'Serviços públicos', type: 'STOCK', price: 88.00, volatility: 0.03, dividendYield: 0.004, description: 'Saneamento básico SP.', minLevel: 4 },
  { id: 'EQTL3', symbol: 'EQTL3', name: 'EQUATORIAL SA', sector: 'Serviços públicos', type: 'STOCK', price: 33.00, volatility: 0.03, dividendYield: 0.005, description: 'Holding de energia.', minLevel: 4 },
  { id: 'ENEV3', symbol: 'ENEV3', name: 'ENEVA SA', sector: 'Serviços públicos', type: 'STOCK', price: 13.00, volatility: 0.04, dividendYield: 0.0, description: 'Energia integrada.', minLevel: 4 },
  { id: 'AXIA7', symbol: 'AXIA7', name: 'CENTRAIS ELET BRAS PRF SA', sector: 'Serviços públicos', type: 'STOCK', price: 45.00, volatility: 0.03, dividendYield: 0.005, description: 'Eletrobras PN.', minLevel: 4 },
  { id: 'CMIG4', symbol: 'CMIG4', name: 'CIA ENERGETICA DE MINAS GERAIS PRE', sector: 'Serviços públicos', type: 'STOCK', price: 12.00, volatility: 0.03, dividendYield: 0.008, description: 'Energia de Minas Gerais.', minLevel: 4 },
  { id: 'CPLE3', symbol: 'CPLE3', name: 'CIA PARANAENSE DE ENERGIA COPEL', sector: 'Serviços públicos', type: 'STOCK', price: 10.00, volatility: 0.03, dividendYield: 0.007, description: 'Energia do Paraná.', minLevel: 4 },
  { id: 'ENGI11', symbol: 'ENGI11', name: 'ENERGISA UNITS SA', sector: 'Serviços públicos', type: 'STOCK', price: 45.00, volatility: 0.03, dividendYield: 0.006, description: 'Distribuição de energia.', minLevel: 4 },
  { id: 'AXIA6', symbol: 'AXIA6', name: 'CENTRAIS ELETR BRAS-ELETROBRAS PRE', sector: 'Serviços públicos', type: 'STOCK', price: 48.00, volatility: 0.03, dividendYield: 0.005, description: 'Eletrobras PNB.', minLevel: 4 },
  { id: 'EGIE3', symbol: 'EGIE3', name: 'ENGIE BRASIL ENERGIA SA', sector: 'Serviços públicos', type: 'STOCK', price: 45.00, volatility: 0.02, dividendYield: 0.008, description: 'Geradora privada.', minLevel: 4 },
  { id: 'ISAE4', symbol: 'ISAE4', name: 'ISA ENERGIA BRASIL PREF SA', sector: 'Serviços públicos', type: 'STOCK', price: 25.00, volatility: 0.02, dividendYield: 0.009, description: 'Transmissão (antiga CTEEP).', minLevel: 4 },
  { id: 'CPFE3', symbol: 'CPFE3', name: 'CPFL ENERGIA SA', sector: 'Serviços públicos', type: 'STOCK', price: 34.00, volatility: 0.02, dividendYield: 0.007, description: 'Distribuição e geração.', minLevel: 4 },
  { id: 'TAEE11', symbol: 'TAEE11', name: 'TRANSMISSORA ALIANCA ENERGIA ELETR', sector: 'Serviços públicos', type: 'STOCK', price: 36.00, volatility: 0.02, dividendYield: 0.009, description: 'Transmissão pura.', minLevel: 4 },
  { id: 'CSMG3', symbol: 'CSMG3', name: 'COMPANHIA DE SANEAMENTO DE MINAS G', sector: 'Serviços públicos', type: 'STOCK', price: 18.00, volatility: 0.03, dividendYield: 0.006, description: 'Saneamento MG.', minLevel: 4 },
  { id: 'AURE3', symbol: 'AURE3', name: 'AUREN ENERGIA SA', sector: 'Serviços públicos', type: 'STOCK', price: 13.00, volatility: 0.04, dividendYield: 0.005, description: 'Energia renovável.', minLevel: 4 },

  // --- NÍVEL 5: GERAL (Growth, Cíclicas, Small Caps, Outros) ---
  { id: 'EMBJ3', symbol: 'EMBJ3', name: 'EMBRAER SA', sector: 'Bens Industriais', type: 'STOCK', price: 45.00, volatility: 0.06, dividendYield: 0.001, description: 'Fabricante de aeronaves.', minLevel: 5 },
  { id: 'RDOR3', symbol: 'RDOR3', name: 'REDE DOR SAO LUIZ SA', sector: 'Cuidados de saúde', type: 'STOCK', price: 30.00, volatility: 0.04, dividendYield: 0.002, description: 'Rede hospitalar.', minLevel: 5 },
  { id: 'RENT3', symbol: 'RENT3', name: 'LOCALIZA RENT A CAR SA', sector: 'Bens Industriais', type: 'STOCK', price: 45.00, volatility: 0.05, dividendYield: 0.003, description: 'Aluguel de carros.', minLevel: 5 },
  { id: 'PRIO3', symbol: 'PRIO3', name: 'PETRO RIO SA', sector: 'Energia', type: 'STOCK', price: 48.00, volatility: 0.06, dividendYield: 0.0, description: 'Petroleira júnior.', minLevel: 5 },
  { id: 'SUZB3', symbol: 'SUZB3', name: 'SUZANO SA', sector: 'Materiais', type: 'STOCK', price: 55.00, volatility: 0.04, dividendYield: 0.005, description: 'Papel e celulose.', minLevel: 5 },
  { id: 'RADL3', symbol: 'RADL3', name: 'RAIA DROGASIL', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 26.00, volatility: 0.03, dividendYield: 0.002, description: 'Varejo farmacêutico.', minLevel: 5 },
  { id: 'VBBR3', symbol: 'VBBR3', name: 'VIBRA ENERGIA SA', sector: 'Consumo discricionário', type: 'STOCK', price: 25.00, volatility: 0.04, dividendYield: 0.004, description: 'Distribuidora de combustíveis.', minLevel: 5 },
  { id: 'GGBR4', symbol: 'GGBR4', name: 'GERDAU PREF SA', sector: 'Materiais', type: 'STOCK', price: 18.00, volatility: 0.05, dividendYield: 0.006, description: 'Siderúrgica.', minLevel: 5 },
  { id: 'VIVT3', symbol: 'VIVT3', name: 'TELEFONICA BRASIL SA', sector: 'Comunicação', type: 'STOCK', price: 50.00, volatility: 0.02, dividendYield: 0.007, description: 'Telefonia (Vivo).', minLevel: 5 },
  { id: 'BBDC3', symbol: 'BBDC3', name: 'BANCO BRADESCO SA', sector: 'Produtos financeiros', type: 'STOCK', price: 13.00, volatility: 0.03, dividendYield: 0.007, description: 'Bradesco ON.', minLevel: 5 },
  { id: 'UGPA3', symbol: 'UGPA3', name: 'ULTRAPAR PARTICIPOES SA', sector: 'Consumo discricionário', type: 'STOCK', price: 25.00, volatility: 0.03, dividendYield: 0.004, description: 'Conglomerado (Ipiranga/Ultragaz).', minLevel: 5 },
  { id: 'BBSE3', symbol: 'BBSE3', name: 'BB SEGURIDADE SA', sector: 'Produtos financeiros', type: 'STOCK', price: 33.00, volatility: 0.02, dividendYield: 0.008, description: 'Seguros.', minLevel: 5 },
  { id: 'TOTS3', symbol: 'TOTS3', name: 'TOTVS SA', sector: 'Tecnologia de informação', type: 'STOCK', price: 30.00, volatility: 0.05, dividendYield: 0.002, description: 'Software de gestão.', minLevel: 5 },
  { id: 'RAIL3', symbol: 'RAIL3', name: 'RUMO SA', sector: 'Bens Industriais', type: 'STOCK', price: 22.00, volatility: 0.04, dividendYield: 0.001, description: 'Logística ferroviária.', minLevel: 5 },
  { id: 'TIMS3', symbol: 'TIMS3', name: 'TIM SA', sector: 'Comunicação', type: 'STOCK', price: 18.00, volatility: 0.03, dividendYield: 0.005, description: 'Telefonia.', minLevel: 5 },
  { id: 'KLBN11', symbol: 'KLBN11', name: 'KLABIN UNITS SA', sector: 'Materiais', type: 'STOCK', price: 22.00, volatility: 0.04, dividendYield: 0.006, description: 'Papel e embalagens.', minLevel: 5 },
  { id: 'MBRF3', symbol: 'MBRF3', name: 'MARFRIG GLOBAL FOODS SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 13.00, volatility: 0.06, dividendYield: 0.003, description: 'Alimentos e carnes.', minLevel: 5 },
  { id: 'MOTV3', symbol: 'MOTV3', name: 'MOTIVA INFRAESTRUTURA DE MOBILIDAD', sector: 'Bens Industriais', type: 'STOCK', price: 10.00, volatility: 0.05, dividendYield: 0.0, description: 'Mobilidade urbana.', minLevel: 5 },
  { id: 'ALOS3', symbol: 'ALOS3', name: 'ALLOS SA', sector: 'Imobiliário', type: 'STOCK', price: 22.00, volatility: 0.04, dividendYield: 0.003, description: 'Shoppings (Aliansce Sonae).', minLevel: 5 },
  { id: 'LREN3', symbol: 'LREN3', name: 'LOJAS RENNER SA', sector: 'Consumo discricionário', type: 'STOCK', price: 18.00, volatility: 0.05, dividendYield: 0.004, description: 'Varejo de moda.', minLevel: 5 },
  { id: 'SANB11', symbol: 'SANB11', name: 'BANCO SANTANDER BRASIL UNITS SA', sector: 'Produtos financeiros', type: 'STOCK', price: 28.00, volatility: 0.04, dividendYield: 0.006, description: 'Banco Santander.', minLevel: 5 },
  { id: 'SMFT3', symbol: 'SMFT3', name: 'SMARTFIT ESCOLA DE GINASTICA E DAN', sector: 'Consumo discricionário', type: 'STOCK', price: 20.00, volatility: 0.06, dividendYield: 0.001, description: 'Rede de academias.', minLevel: 5 },
  { id: 'CXSE3', symbol: 'CXSE3', name: 'CAIXA SEGURIDADE PARTICIPACOES SA', sector: 'Produtos financeiros', type: 'STOCK', price: 15.00, volatility: 0.02, dividendYield: 0.008, description: 'Seguros Caixa.', minLevel: 5 },
  { id: 'ASAI3', symbol: 'ASAI3', name: 'SENDAS DISTRIBUIDORA SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 14.00, volatility: 0.05, dividendYield: 0.001, description: 'Assaí Atacadista.', minLevel: 5 },
  { id: 'CSAN3', symbol: 'CSAN3', name: 'COSAN INDUSTRIA E COMERCIO SA', sector: 'Consumo discricionário', type: 'STOCK', price: 13.00, volatility: 0.05, dividendYield: 0.003, description: 'Conglomerado de energia.', minLevel: 5 },
  { id: 'CMIN3', symbol: 'CMIN3', name: 'CSN MINERACAO SA', sector: 'Materiais', type: 'STOCK', price: 5.00, volatility: 0.06, dividendYield: 0.008, description: 'Mineração.', minLevel: 5 },
  { id: 'PSSA3', symbol: 'PSSA3', name: 'PORTO SEGURO SA', sector: 'Produtos financeiros', type: 'STOCK', price: 30.00, volatility: 0.03, dividendYield: 0.005, description: 'Seguros.', minLevel: 5 },
  { id: 'MULT3', symbol: 'MULT3', name: 'MULTIPLAN EMPREENDIMENTOS IMOBILIA', sector: 'Imobiliário', type: 'STOCK', price: 25.00, volatility: 0.03, dividendYield: 0.004, description: 'Shoppings premium.', minLevel: 5 },
  { id: 'BRAV3', symbol: 'BRAV3', name: 'BRAVA ENERGIA SA', sector: 'Energia', type: 'STOCK', price: 20.00, volatility: 0.06, dividendYield: 0.0, description: 'Energia (Fusão 3R/Enauta).', minLevel: 5 },
  { id: 'GOAU4', symbol: 'GOAU4', name: 'METALURGICA GERDAU PREF SA', sector: 'Materiais', type: 'STOCK', price: 11.00, volatility: 0.05, dividendYield: 0.007, description: 'Holding da Gerdau.', minLevel: 5 },
  { id: 'HYPE3', symbol: 'HYPE3', name: 'HYPERMARCAS SA', sector: 'Cuidados de saúde', type: 'STOCK', price: 30.00, volatility: 0.03, dividendYield: 0.003, description: 'Farmacêutica.', minLevel: 5 },
  { id: 'FLRY3', symbol: 'FLRY3', name: 'FLEURY SA', sector: 'Cuidados de saúde', type: 'STOCK', price: 15.00, volatility: 0.03, dividendYield: 0.004, description: 'Medicina diagnóstica.', minLevel: 5 },
  { id: 'CSNA3', symbol: 'CSNA3', name: 'COMPANHIA SIDERURGICA NACIONAL SA', sector: 'Materiais', type: 'STOCK', price: 12.00, volatility: 0.06, dividendYield: 0.005, description: 'Siderurgia.', minLevel: 5 },
  { id: 'COGN3', symbol: 'COGN3', name: 'COGNA EDUCACAO SA', sector: 'Consumo discricionário', type: 'STOCK', price: 2.50, volatility: 0.07, dividendYield: 0.0, description: 'Educação.', minLevel: 5 },
  { id: 'CYRE3', symbol: 'CYRE3', name: 'CYRELA BRAZIL REALTY SA', sector: 'Consumo discricionário', type: 'STOCK', price: 20.00, volatility: 0.06, dividendYield: 0.004, description: 'Construção civil.', minLevel: 5 },
  { id: 'NATU3', symbol: 'NATU3', name: 'NATURA COSMETICOS SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 15.00, volatility: 0.06, dividendYield: 0.002, description: 'Cosméticos.', minLevel: 5 },
  { id: 'IGTI11', symbol: 'IGTI11', name: 'IGUATEMI UNIT SA', sector: 'Imobiliário', type: 'STOCK', price: 22.00, volatility: 0.03, dividendYield: 0.003, description: 'Shoppings de luxo.', minLevel: 5 },
  { id: 'CURY3', symbol: 'CURY3', name: 'CURY CONSTRTUTORA E INCORPORADORA', sector: 'Consumo discricionário', type: 'STOCK', price: 18.00, volatility: 0.05, dividendYield: 0.004, description: 'Construtora.', minLevel: 5 },
  { id: 'BRAP4', symbol: 'BRAP4', name: 'BRADESPAR PREF SA', sector: 'Materiais', type: 'STOCK', price: 20.00, volatility: 0.05, dividendYield: 0.008, description: 'Holding (Vale).', minLevel: 5 },
  { id: 'DIRR3', symbol: 'DIRR3', name: 'DIRECIONAL ENGENHARIA SA', sector: 'Consumo discricionário', type: 'STOCK', price: 25.00, volatility: 0.05, dividendYield: 0.004, description: 'Construção.', minLevel: 5 },
  { id: 'IRBR3', symbol: 'IRBR3', name: 'IRB BRASIL RESSEGUROS SA', sector: 'Produtos financeiros', type: 'STOCK', price: 40.00, volatility: 0.08, dividendYield: 0.0, description: 'Resseguros.', minLevel: 5 },
  { id: 'POMO4', symbol: 'POMO4', name: 'MARCOPOLO PREF SA', sector: 'Bens Industriais', type: 'STOCK', price: 6.00, volatility: 0.05, dividendYield: 0.003, description: 'Carrocerias de ônibus.', minLevel: 5 },
  { id: 'HAPV3', symbol: 'HAPV3', name: 'HAPVIDA PARTICIPACOES E INVESTIMEN', sector: 'Cuidados de saúde', type: 'STOCK', price: 4.50, volatility: 0.06, dividendYield: 0.0, description: 'Planos de saúde.', minLevel: 5 },
  { id: 'VIVA3', symbol: 'VIVA3', name: 'VIVARA PARTICIPACOES SA', sector: 'Consumo discricionário', type: 'STOCK', price: 25.00, volatility: 0.04, dividendYield: 0.002, description: 'Joalheria.', minLevel: 5 },
  { id: 'AZZA3', symbol: 'AZZA3', name: 'AZZAS SA', sector: 'Consumo discricionário', type: 'STOCK', price: 50.00, volatility: 0.05, dividendYield: 0.002, description: 'Moda (Arezzo/Soma).', minLevel: 5 },
  { id: 'SLCE3', symbol: 'SLCE3', name: 'SLC AGRICOLA SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 18.00, volatility: 0.05, dividendYield: 0.004, description: 'Agronegócio.', minLevel: 5 },
  { id: 'MGLU3', symbol: 'MGLU3', name: 'MAGAZINE LUIZA SA', sector: 'Consumo discricionário', type: 'STOCK', price: 10.00, volatility: 0.09, dividendYield: 0.0, description: 'Varejo online.', minLevel: 5 },
  { id: 'YDUQ3', symbol: 'YDUQ3', name: 'YDUQS PARTICIPACOES SA', sector: 'Consumo discricionário', type: 'STOCK', price: 12.00, volatility: 0.07, dividendYield: 0.0, description: 'Educação.', minLevel: 5 },
  { id: 'USIM5', symbol: 'USIM5', name: 'USINAS SIDERURGICAS DE MINAS GERAI', sector: 'Materiais', type: 'STOCK', price: 6.00, volatility: 0.07, dividendYield: 0.002, description: 'Siderurgia.', minLevel: 5 },
  { id: 'RECV3', symbol: 'RECV3', name: 'PETRORECONCAVO SA', sector: 'Energia', type: 'STOCK', price: 20.00, volatility: 0.06, dividendYield: 0.002, description: 'Petróleo onshore.', minLevel: 5 },
  { id: 'MRVE3', symbol: 'MRVE3', name: 'MRV ENGENHARIA E PARTICIPACOES SA', sector: 'Consumo discricionário', type: 'STOCK', price: 7.00, volatility: 0.06, dividendYield: 0.003, description: 'Construção popular.', minLevel: 5 },
  { id: 'CEAB3', symbol: 'CEAB3', name: 'C A MODAS SA', sector: 'Consumo discricionário', type: 'STOCK', price: 10.00, volatility: 0.06, dividendYield: 0.0, description: 'Varejo de moda (C&A).', minLevel: 5 },
  { id: 'BEEF3', symbol: 'BEEF3', name: 'MINERVA SA', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 7.00, volatility: 0.05, dividendYield: 0.005, description: 'Exportação de carne.', minLevel: 5 },
  { id: 'BRKM5', symbol: 'BRKM5', name: 'BRASKEM PREF CLASS A SA', sector: 'Materiais', type: 'STOCK', price: 18.00, volatility: 0.07, dividendYield: 0.0, description: 'Petroquímica.', minLevel: 5 },
  { id: 'PCAR3', symbol: 'PCAR3', name: 'COMPANHIA BRASILEIRA DE DISTRIBUIC', sector: 'Bens de primeira necessidade', type: 'STOCK', price: 3.00, volatility: 0.08, dividendYield: 0.0, description: 'Varejo (Pão de Açúcar).', minLevel: 5 },
  { id: 'RENT4', symbol: 'RENT4', name: 'LOCALIZA RENT A CAR PRF SA', sector: 'Bens Industriais', type: 'STOCK', price: 50.00, volatility: 0.04, dividendYield: 0.003, description: 'Localiza PN (Simulado).', minLevel: 5 },
  { id: 'VAMO3', symbol: 'VAMO3', name: 'VAMOS LOCACAO DE CAMINHOES MAQUINA', sector: 'Bens Industriais', type: 'STOCK', price: 8.00, volatility: 0.06, dividendYield: 0.002, description: 'Locação de caminhões.', minLevel: 5 },
  { id: 'CYRE4', symbol: 'CYRE4', name: 'CYRELA BRAZIL REALTY EMPREEND E PA', sector: 'Consumo discricionário', type: 'STOCK', price: 20.00, volatility: 0.06, dividendYield: 0.004, description: 'Cyrela PN (Simulado).', minLevel: 5 },
  { id: 'RAIZ4', symbol: 'RAIZ4', name: 'RAIZEN PRF SA', sector: 'Consumo discricionário', type: 'STOCK', price: 3.00, volatility: 0.05, dividendYield: 0.005, description: 'Etanol e energia.', minLevel: 5 }
];