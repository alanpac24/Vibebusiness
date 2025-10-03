import { Agent, AgentExecutionContext, AgentExecutionResult } from '@/types/agent-context';
import { supabase } from '@/integrations/supabase/client';

export const offerDesignAgent: Agent = {
  id: 'offer-design',
  name: 'Offer Design Agent',
  category: 'product',
  description: 'Designs product offerings, features, and value propositions',
  icon: '📦',
  requiredInputs: ['market-research'],
  optionalInputs: ['idea-refiner', 'persona-icp']
};

export const offerDesignSubAgents = {
  valuePropDesigner: {
    id: 'value-prop-designer',
    name: 'Value Proposition Designer',
    description: 'Creates unique value propositions for each customer segment',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea, valueProposition } = context.businessContext.companyProfile;
      const competitors = context.businessContext.marketIntelligence?.competitors || [];
      const personas = context.businessContext.agentOutputs['persona-icp']?.data || [];
      
      const prompt = `
        Design value propositions for: ${businessIdea}
        Current value prop: ${valueProposition}
        Competitors: ${JSON.stringify(competitors)}
        Customer personas: ${JSON.stringify(personas)}
        
        Create:
        1. Primary value proposition (one sentence)
        2. Supporting value props (3-5)
        3. Segment-specific value props
        4. Differentiation points vs competitors
        
        Format as structured JSON.
      `;
      
      // Placeholder for AI response
      return {
        primary: "The only platform that combines X with Y to deliver Z 10x faster",
        supporting: [
          "Save 20+ hours per week on repetitive tasks",
          "Reduce errors by 90% with AI-powered validation",
          "Scale operations without adding headcount",
          "Get insights competitors can't see"
        ],
        segmentSpecific: [
          {
            segment: "Enterprise",
            proposition: "Enterprise-grade security with consumer-grade simplicity"
          },
          {
            segment: "SMB",
            proposition: "Fortune 500 capabilities at startup prices"
          },
          {
            segment: "Startups",
            proposition: "Start free, scale seamlessly as you grow"
          }
        ],
        differentiators: [
          "Only solution with real-time collaboration",
          "Proprietary AI trained on industry data",
          "No implementation required - works instantly",
          "Transparent pricing with no hidden costs"
        ]
      };
    }
  },

  featurePrioritizer: {
    id: 'feature-prioritizer',
    name: 'Feature Prioritizer',
    description: 'Ranks features by customer value and competitive advantage',
    async execute(context: AgentExecutionContext): Promise<any> {
      const { businessIdea } = context.businessContext.companyProfile;
      const competitors = context.businessContext.marketIntelligence?.competitors || [];
      const valueProps = context.userInput?.valueProps || {};
      
      const prompt = `
        Prioritize features for: ${businessIdea}
        Value propositions: ${JSON.stringify(valueProps)}
        Competitor features: ${JSON.stringify(competitors)}
        
        Rank features by:
        1. Customer value (problem solved)
        2. Competitive advantage
        3. Implementation effort
        4. Revenue impact
        
        Categorize as: Must-have, Should-have, Nice-to-have
      `;
      
      // Placeholder for AI response
      return [
        {
          name: "AI-Powered Automation",
          category: "must-have",
          description: "Automate repetitive tasks with smart AI",
          customerValue: 10,
          competitiveAdvantage: 9,
          effort: 7,
          revenueImpact: 9,
          justification: "Core differentiator that directly addresses main pain point"
        },
        {
          name: "Real-time Collaboration",
          category: "must-have",
          description: "Multiple users working simultaneously",
          customerValue: 9,
          competitiveAdvantage: 7,
          effort: 6,
          revenueImpact: 8,
          justification: "Table stakes for modern SaaS, enables team adoption"
        },
        {
          name: "Advanced Analytics Dashboard",
          category: "should-have",
          description: "Insights and reporting capabilities",
          customerValue: 8,
          competitiveAdvantage: 6,
          effort: 5,
          revenueImpact: 7,
          justification: "Drives stickiness and justifies higher pricing tiers"
        },
        {
          name: "API & Integrations",
          category: "should-have",
          description: "Connect with other tools in the stack",
          customerValue: 7,
          competitiveAdvantage: 5,
          effort: 8,
          revenueImpact: 6,
          justification: "Reduces friction for enterprise adoption"
        },
        {
          name: "Mobile App",
          category: "nice-to-have",
          description: "iOS and Android native apps",
          customerValue: 6,
          competitiveAdvantage: 4,
          effort: 9,
          revenueImpact: 5,
          justification: "Good for engagement but not critical for MVP"
        },
        {
          name: "White Labeling",
          category: "nice-to-have",
          description: "Custom branding for enterprise",
          customerValue: 5,
          competitiveAdvantage: 6,
          effort: 4,
          revenueImpact: 7,
          justification: "Opens enterprise revenue stream but not core"
        }
      ];
    }
  },

  packageBuilder: {
    id: 'package-builder',
    name: 'Package & Tier Builder',
    description: 'Creates pricing tiers with feature allocation',
    async execute(context: AgentExecutionContext): Promise<any> {
      const features = context.userInput?.features || [];
      const valueProps = context.userInput?.valueProps || {};
      const marketData = context.businessContext.marketIntelligence;
      
      const prompt = `
        Build pricing tiers using:
        Features: ${JSON.stringify(features)}
        Value props: ${JSON.stringify(valueProps)}
        Market data: ${JSON.stringify(marketData)}
        
        Create 3-4 tiers with:
        1. Tier name and target segment
        2. Feature allocation
        3. Usage limits
        4. Support level
        5. Positioning statement
      `;
      
      // Placeholder for AI response
      return [
        {
          name: "Starter",
          targetSegment: "Individual users and small teams",
          features: [
            "AI-Powered Automation (limited)",
            "Real-time Collaboration (up to 3 users)",
            "Basic Analytics"
          ],
          limits: {
            users: 3,
            projects: 5,
            apiCalls: 1000,
            storage: "10GB"
          },
          support: "Email support",
          positioning: "Perfect for getting started and small projects"
        },
        {
          name: "Professional",
          targetSegment: "Growing teams and businesses",
          features: [
            "AI-Powered Automation (unlimited)",
            "Real-time Collaboration (up to 20 users)",
            "Advanced Analytics Dashboard",
            "API & Integrations",
            "Priority Support"
          ],
          limits: {
            users: 20,
            projects: 50,
            apiCalls: 10000,
            storage: "100GB"
          },
          support: "Priority email & chat support",
          positioning: "Everything you need to scale your business",
          highlighted: true
        },
        {
          name: "Enterprise",
          targetSegment: "Large organizations with complex needs",
          features: [
            "All Professional features",
            "White Labeling",
            "Advanced Security (SSO, SAML)",
            "Custom Integrations",
            "Dedicated Success Manager",
            "SLA Guarantee"
          ],
          limits: {
            users: "Unlimited",
            projects: "Unlimited",
            apiCalls: "Custom",
            storage: "Custom"
          },
          support: "24/7 phone, email, and dedicated Slack",
          positioning: "Enterprise-grade solution with custom everything",
          customPricing: true
        }
      ];
    }
  }
};

