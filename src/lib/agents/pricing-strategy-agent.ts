import { Agent, AgentExecutionContext, AgentExecutionResult } from '@/types/agent-context';
import { supabase } from '@/integrations/supabase/client';

export const pricingStrategyAgent: Agent = {
  id: 'pricing-strategy',
  name: 'Pricing Strategy Agent',
  category: 'market',
  description: 'Optimizes pricing model and price points for maximum revenue',
  icon: '💰',
  requiredInputs: ['market-research', 'offer-design'],
  optionalInputs: ['financials']
};

export const pricingStrategySubAgents = {
  modelSelector: {
    id: 'pricing-model-selector',
    name: 'Pricing Model Selector',
    description: 'Recommends the best pricing model for your business',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea } = context.businessContext.companyProfile;
      const marketData = context.businessContext.marketIntelligence;
      const packages = context.businessContext.agentOutputs['offer-design']?.data?.packages || [];
      
      const prompt = `
        Select optimal pricing model for: ${businessIdea}
        Market data: ${JSON.stringify(marketData)}
        Product packages: ${JSON.stringify(packages)}
        
        Analyze:
        1. Best pricing model (subscription, usage-based, tiered, hybrid)
        2. Billing frequency recommendations
        3. Free trial/freemium strategy
        4. Contract terms (monthly, annual, multi-year)
        5. Rationale for each recommendation
      `;
      
      // Placeholder for AI response
      return {
        model: {
          type: 'tiered-subscription',
          description: 'Monthly/annual subscription with feature-based tiers',
          rationale: 'Predictable revenue, clear upgrade path, industry standard'
        },
        billing: {
          frequencies: ['monthly', 'annual'],
          preferred: 'annual',
          annualDiscount: 0.20,
          rationale: 'Annual billing improves cash flow and reduces churn'
        },
        trial: {
          type: 'free-trial',
          duration: 14,
          creditCardRequired: false,
          limitations: 'Full access to Professional tier features',
          conversionRate: 0.15,
          rationale: 'Low-friction entry increases signups, 14 days optimal for B2B'
        },
        contracts: {
          minimum: 'none',
          enterprise: 'annual',
          customTerms: true,
          rationale: 'Flexibility for SMB, commitment for enterprise'
        }
      };
    }
  },

  priceOptimizer: {
    id: 'price-optimizer',
    name: 'Price Point Optimizer',
    description: 'Calculates optimal price points for each tier',
    async execute(context: AgentExecutionContext): Promise<any> {
      const marketData = context.businessContext.marketIntelligence;
      const packages = context.businessContext.agentOutputs['offer-design']?.data?.packages || [];
      const model = context.userInput?.pricingModel || {};
      
      const prompt = `
        Optimize pricing for packages: ${JSON.stringify(packages)}
        Pricing model: ${JSON.stringify(model)}
        Competitor pricing: ${JSON.stringify(marketData?.competitors)}
        
        Calculate:
        1. Optimal price points per tier
        2. Price anchoring strategy
        3. Psychological pricing tactics
        4. Volume/enterprise discounts
        5. Revenue projections
      `;
      
      // Placeholder for AI response
      return {
        tiers: [
          {
            name: 'Starter',
            monthlyPrice: 49,
            annualPrice: 39,
            setupFee: 0,
            rationale: 'Below psychological $50 threshold, competitive with low-end alternatives'
          },
          {
            name: 'Professional',
            monthlyPrice: 149,
            annualPrice: 119,
            setupFee: 0,
            highlighted: true,
            rationale: '3x starter price creates strong anchor, sweet spot for target market'
          },
          {
            name: 'Enterprise',
            monthlyPrice: 499,
            annualPrice: 399,
            customPricing: 'Available for 100+ users',
            setupFee: 2500,
            rationale: 'Premium pricing for premium service, setup fee filters serious buyers'
          }
        ],
        discounts: {
          volume: [
            { users: '50-99', discount: 0.10 },
            { users: '100-499', discount: 0.20 },
            { users: '500+', discount: 'custom' }
          ],
          nonprofit: 0.30,
          education: 0.50,
          startup: 0.25
        },
        psychology: {
          anchor: 'Show Enterprise price first to make Professional seem affordable',
          charm: 'All prices end in 9 for psychological appeal',
          bundling: 'Annual billing presented as "save 2 months free"'
        }
      };
    }
  },

  elasticityAnalyzer: {
    id: 'elasticity-analyzer',
    name: 'Price Elasticity Analyzer',
    description: 'Tests price sensitivity and revenue optimization',
    async execute(context: AgentExecutionContext): Promise<any> {
      const pricing = context.userInput?.pricing || {};
      const marketSize = context.businessContext.marketIntelligence?.marketSize;
      
      const prompt = `
        Analyze price elasticity for: ${JSON.stringify(pricing)}
        Market size: ${JSON.stringify(marketSize)}
        
        Model:
        1. Price sensitivity by segment
        2. Revenue curves at different price points
        3. Competitive response scenarios
        4. Optimal price for growth vs profit
        5. A/B testing recommendations
      `;
      
      // Placeholder for AI response
      return {
        elasticity: {
          starter: {
            coefficient: -1.2,
            interpretation: 'Somewhat elastic - 10% price increase = 12% demand decrease',
            sweetSpot: { min: 39, max: 59, optimal: 49 }
          },
          professional: {
            coefficient: -0.8,
            interpretation: 'Relatively inelastic - quality matters more than price',
            sweetSpot: { min: 99, max: 199, optimal: 149 }
          },
          enterprise: {
            coefficient: -0.4,
            interpretation: 'Highly inelastic - decision based on features not price',
            sweetSpot: { min: 299, max: 999, optimal: 499 }
          }
        },
        scenarios: [
          {
            name: 'Growth Maximization',
            pricing: { starter: 29, professional: 99, enterprise: 399 },
            projection: { users: 10000, revenue: 890000, profit: 445000 }
          },
          {
            name: 'Revenue Optimization',
            pricing: { starter: 49, professional: 149, enterprise: 499 },
            projection: { users: 6000, revenue: 1074000, profit: 644000 }
          },
          {
            name: 'Premium Positioning',
            pricing: { starter: 79, professional: 249, enterprise: 799 },
            projection: { users: 3000, revenue: 897000, profit: 628000 }
          }
        ],
        testing: {
          recommendation: 'A/B test Professional tier at $129 vs $149',
          duration: '30 days',
          sampleSize: 1000,
          metrics: ['conversion rate', 'revenue per visitor', 'churn rate']
        }
      };
    }
  }
};

