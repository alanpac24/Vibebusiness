-- Create projects table to organize user's business projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create company profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    business_idea TEXT,
    business_name TEXT,
    problem_statement TEXT,
    value_proposition TEXT,
    mission_statement TEXT,
    brand_story TEXT,
    target_market TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create market intelligence table
CREATE TABLE IF NOT EXISTS market_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    market_size JSONB,
    competitors JSONB,
    pricing_research JSONB,
    customer_feedback JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create product specifications table
CREATE TABLE IF NOT EXISTS product_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    features JSONB,
    tech_stack JSONB,
    architecture JSONB,
    roadmap JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create business operations table
CREATE TABLE IF NOT EXISTS business_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    financials JSONB,
    team JSONB,
    legal JSONB,
    metrics JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create agent outputs table to store results from each agent
CREATE TABLE IF NOT EXISTS agent_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_id TEXT NOT NULL,
    data JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, agent_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_company_profiles_project_id ON company_profiles(project_id);
CREATE INDEX idx_market_intelligence_project_id ON market_intelligence(project_id);
CREATE INDEX idx_product_specifications_project_id ON product_specifications(project_id);
CREATE INDEX idx_business_operations_project_id ON business_operations(project_id);
CREATE INDEX idx_agent_outputs_project_id ON agent_outputs(project_id);
CREATE INDEX idx_agent_outputs_agent_id ON agent_outputs(agent_id);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_outputs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for company_profiles
CREATE POLICY "Users can view their project's company profile" ON company_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = company_profiles.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their project's company profile" ON company_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = company_profiles.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Create similar RLS policies for other tables
CREATE POLICY "Users can manage their project's market intelligence" ON market_intelligence
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = market_intelligence.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their project's product specs" ON product_specifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = product_specifications.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their project's business operations" ON business_operations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = business_operations.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their project's agent outputs" ON agent_outputs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = agent_outputs.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_intelligence_updated_at BEFORE UPDATE ON market_intelligence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_specifications_updated_at BEFORE UPDATE ON product_specifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_operations_updated_at BEFORE UPDATE ON business_operations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();