export async function executeOfferDesignAgent(
  context: AgentExecutionContext
): Promise<AgentExecutionResult> {
  try {
    const { businessContext } = context;
    
    // Execute sub-agents in sequence
    const valueProps = await offerDesignSubAgents.valuePropDesigner.execute(context);
    
    // Update context for next sub-agent
    const updatedContext = {
      ...context,
      userInput: {
        ...context.userInput,
        valueProps
      }
    };
    
    const features = await offerDesignSubAgents.featurePrioritizer.execute(updatedContext);
    
    // Update context again
    updatedContext.userInput = {
      ...updatedContext.userInput,
      features
    };
    
    const packages = await offerDesignSubAgents.packageBuilder.execute(updatedContext);
    
    // Compile final output
    const output = {
      agentId: offerDesignAgent.id,
      projectId: businessContext.projectId,
      timestamp: new Date().toISOString(),
      data: {
        valuePropositions: valueProps,
        features: features,
        packages: packages,
        summary: generateOfferSummary(valueProps, features, packages)
      },
      metadata: {
        tokensUsed: 2000,
        processingTime: 6000,
        confidence: 0.88
      }
    };
    
    // Save key data to product specifications
    const { error } = await supabase
      .from('product_specifications')
      .upsert({
        project_id: businessContext.projectId,
        features: features.map((f: any) => ({
          id: crypto.randomUUID(),
          name: f.name,
          description: f.description,
          priority: f.category === 'must-have' ? 'must-have' : 
                   f.category === 'should-have' ? 'nice-to-have' : 'future',
          status: 'planned'
        })),
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return {
      success: true,
      output,
      contextUpdates: {
        companyProfile: {
          ...businessContext.companyProfile,
          valueProposition: valueProps.primary
        },
        productSpecs: {
          ...businessContext.productSpecs,
          id: businessContext.productSpecs?.id || '',
          projectId: businessContext.projectId,
          features: features,
          updatedAt: new Date().toISOString()
        },
        agentOutputs: {
          ...businessContext.agentOutputs,
          [offerDesignAgent.id]: output
        }
      }
    };
  } catch (error) {
    console.error('Offer design agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateOfferSummary(valueProps: any, features: any[], packages: any[]): string {
  const mustHaveCount = features.filter(f => f.category === 'must-have').length;
  const tierCount = packages.length;
  
  return `Your offering centers on "${valueProps.primary}" with ${mustHaveCount} core features 
    that deliver immediate value. The ${tierCount}-tier structure serves ${packages[0].targetSegment} 
    through ${packages[tierCount-1].targetSegment}, with clear upgrade paths based on 
    ${valueProps.differentiators[0]?.toLowerCase()}.`;
}