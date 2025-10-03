// Core types for the connected agent system that allows data sharing between workflows

export interface CompanyProfile {
  id: string;
  projectId: string;
  businessIdea: string;
  businessName?: string;
  problemStatement?: string;
  valueProposition?: string;
  missionStatement?: string;
  brandStory?: string;
  targetMarket?: string;
  updatedAt: string;
}

export interface MarketIntelligence {
  id: string;
  projectId: string;
  marketSize?: {
    tam: number;
    sam: number;
    som: number;
    currency: string;
  };
  competitors?: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketShare?: number;
  }>;
  pricingResearch?: Array<{
    competitorName: string;
    pricingModel: string;
    tiers: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  }>;
  customerFeedback?: Array<{
    source: string;
    feedback: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    date: string;
  }>;
  updatedAt: string;
}

export interface ProductSpecifications {
  id: string;
  projectId: string;
  features?: Array<{
    id: string;
    name: string;
    description: string;
    priority: 'must-have' | 'nice-to-have' | 'future';
    status: 'planned' | 'in-progress' | 'completed';
  }>;
  techStack?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    hosting?: string[];
    tools?: string[];
  };
  architecture?: {
    type: string; // monolithic, microservices, serverless
    description: string;
    diagrams?: string[]; // URLs to architecture diagrams
  };
  roadmap?: Array<{
    milestone: string;
    deadline: string;
    features: string[];
    status: 'planned' | 'in-progress' | 'completed';
  }>;
  updatedAt: string;
}

export interface BusinessOperations {
  id: string;
  projectId: string;
  financials?: {
    projections?: {
      revenue: Array<{ month: string; amount: number }>;
      expenses: Array<{ month: string; amount: number }>;
      runway: number; // months
    };
    pricing?: {
      model: string; // subscription, one-time, usage-based
      tiers?: Array<{
        name: string;
        price: number;
        interval?: string; // monthly, yearly
      }>;
    };
  };
  team?: {
    size: number;
    roles: Array<{
      title: string;
      count: number;
      status: 'filled' | 'hiring' | 'planned';
    }>;
  };
  legal?: {
    entityType?: string; // LLC, C-Corp, etc
    incorporated?: boolean;
    jurisdiction?: string;
    complianceChecklist?: Array<{
      item: string;
      status: 'complete' | 'in-progress' | 'pending';
    }>;
  };
  metrics?: {
    kpis: Array<{
      name: string;
      value: number;
      unit: string;
      trend?: 'up' | 'down' | 'stable';
    }>;
  };
  updatedAt: string;
}

// Main context that gets passed between agents
export interface BusinessContext {
  projectId: string;
  companyProfile: CompanyProfile;
  marketIntelligence?: MarketIntelligence;
  productSpecs?: ProductSpecifications;
  businessOperations?: BusinessOperations;
  agentOutputs: Record<string, AgentOutput>; // Keyed by agent ID
}

// Individual agent types
export interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  requiredInputs: string[]; // IDs of other agents that must run first
  optionalInputs?: string[]; // IDs of agents that provide helpful context
}

export interface AgentOutput {
  agentId: string;
  projectId: string;
  timestamp: string;
  data: any; // Specific to each agent
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    confidence?: number;
  };
}

// Agent execution types
export interface AgentExecutionContext {
  agent: Agent;
  businessContext: BusinessContext;
  userInput?: any; // Additional user-provided data for this execution
}

export interface AgentExecutionResult {
  success: boolean;
  output?: AgentOutput;
  error?: string;
  contextUpdates?: Partial<BusinessContext>; // Updates to apply to the business context
}

// Helper type for tracking agent dependencies
export interface AgentDependencyGraph {
  nodes: Agent[];
  edges: Array<{
    from: string; // Agent ID
    to: string; // Agent ID
    type: 'required' | 'optional';
  }>;
}

// Project management types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Types for UI state management
export interface AgentUIState {
  projectId: string;
  completedAgents: string[]; // Agent IDs
  currentAgent?: string;
  availableAgents: string[]; // Agents that have their dependencies met
  lockedAgents: string[]; // Agents missing dependencies
}