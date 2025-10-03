import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function WorkflowSteps() {
  const steps = [
    {
      number: "01",
      title: "Define Your Idea",
      description: "Start with your business concept. Our AI helps refine and validate it.",
      features: [
        "Idea validation",
        "Market research",
        "Competitor analysis",
        "Customer personas"
      ]
    },
    {
      number: "02",
      title: "Build Your Business",
      description: "AI agents create your business model, pricing, and go-to-market strategy.",
      features: [
        "Business canvas",
        "Pricing strategy",
        "Revenue projections",
        "Growth tactics"
      ]
    },
    {
      number: "03",
      title: "Launch & Scale",
      description: "Get everything you need to launch and grow your SaaS business.",
      features: [
        "Launch checklist",
        "Marketing copy",
        "Sales funnel",
        "Investor materials"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              From Idea to Launch in 3 Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process takes you from concept to market-ready SaaS
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-12 top-full h-8 w-px bg-gray-300 md:left-1/2 md:-translate-x-1/2" />
                )}
                
                <div className="relative bg-white border border-gray-200">
                  <div className="absolute top-0 left-0 w-1 h-full bg-black" />
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                          <span className="text-3xl font-bold">{step.number}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:flex items-center justify-center">
                          <ArrowRight className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}