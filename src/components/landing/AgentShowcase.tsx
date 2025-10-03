import React, { useState } from "react";
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  DollarSign,
  Target,
  FileText,
  BarChart,
  Shield
} from "lucide-react";

export function AgentShowcase() {
  const [activeCategory, setActiveCategory] = useState("product");
  
  const categories = [
    {
      id: "product",
      name: "Product",
      agents: [
        { name: "Idea Refiner", description: "Validate and refine your business concept", icon: Lightbulb },
        { name: "MVP Diagnostic", description: "Define your minimum viable product", icon: Target },
        { name: "Customer Personas", description: "Create detailed ideal customer profiles", icon: Users },
      ]
    },
    {
      id: "market",
      name: "Market",
      agents: [
        { name: "Market Size", description: "TAM/SAM/SOM analysis", icon: BarChart },
        { name: "Competitor Map", description: "Analyze competitive landscape", icon: Target },
        { name: "Pricing Strategy", description: "Optimize your pricing model", icon: DollarSign },
      ]
    },
    {
      id: "growth",
      name: "Growth",
      agents: [
        { name: "GTM Strategy", description: "90-day go-to-market plan", icon: TrendingUp },
        { name: "Content Plan", description: "SEO-optimized content strategy", icon: FileText },
        { name: "Sales Funnel", description: "Design conversion funnels", icon: BarChart },
      ]
    },
    {
      id: "compliance",
      name: "Compliance",
      agents: [
        { name: "Legal Structure", description: "Choose the right entity type", icon: Shield },
        { name: "Privacy Policy", description: "GDPR/CCPA compliant policies", icon: FileText },
        { name: "Terms Generator", description: "SaaS-specific terms of service", icon: Shield },
      ]
    }
  ];

  const activeAgents = categories.find(cat => cat.id === activeCategory)?.agents || [];

  return (
    <section id="agents" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 mb-4 text-sm border border-black/10 bg-black/[0.02]">
              50+ Specialized Agents
            </div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              AI Agents for Every Business Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each agent is specialized for a specific task and shares context with others
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex border border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {activeAgents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div key={index} className="bg-white p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <Icon className="h-8 w-8 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              All agents work together, sharing context to build your complete business
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-black animate-pulse" />
              <span className="text-sm font-medium">Connected Intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}