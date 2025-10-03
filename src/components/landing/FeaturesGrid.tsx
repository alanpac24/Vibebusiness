import React from "react";
import { 
  Brain, 
  Link2, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  Users,
  FileText,
  DollarSign
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      title: "AI-Powered Agents",
      description: "50+ specialized agents for every aspect of building a SaaS",
      icon: Brain
    },
    {
      title: "Connected Workflows",
      description: "Each agent builds on previous outputs for coherent results",
      icon: Link2
    },
    {
      title: "Instant Generation",
      description: "Generate business plans, code snippets, and marketing copy in seconds",
      icon: Zap
    },
    {
      title: "Market Validation",
      description: "Validate your idea with AI-powered market research and analysis",
      icon: Target
    },
    {
      title: "Compliance Ready",
      description: "Built-in tools for legal, privacy, and regulatory compliance",
      icon: Shield
    },
    {
      title: "Growth Focused",
      description: "GTM strategies, pricing models, and growth tactics built-in",
      icon: TrendingUp
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Everything You Need to Build a SaaS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and AI agents to guide you from idea to launch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional highlight features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-gray-100 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold">Customer-Centric</h3>
              <p className="text-sm text-gray-600">
                Define personas and validate with real user insights
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-gray-100 flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-gray-600">
                Auto-generate docs, pitch decks, and business plans
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-gray-100 flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold">Financial Planning</h3>
              <p className="text-sm text-gray-600">
                Projections, pricing strategy, and unit economics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}