export async function executePricingStrategyAgent(
  context: AgentExecutionContext
): Promise<AgentExecutionResult> {
  try {
    const { businessContext } = context;
    
    // Execute sub-agents in sequence
    const pricingModel = await pricingStrategySubAgents.modelSelector.execute(context);
    
    // Update context for next sub-agent
    const updatedContext = {
      ...context,
      userInput: {
        ...context.userInput,
        pricingModel
      }
    };
    
    const pricing = await pricingStrategySubAgents.priceOptimizer.execute(updatedContext);
    
    // Update context again
    updatedContext.userInput = {
      ...updatedContext.userInput,
      pricing
    };
    
    const elasticity = await pricingStrategySubAgents.elasticityAnalyzer.execute(updatedContext);
    
    // Compile final output
    const output = {
      agentId: pricingStrategyAgent.id,
      projectId: businessContext.projectId,
      timestamp: new Date().toISOString(),
      data: {
        model: pricingModel,
        pricing: pricing,
        elasticity: elasticity,
        summary: generatePricingSummary(pricingModel, pricing, elasticity)
      },
      metadata: {
        tokensUsed: 1800,
        processingTime: 5500,
        confidence: 0.87
      }
    };
    
    // Save to business operations
    const { error } = await supabase
      .from('business_operations')
      .upsert({
        project_id: businessContext.projectId,
        financials: {
          pricing: {
            model: pricingModel.model.type,
            tiers: pricing.tiers.map((tier: any) => ({
              name: tier.name,
              price: tier.monthlyPrice,
              interval: 'monthly'
            }))
          }
        },
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return {
      success: true,
      output,
      contextUpdates: {
        businessOperations: {
          ...businessContext.businessOperations,
          id: businessContext.businessOperations?.id || '',
          projectId: businessContext.projectId,
          financials: {
            ...businessContext.businessOperations?.financials,
            pricing: {
              model: pricingModel.model.type,
              tiers: pricing.tiers
            }
          },
          updatedAt: new Date().toISOString()
        },
        agentOutputs: {
          ...businessContext.agentOutputs,
          [pricingStrategyAgent.id]: output
        }
      }
    };
  } catch (error) {
    console.error('Pricing strategy agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generatePricingSummary(model: any, pricing: any, elasticity: any): string {
  const optimalScenario = elasticity.scenarios.find((s: any) => s.name === 'Revenue Optimization');
  const recommendedTier = pricing.tiers.find((t: any) => t.highlighted);
  
  return `Recommended ${model.model.type} pricing with ${model.trial.duration}-day free trial. 
    The ${recommendedTier?.name} tier at $${recommendedTier?.monthlyPrice}/mo serves as the anchor, 
    targeting ${optimalScenario?.projection.users.toLocaleString()} users for 
    $${(optimalScenario?.projection.revenue / 12).toFixed(0)}/mo in recurring revenue. 
    ${model.billing.preferred} billing with ${(model.billing.annualDiscount * 100)}% discount maximizes LTV.`;
}