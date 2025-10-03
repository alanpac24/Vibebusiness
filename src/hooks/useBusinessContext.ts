import { useState, useEffect } from 'react';
import { BusinessContext, Project, Agent, AgentUIState } from '@/types/agent-context';
import { BusinessContextStore, getActiveProject, createProject } from '@/lib/business-context-store';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define all available agents and their dependencies
export const AGENTS: Agent[] = [
  // PRODUCT
  {
    id: 'idea-refiner',
    name: 'Idea Refiner',
    category: 'PRODUCT',
    description: 'Clarify and validate your idea',
    icon: '💡',
    requiredInputs: []
  },
  {
    id: 'brand-story',
    name: 'Brand Story',
    category: 'PRODUCT',
    description: 'Build your narrative',
    icon: '📖',
    requiredInputs: ['idea-refiner']
  },
  {
    id: 'mvp-diagnostic',
    name: 'MVP Diagnostic',
    category: 'PRODUCT',
    description: 'Test product readiness',
    icon: '🔍',
    requiredInputs: ['idea-refiner'],
    optionalInputs: ['customer-personas']
  },
  {
    id: 'customer-personas',
    name: 'Customer Personas',
    category: 'PRODUCT',
    description: 'Define ideal customers',
    icon: '👥',
    requiredInputs: ['idea-refiner']
  },
  // MARKET
  {
    id: 'market-size',
    name: 'Market Size',
    category: 'MARKET',
    description: 'TAM/SAM/SOM analysis',
    icon: '📊',
    requiredInputs: ['idea-refiner', 'customer-personas']
  },
  {
    id: 'competitor-map',
    name: 'Competitor Map',
    category: 'MARKET',
    description: 'Analyze competition',
    icon: '🎯',
    requiredInputs: ['idea-refiner']
  },
  {
    id: 'pricing-strategy',
    name: 'Pricing Strategy',
    category: 'MARKET',
    description: 'Set pricing model',
    icon: '💰',
    requiredInputs: ['customer-personas', 'competitor-map']
  },
  // GROWTH
  {
    id: 'gtm-planner',
    name: 'GTM Strategy',
    category: 'GROWTH',
    description: '90-day launch plan',
    icon: '🎯',
    requiredInputs: ['mvp-diagnostic', 'pricing-strategy', 'customer-personas']
  },
  {
    id: 'messaging-copy',
    name: 'Messaging',
    category: 'GROWTH',
    description: 'Marketing copy',
    icon: '✏️',
    requiredInputs: ['brand-story', 'customer-personas']
  },
  // FINANCE
  {
    id: 'financials',
    name: 'Projections',
    category: 'FINANCE',
    description: '12-month forecast',
    icon: '📈',
    requiredInputs: ['pricing-strategy', 'market-size']
  },
  {
    id: 'investor-one-pager',
    name: 'One-Pager',
    category: 'FINANCE',
    description: 'Executive summary',
    icon: '📄',
    requiredInputs: ['idea-refiner', 'market-size', 'financials']
  }
];

export function useBusinessContext() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [contextStore, setContextStore] = useState<BusinessContextStore | null>(null);
  const [uiState, setUIState] = useState<AgentUIState | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Initialize project and context
  useEffect(() => {
    async function initializeContext() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get or create active project
        let activeProject = await getActiveProject(user.id);
        
        if (!activeProject) {
          // Create a default project for the user
          const projectId = await createProject(user.id, 'My SaaS Project');
          activeProject = await getActiveProject(user.id);
        }

        if (!activeProject) {
          throw new Error('Failed to initialize project');
        }

        setProject(activeProject);
        
        // Initialize context store
        const store = new BusinessContextStore(activeProject.id);
        setContextStore(store);
        
        // Load business context
        const context = await store.loadContext();
        if (context) {
          setBusinessContext(context);
          
          // Update UI state based on completed agents
          const completedAgents = await store.getCompletedAgents();
          updateUIState(activeProject.id, completedAgents);
        }
      } catch (error) {
        console.error('Error initializing business context:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    initializeContext();
  }, [user]);

  // Update UI state based on completed agents
  const updateUIState = (projectId: string, completedAgents: string[]) => {
    const availableAgents: string[] = [];
    const lockedAgents: string[] = [];

    AGENTS.forEach(agent => {
      const requirementsMet = agent.requiredInputs.every(req => 
        completedAgents.includes(req)
      );

      if (requirementsMet && !completedAgents.includes(agent.id)) {
        availableAgents.push(agent.id);
      } else if (!requirementsMet && !completedAgents.includes(agent.id)) {
        lockedAgents.push(agent.id);
      }
    });

    setUIState({
      projectId,
      completedAgents,
      availableAgents,
      lockedAgents
    });
  };

  // Save context updates
  const saveContext = async (updates: Partial<BusinessContext>) => {
    if (!contextStore || !businessContext) return;

    try {
      // Save updates to appropriate tables
      if (updates.companyProfile) {
        await contextStore.saveCompanyProfile(updates.companyProfile);
      }
      if (updates.marketIntelligence) {
        await contextStore.updateMarketIntelligence(updates.marketIntelligence);
      }
      if (updates.productSpecs) {
        await contextStore.updateProductSpecs(updates.productSpecs);
      }
      if (updates.businessOperations) {
        await contextStore.updateBusinessOperations(updates.businessOperations);
      }

      // Update local state
      setBusinessContext({
        ...businessContext,
        ...updates
      });

      toast({
        title: 'Progress saved',
        description: 'Your data has been saved successfully'
      });
    } catch (error) {
      console.error('Error saving context:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your progress',
        variant: 'destructive'
      });
    }
  };

  // Save agent output and update context
  const saveAgentOutput = async (agentId: string, output: any, contextUpdates?: Partial<BusinessContext>) => {
    if (!contextStore || !project) return;

    try {
      // Save agent output
      await contextStore.saveAgentOutput({
        agentId,
        projectId: project.id,
        timestamp: new Date().toISOString(),
        data: output
      });

      // Save any context updates
      if (contextUpdates) {
        await saveContext(contextUpdates);
      }

      // Update UI state
      const completedAgents = await contextStore.getCompletedAgents();
      updateUIState(project.id, completedAgents);

      toast({
        title: 'Success',
        description: 'Progress saved successfully'
      });
    } catch (error) {
      console.error('Error saving agent output:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress',
        variant: 'destructive'
      });
    }
  };

  // Get agent by ID
  const getAgent = (agentId: string): Agent | undefined => {
    return AGENTS.find(agent => agent.id === agentId);
  };

  // Check if agent can be run
  const canRunAgent = (agentId: string): boolean => {
    if (!uiState) return false;
    return uiState.availableAgents.includes(agentId) || uiState.completedAgents.includes(agentId);
  };

  return {
    loading,
    project,
    businessContext,
    uiState,
    agents: AGENTS,
    getAgent,
    canRunAgent,
    saveContext,
    saveAgentOutput,
    refetchContext: async () => {
      if (contextStore) {
        const context = await contextStore.loadContext();
        if (context) {
          setBusinessContext(context);
        }
      }
    }
  };
}