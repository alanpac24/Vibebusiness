import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PricingSection() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for validating your idea",
      features: [
        "Idea validation & refinement",
        "Market research & analysis",
        "Customer personas",
        "Basic business canvas",
        "Email support"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Growth",
      price: "$149",
      description: "Everything you need to launch",
      features: [
        "Everything in Starter",
        "All 50+ AI agents",
        "Unlimited revisions",
        "Financial projections",
        "Pitch deck generator",
        "Priority support"
      ],
      cta: "Start Building",
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "Scale",
      price: "$499",
      description: "For teams ready to scale",
      features: [
        "Everything in Growth",
        "Team collaboration",
        "Advanced analytics",
        "Custom integrations",
        "White-label options",
        "Dedicated success manager"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your stage. Upgrade anytime as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white p-8 border ${plan.highlighted ? 'border-black shadow-lg transform scale-105' : 'border-gray-200'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-sm">
                    {plan.badge}
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-black text-white hover:bg-gray-900' : 'bg-white text-black border border-black hover:bg-gray-50'}`}
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-gray-600">
              Need a custom plan? <button className="text-black hover:text-gray-700 underline">Contact us</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}