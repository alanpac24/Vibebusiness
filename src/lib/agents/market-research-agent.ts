import { Agent, AgentExecutionContext, AgentExecutionResult } from '@/types/agent-context';
import { supabase } from '@/integrations/supabase/client';

export const marketResearchAgent: Agent = {
  id: 'market-research',
  name: 'Market Research Agent',
  category: 'market',
  description: 'Analyzes market size, competitors, and industry trends',
  icon: '📊',
  requiredInputs: ['idea-refiner'],
  optionalInputs: ['persona-icp']
};

export const marketResearchSubAgents = {
  marketSizer: {
    id: 'market-sizer',
    name: 'Market Size Analyzer',
    description: 'Calculates TAM, SAM, and SOM for your business',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea, targetMarket } = context.businessContext.companyProfile;
      
      // This would call an AI model to analyze market size
      const prompt = `
        Analyze the market size for the following business:
        Business Idea: ${businessIdea}
        Target Market: ${targetMarket}
        
        Provide:
        1. TAM (Total Addressable Market) in USD
        2. SAM (Serviceable Addressable Market) in USD
        3. SOM (Serviceable Obtainable Market) in USD
        4. Market growth rate
        5. Key market drivers
        
        Format as JSON with reasoning for each calculation.
      `;
      
      // Placeholder for AI response
      return {
        tam: 5000000000,
        sam: 500000000,
        som: 50000000,
        currency: 'USD',
        growthRate: 0.23,
        reasoning: {
          tam: 'Based on global market for similar solutions',
          sam: 'Focused on English-speaking markets initially',
          som: 'Realistic 10% market capture in first 3 years'
        },
        drivers: [
          'Digital transformation acceleration',
          'Remote work adoption',
          'Increasing demand for automation'
        ]
      };
    }
  },

  competitorAnalyzer: {
    id: 'competitor-analyzer',
    name: 'Competitor Scanner',
    description: 'Identifies and analyzes key competitors',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea } = context.businessContext.companyProfile;
      const marketSize = context.businessContext.marketIntelligence?.marketSize;
      
      const prompt = `
        Find and analyze competitors for: ${businessIdea}
        Market context: ${JSON.stringify(marketSize)}
        
        Identify:
        1. Direct competitors (3-5)
        2. Indirect competitors (2-3)
        3. For each: strengths, weaknesses, pricing, market share
        4. Competitive positioning opportunities
      `;
      
      // Placeholder for AI response
      return [
        {
          name: 'CompetitorA',
          type: 'direct',
          strengths: ['Market leader', 'Strong brand', 'Enterprise features'],
          weaknesses: ['Expensive', 'Complex UI', 'Poor customer support'],
          marketShare: 0.35,
          pricing: '$99-999/mo',
          positioning: 'Enterprise-focused'
        },
        {
          name: 'CompetitorB',
          type: 'direct',
          strengths: ['User-friendly', 'Good pricing', 'Strong community'],
          weaknesses: ['Limited features', 'Performance issues', 'No enterprise'],
          marketShare: 0.20,
          pricing: '$29-199/mo',
          positioning: 'SMB-focused'
        },
        {
          name: 'CompetitorC',
          type: 'indirect',
          strengths: ['Free tier', 'Developer-friendly', 'Open source'],
          weaknesses: ['Requires technical knowledge', 'Limited support'],
          marketShare: 0.10,
          pricing: '$0-49/mo',
          positioning: 'Developer tools'
        }
      ];
    }
  },

  trendSpotter: {
    id: 'trend-spotter',
    name: 'Industry Trend Researcher',
    description: 'Identifies market trends and opportunities',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea } = context.businessContext.companyProfile;
      const competitors = context.businessContext.marketIntelligence?.competitors;
      
      const prompt = `
        Analyze industry trends for: ${businessIdea}
        Competitive landscape: ${JSON.stringify(competitors)}
        
        Identify:
        1. Current market trends
        2. Emerging technologies
        3. Customer behavior shifts
        4. Regulatory changes
        5. Opportunities and threats
      `;
      
      // Placeholder for AI response
      return [
        {
          trend: 'AI-powered automation',
          impact: 'high',
          timeframe: '1-2 years',
          opportunity: 'Integrate AI features to differentiate'
        },
        {
          trend: 'Privacy-first solutions',
          impact: 'medium',
          timeframe: '2-3 years',
          opportunity: 'Build trust with data privacy features'
        },
        {
          trend: 'Vertical SaaS specialization',
          impact: 'high',
          timeframe: 'ongoing',
          opportunity: 'Focus on specific industry needs'
        },
        {
          trend: 'Usage-based pricing adoption',
          impact: 'medium',
          timeframe: '1-2 years',
          opportunity: 'Flexible pricing models'
        }
      ];
    }
  }
};

export async function executeMarketResearchAgent(
  context: AgentExecutionContext
): Promise<AgentExecutionResult> {
  try {
    const { businessContext } = context;
    
    // Execute sub-agents in sequence
    const marketSizeData = await marketResearchSubAgents.marketSizer.execute(context);
    
    // Update context with market size data for next sub-agent
    const updatedContext = {
      ...context,
      businessContext: {
        ...businessContext,
        marketIntelligence: {
          ...businessContext.marketIntelligence,
          id: businessContext.marketIntelligence?.id || '',
          projectId: businessContext.projectId,
          marketSize: marketSizeData,
          updatedAt: new Date().toISOString()
        }
      }
    };
    
    const competitorData = await marketResearchSubAgents.competitorAnalyzer.execute(updatedContext);
    
    // Update context again with competitor data
    updatedContext.businessContext.marketIntelligence = {
      ...updatedContext.businessContext.marketIntelligence,
      competitors: competitorData
    };
    
    const trendData = await marketResearchSubAgents.trendSpotter.execute(updatedContext);
    
    // Compile final output
    const output = {
      agentId: marketResearchAgent.id,
      projectId: businessContext.projectId,
      timestamp: new Date().toISOString(),
      data: {
        marketSize: marketSizeData,
        competitors: competitorData,
        trends: trendData,
        summary: generateMarketSummary(marketSizeData, competitorData, trendData)
      },
      metadata: {
        tokensUsed: 1500, // Placeholder
        processingTime: 5000, // Placeholder
        confidence: 0.85
      }
    };
    
    // Save to database
    const { error } = await supabase
      .from('market_intelligence')
      .upsert({
        project_id: businessContext.projectId,
        market_size: marketSizeData,
        competitors: competitorData,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return {
      success: true,
      output,
      contextUpdates: {
        marketIntelligence: updatedContext.businessContext.marketIntelligence,
        agentOutputs: {
          ...businessContext.agentOutputs,
          [marketResearchAgent.id]: output
        }
      }
    };
  } catch (error) {
    console.error('Market research agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateMarketSummary(marketSize: any, competitors: any[], trends: any[]): string {
  const topCompetitor = competitors.find(c => c.type === 'direct');
  const biggestTrend = trends.find(t => t.impact === 'high');
  
  return `The market opportunity is substantial with a TAM of $${(marketSize.tam / 1000000000).toFixed(1)}B 
    and ${marketSize.growthRate * 100}% annual growth. ${topCompetitor?.name} leads the market with 
    ${topCompetitor?.marketShare * 100}% share but has weaknesses in ${topCompetitor?.weaknesses[0]?.toLowerCase()}. 
    The biggest trend is ${biggestTrend?.trend} creating opportunities for ${biggestTrend?.opportunity}.`;
}