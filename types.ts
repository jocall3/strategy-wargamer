
export type ValueRange = [number, number];

export enum StrategyFocus {
  INNOVATION = 'innovation',
  COST_REDUCTION = 'cost_reduction',
  MARKET_EXPANSION = 'market_expansion',
  CUSTOMER_RETENTION = 'customer_retention',
  RISK_MANAGEMENT = 'risk_management',
  DIGITAL_ASSET_FOCUS = 'digital_asset_focus'
}

export enum ProductType {
  AI_PLATFORM = 'AI_Platform',
  FINTECH_APP = 'FinTech_App',
  DATA_ANALYTICS = 'Data_Analytics',
  CONSULTING_SERVICE = 'Consulting_Service',
  TOKENIZED_ASSET_SERVICE = 'Tokenized_Asset_Service'
}

export interface ResourceAllocation {
  rd: number;
  marketing: number;
  sales: number;
  operations: number;
  hr: number;
  customerService: number;
  capitalInvestment: number;
}

export interface ProductFeature {
  id: string;
  name: string;
  developmentCost: number;
  developmentTimeYears: number;
  marketImpact: ValueRange;
  customerSatisfactionBoost: ValueRange;
  innovationScore: number;
  status: 'planned' | 'developing' | 'launched' | 'obsolete';
  launchYear?: number;
}

export interface ProductLine {
  id: string;
  name: string;
  type: ProductType;
  baseCost: number;
  basePrice: number;
  marketShare: number;
  customerCount: number;
  revenue: number;
  profit: number;
  features: ProductFeature[];
  innovationLevel: number;
  qualityScore: number;
  lifecycleStage: 'introduction' | 'growth' | 'maturity' | 'decline';
  targetMarketSegmentIds: string[];
}

export interface MarketSegment {
  id: string;
  name: string;
  totalSize: number;
  growthRate: ValueRange;
  sensitivityToPrice: number;
  sensitivityToInnovation: number;
  currentPlayerPenetration: number;
  competitorPenetration: { [competitorId: string]: number };
  customerLoyalty: number;
}

export interface CompetitorProfile {
  id: string;
  name: string;
  description: string;
  marketShare: number;
  financialStrength: number;
  innovationFocus: number;
  marketingAggression: number;
  strategy: 'innovate' | 'cost_leadership' | 'market_capture' | 'niche_focus' | 'adapt_to_player' | 'disruptive_innovation';
  productOfferings: { id: string; name: string; type: ProductType }[];
  recentActions: string[];
  identityId: string;
}

export interface PlayerStrategicDirective {
  overallFocus: StrategyFocus;
  resourceAllocation: ResourceAllocation;
  newProductDevelopment: {
    name: string;
    type: ProductType;
    targetMarketSegmentIds: string[];
    featuresToDevelop: string[];
  }[];
  marketingCampaigns: {
    name: string;
    targetSegmentIds: string[];
    budget: number;
    message: string;
  }[];
  pricingAdjustments: {
    productId: string;
    newPrice: number;
  }[];
  hrInitiatives: 'training' | 'hiring' | 'downsizing' | 'none';
  riskMitigation: string[];
  targetAcquisitions: string[];
  divestProductLines: string[];
  tokenRailOptimization: {
    preferredRailType: 'fast' | 'batch' | 'internal';
    maxLatencyTolerance: number;
    maxFeePercentage: number;
  } | null;
}

export interface FinancialStatement {
  revenue: number;
  cogs: number;
  grossProfit: number;
  rdExpenses: number;
  marketingExpenses: number;
  salesExpenses: number;
  operationsExpenses: number;
  hrExpenses: number;
  customerServiceExpenses: number;
  depreciation: number;
  operatingProfit: number;
  interestExpenses: number;
  taxes: number;
  netProfit: number;
}

export interface BalanceSheet {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  fixedAssets: number;
  digitalAssets: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalLiabilities: number;
  equity: number;
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;
}

export interface WargameCompanyState {
  id: string;
  name: string;
  yearEstablished: number;
  cash: number;
  tokenBalances: { [tokenId: string]: number };
  marketShare: number;
  revenue: number;
  profit: number;
  employeeCount: number;
  rdBudget: number;
  marketingBudget: number;
  salesBudget: number;
  operationsBudget: number;
  hrBudget: number;
  customerServiceBudget: number;
  capitalInvestmentBudget: number;
  brandReputation: number;
  customerSatisfaction: number;
  productLines: ProductLine[];
  strategicFocus: StrategyFocus;
  financials: {
    incomeStatement: FinancialStatement;
    balanceSheet: BalanceSheet;
    cashFlowStatement: CashFlowStatement;
  };
  identityId: string;
}

export interface YearEndReport {
  year: number;
  companyState: WargameCompanyState;
  competitorActions: string[];
  marketNewsEvents: string[];
  playerDecisionsSummary: PlayerStrategicDirective;
  kpis: {
    marketShareGrowth: number;
    revenueGrowth: number;
    profitMargin: number;
    customerAcquisitionCost: number;
    customerRetentionRate: number;
    innovationIndex: number;
    employeeMorale: number;
    transactionEfficiencyScore?: number;
    digitalAssetExposure?: number;
  };
  keyInsights: string[];
  recommendations: string[];
}

export interface AgentIdentity {
  id: string;
  name: string;
  role: 'Player' | 'Competitor' | 'System' | 'Auditor' | 'Regulator';
  publicKey: string;
  signingKey: string;
  createdAt: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  agentId: string;
  agentName: string;
  action: string;
  details: any;
  signature: string;
  previousEntryHash?: string;
}

export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  payload: any;
  timestamp: number;
  signature: string;
  nonce: number;
}

export interface PaymentTransaction {
  id: string;
  idempotencyKey: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
  tokenId?: string;
  type: 'budget_allocation' | 'product_sale' | 'acquisition' | 'divestment' | 'payroll' | 'marketing_spend' | 'token_mint' | 'token_burn' | 'token_transfer';
  railUsed: 'rail_fast' | 'rail_batch' | 'internal_ledger' | 'programmable_token_rail';
  processingFee: number;
  settlementTime: number;
  riskScore: number;
  status: 'pending' | 'settled' | 'failed' | 'flagged';
  timestamp: number;
  signature: string;
}

export interface ProgrammableToken {
  id: string;
  name: string;
  symbol: string;
  supply: number;
  maxSupply: number | null;
  issuerId: string;
  properties: {
    transferable: boolean;
    divisible: boolean;
    fungible: boolean;
    programmableRulesId?: string;
  };
  createdAt: number;
}

export interface SettlementPolicy {
  id: string;
  name: string;
  maxAmount?: number;
  minAmount?: number;
  allowedRailTypes?: PaymentTransaction['railUsed'][];
  allowedSenderRoles?: AgentIdentity['role'][];
  allowedReceiverRoles?: AgentIdentity['role'][];
  transferRestrictions?: {
    senderRoles?: string[];
    receiverRoles?: string[];
  };
  mintingAuthority?: string;
  burningAuthority?: string;
}

export interface GameState {
  currentYear: number;
  playerCompany: WargameCompanyState;
  competitors: CompetitorProfile[];
  marketSegments: MarketSegment[];
  historicalReports: YearEndReport[];
  globalMarketSentiment: number;
  auditLog: AuditLogEntry[];
  seededIdentities: { [id: string]: AgentIdentity };
  agentMessages: AgentMessage[];
  programmableTokens: ProgrammableToken[];
  settlementPolicies: SettlementPolicy[];
}
