
import { 
  GameState, 
  PlayerStrategicDirective, 
  YearEndReport, 
  AgentIdentity, 
  WargameCompanyState, 
  PaymentTransaction, 
  MarketSegment, 
  CompetitorProfile, 
  FinancialStatement,
  BalanceSheet,
  CashFlowStatement,
  ProductLine,
  ProductFeature,
  StrategyFocus,
  ProductType,
  ProgrammableToken,
  SettlementPolicy,
  ResourceAllocation
} from "../types";
import { 
  generateUUID, 
  generateRandomNumber, 
  weightedRandomPick, 
  calculateGrowthRate, 
  simulateSha256 
} from "../utils/helpers";

/** 
 * Simplified identity and payment system derived from the user provided logic.
 */
class InternalIdentityService {
  constructor(private identities: { [id: string]: AgentIdentity }) {}
  getIdentity(id: string) { return this.identities[id]; }
  signData(data: string, signingKey: string) { return simulateSha256(data + signingKey); }
  authorizeAction(agentId: string, requiredRoles: AgentIdentity['role'][]) {
    const agent = this.identities[agentId];
    return agent ? requiredRoles.includes(agent.role) : false;
  }
}

export class SimulationEngine {
  private gameState: GameState;
  private currentDirective: PlayerStrategicDirective | null = null;
  private identities: InternalIdentityService;

  constructor(initialState: GameState) {
    this.gameState = JSON.parse(JSON.stringify(initialState));
    this.identities = new InternalIdentityService(this.gameState.seededIdentities);
  }

  public setPlayerDirective(directive: PlayerStrategicDirective) {
    this.currentDirective = directive;
  }

  public getGameState() { return this.gameState; }

  public async advanceYear(): Promise<YearEndReport> {
    if (!this.currentDirective) throw new Error('No directive set.');

    const prevCompanyState = JSON.parse(JSON.stringify(this.gameState.playerCompany));
    const currentYear = this.gameState.currentYear + 1;

    // 1. Audit Entry
    this.recordAuditLog(this.gameState.playerCompany.identityId, 'SetStrategicDirective', { directive: this.currentDirective });

    // 2. Apply Strategy & Financials (MOCKED FOR SIMPLICITY BUT FOLLOWING LOGIC)
    this.applySimulationLogic(currentYear);

    // 3. Increment State
    this.gameState.currentYear++;
    this.gameState.globalMarketSentiment = generateRandomNumber(
      Math.max(20, this.gameState.globalMarketSentiment - 15),
      Math.min(95, this.gameState.globalMarketSentiment + 15)
    );

    // 4. Generate Report
    const report = this.generateYearEndReport(prevCompanyState);
    this.gameState.historicalReports.push(report);

    this.currentDirective = null;
    return report;
  }

  private applySimulationLogic(year: number) {
    const company = this.gameState.playerCompany;
    const directive = this.currentDirective!;

    // Resource allocation impacts
    company.strategicFocus = directive.overallFocus;
    
    // Simulate some cash spend
    const spend = company.cash * 0.15;
    company.cash -= spend;
    
    // Product Growth
    company.productLines.forEach(p => {
        const growth = generateRandomNumber(0.01, 0.15, 4);
        p.customerCount = Math.round(p.customerCount * (1 + growth));
        p.revenue = p.customerCount * p.basePrice;
        p.profit = p.revenue * generateRandomNumber(0.1, 0.25, 4);
        p.innovationLevel = Math.min(100, p.innovationLevel + (directive.resourceAllocation.rd / 10));
    });

    // Market Share update
    const totalNewRev = company.productLines.reduce((s, p) => s + p.revenue, 0);
    company.revenue = totalNewRev;
    company.profit = totalNewRev * generateRandomNumber(0.05, 0.15, 4);
    company.marketShare = Math.min(100, company.marketShare + generateRandomNumber(-1, 2, 2));

    // Competitor reactions
    this.gameState.competitors.forEach(c => {
        c.marketShare = Math.max(1, c.marketShare + generateRandomNumber(-1, 1, 2));
    });
  }

  private recordAuditLog(agentId: string, action: string, details: any) {
    const agent = this.identities.getIdentity(agentId);
    if (!agent) return;
    this.gameState.auditLog.push({
      id: generateUUID(),
      timestamp: Date.now(),
      agentId,
      agentName: agent.name,
      action,
      details,
      signature: this.identities.signData(JSON.stringify(details), agent.signingKey)
    });
  }

