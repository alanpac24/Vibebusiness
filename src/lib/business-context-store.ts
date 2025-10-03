import { supabase } from '@/integrations/supabase/client';
import { 
  BusinessContext, 
  CompanyProfile, 
  MarketIntelligence, 
  ProductSpecifications, 
  BusinessOperations, 
  AgentOutput,
  Project 
} from '@/types/agent-context';

export class BusinessContextStore {
  private projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  // Load complete business context for a project
  async loadContext(): Promise<BusinessContext | null> {
    try {
      // Load all context data in parallel
      const [
        { data: project },
        { data: companyProfile },
        { data: marketIntelligence },
        { data: productSpecs },
        { data: businessOps },
        { data: agentOutputs }
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('id', this.projectId).single(),
        supabase.from('company_profiles').select('*').eq('project_id', this.projectId).single(),
        supabase.from('market_intelligence').select('*').eq('project_id', this.projectId).single(),
        supabase.from('product_specifications').select('*').eq('project_id', this.projectId).single(),
        supabase.from('business_operations').select('*').eq('project_id', this.projectId).single(),
        supabase.from('agent_outputs').select('*').eq('project_id', this.projectId)
      ]);

      if (!project || !companyProfile) {
        return null;
      }

      // Transform agent outputs into a keyed object
      const agentOutputsMap: Record<string, AgentOutput> = {};
      if (agentOutputs) {
        agentOutputs.forEach(output => {
          agentOutputsMap[output.agent_id] = {
            agentId: output.agent_id,
            projectId: output.project_id,
            timestamp: output.created_at,
            data: output.data,
            metadata: output.metadata
          };
        });
      }

      return {
        projectId: this.projectId,
        companyProfile: this.transformCompanyProfile(companyProfile),
        marketIntelligence: marketIntelligence ? this.transformMarketIntelligence(marketIntelligence) : undefined,
        productSpecs: productSpecs ? this.transformProductSpecs(productSpecs) : undefined,
        businessOperations: businessOps ? this.transformBusinessOps(businessOps) : undefined,
        agentOutputs: agentOutputsMap
      };
    } catch (error) {
      console.error('Error loading business context:', error);
      return null;
    }
  }

  // Save or update company profile
  async saveCompanyProfile(profile: Partial<CompanyProfile>): Promise<void> {
    const { error } = await supabase
      .from('company_profiles')
      .upsert({
        project_id: this.projectId,
        business_idea: profile.businessIdea,
        business_name: profile.businessName,
        problem_statement: profile.problemStatement,
        value_proposition: profile.valueProposition,
        mission_statement: profile.missionStatement,
        brand_story: profile.brandStory,
        target_market: profile.targetMarket,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      });

    if (error) throw error;
  }

  // Save agent output
  async saveAgentOutput(output: AgentOutput): Promise<void> {
    const { error } = await supabase
      .from('agent_outputs')
      .upsert({
        agent_id: output.agentId,
        project_id: this.projectId,
        data: output.data,
        metadata: output.metadata,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'project_id,agent_id'
      });

    if (error) throw error;
  }

  // Update market intelligence
  async updateMarketIntelligence(data: Partial<MarketIntelligence>): Promise<void> {
    const { error } = await supabase
      .from('market_intelligence')
      .upsert({
        project_id: this.projectId,
        market_size: data.marketSize,
        competitors: data.competitors,
        pricing_research: data.pricingResearch,
        customer_feedback: data.customerFeedback,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      });

    if (error) throw error;
  }

  // Update product specifications
  async updateProductSpecs(data: Partial<ProductSpecifications>): Promise<void> {
    const { error } = await supabase
      .from('product_specifications')
      .upsert({
        project_id: this.projectId,
        features: data.features,
        tech_stack: data.techStack,
        architecture: data.architecture,
        roadmap: data.roadmap,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      });

    if (error) throw error;
  }

  // Update business operations
  async updateBusinessOperations(data: Partial<BusinessOperations>): Promise<void> {
    const { error } = await supabase
      .from('business_operations')
      .upsert({
        project_id: this.projectId,
        financials: data.financials,
        team: data.team,
        legal: data.legal,
        metrics: data.metrics,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      });

    if (error) throw error;
  }

  // Check which agents have completed for this project
  async getCompletedAgents(): Promise<string[]> {
    const { data, error } = await supabase
      .from('agent_outputs')
      .select('agent_id')
      .eq('project_id', this.projectId);

    if (error) throw error;
    return data?.map(row => row.agent_id) || [];
  }

  // Private transformation methods to convert DB rows to typed objects
  private transformCompanyProfile(data: any): CompanyProfile {
    return {
      id: data.id,
      projectId: data.project_id,
      businessIdea: data.business_idea,
      businessName: data.business_name,
      problemStatement: data.problem_statement,
      valueProposition: data.value_proposition,
      missionStatement: data.mission_statement,
      brandStory: data.brand_story,
      targetMarket: data.target_market,
      updatedAt: data.updated_at
    };
  }

  private transformMarketIntelligence(data: any): MarketIntelligence {
    return {
      id: data.id,
      projectId: data.project_id,
      marketSize: data.market_size,
      competitors: data.competitors,
      pricingResearch: data.pricing_research,
      customerFeedback: data.customer_feedback,
      updatedAt: data.updated_at
    };
  }

  private transformProductSpecs(data: any): ProductSpecifications {
    return {
      id: data.id,
      projectId: data.project_id,
      features: data.features,
      techStack: data.tech_stack,
      architecture: data.architecture,
      roadmap: data.roadmap,
      updatedAt: data.updated_at
    };
  }

  private transformBusinessOps(data: any): BusinessOperations {
    return {
      id: data.id,
      projectId: data.project_id,
      financials: data.financials,
      team: data.team,
      legal: data.legal,
      metrics: data.metrics,
      updatedAt: data.updated_at
    };
  }
}

// Utility functions for working with business context

export async function createProject(userId: string, name: string, description?: string): Promise<string> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name,
      description,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) throw error;
  
  // Initialize empty company profile for the project
  await supabase.from('company_profiles').insert({
    project_id: data.id,
    business_idea: '',
    updated_at: new Date().toISOString()
  });

  return data.id;
}

export async function getActiveProject(userId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}