  private generateYearEndReport(prev: WargameCompanyState): YearEndReport {
    const curr = this.gameState.playerCompany;
    const mktGrowth = calculateGrowthRate(curr.marketShare, prev.marketShare);
    const revGrowth = calculateGrowthRate(curr.revenue, prev.revenue);

    return {
      year: this.gameState.currentYear,
      companyState: JSON.parse(JSON.stringify(curr)),
      competitorActions: ["FinFuture Inc. launched aggressive marketing.", "Innovatech Solutions filed new AI patents."],
      marketNewsEvents: ["Global Economic Boom announced."],
      playerDecisionsSummary: this.currentDirective!,
      kpis: {
        marketShareGrowth: mktGrowth,
        revenueGrowth: revGrowth,
        profitMargin: (curr.profit / curr.revenue) * 100,
        customerAcquisitionCost: 15.5,
        customerRetentionRate: 88,
        innovationIndex: 72,
        employeeMorale: 65,
      },
      keyInsights: [
        mktGrowth > 0 ? "Strong market positioning." : "Market share dilution detected.",
        curr.cash > 1000000 ? "Capital reserves are healthy." : "Warning: Liquidity constraints."
      ],
      recommendations: ["Consider increasing R&D spend to maintain edge.", "Target SMB segment for expansion."]
    };
  }
}

// Data generators for initial state
export const getInitialGameState = (): GameState => {
  const identities: { [id: string]: AgentIdentity } = {
    'p_nexus': { id: 'p_nexus', name: 'Nexus Innovations', role: 'Player', publicKey: 'pub_nexus', signingKey: 'sec_nexus', createdAt: Date.now() },
    'c_fin': { id: 'c_fin', name: 'FinFuture Inc.', role: 'Competitor', publicKey: 'pub_fin', signingKey: 'sec_fin', createdAt: Date.now() },
    's_sys': { id: 's_sys', name: 'System Core', role: 'System', publicKey: 'pub_sys', signingKey: 'sec_sys', createdAt: Date.now() }
  };

  return {
    currentYear: 2024,
    playerCompany: {
      id: 'nexus',
      name: 'Nexus Innovations',
      yearEstablished: 2024,
      cash: 5000000,
      tokenBalances: { 'NXG': 0 },
      marketShare: 7,
      revenue: 2000000,
      profit: 100000,
      employeeCount: 150,
      rdBudget: 200000,
      marketingBudget: 300000,
      salesBudget: 150000,
      operationsBudget: 100000,
      hrBudget: 200000,
      customerServiceBudget: 50000,
      capitalInvestmentBudget: 0,
      brandReputation: 65,
      customerSatisfaction: 70,
      productLines: [{
        id: 'p1', name: 'Nexus App', type: ProductType.FINTECH_APP,
        baseCost: 5, basePrice: 15, marketShare: 5, customerCount: 100000,
        revenue: 1500000, profit: 750000, features: [], innovationLevel: 55,
        qualityScore: 70, lifecycleStage: 'growth', targetMarketSegmentIds: ['s1']
      }],
      strategicFocus: StrategyFocus.INNOVATION,
      financials: {
        incomeStatement: { revenue: 2000000, cogs: 800000, grossProfit: 1200000, rdExpenses: 200000, marketingExpenses: 300000, salesExpenses: 150000, operationsExpenses: 100000, hrExpenses: 200000, customerServiceExpenses: 50000, depreciation: 50000, operatingProfit: 150000, interestExpenses: 20000, taxes: 30000, netProfit: 100000 },
        balanceSheet: { cash: 5000000, accountsReceivable: 100000, inventory: 0, fixedAssets: 1000000, digitalAssets: 0, totalAssets: 6100000, accountsPayable: 50000, shortTermDebt: 200000, longTermDebt: 1000000, totalLiabilities: 1250000, equity: 4850000, totalLiabilitiesAndEquity: 6100000 },
        cashFlowStatement: { operatingActivities: 100000, investingActivities: -50000, financingActivities: 0, netChangeInCash: 50000, beginningCash: 4950000, endingCash: 5000000 }
      },
      identityId: 'p_nexus'
    },
    competitors: [{
      id: 'comp1', name: 'FinFuture Inc.', description: 'Established giant.',
      marketShare: 35, financialStrength: 85, innovationFocus: 60, marketingAggression: 90,
      strategy: 'market_capture', productOfferings: [], recentActions: [], identityId: 'c_fin'
    }],
    marketSegments: [{
      id: 's1', name: 'Consumer Mass', totalSize: 50000000, growthRate: [0.03, 0.07],
      sensitivityToPrice: 0.7, sensitivityToInnovation: 0.3, currentPlayerPenetration: 0.05,
      competitorPenetration: { 'comp1': 0.30 }, customerLoyalty: 60
    }],
    historicalReports: [],
    globalMarketSentiment: 65,
    auditLog: [],
    seededIdentities: identities,
    agentMessages: [],
    programmableTokens: [],
    settlementPolicies: []
  };
};
