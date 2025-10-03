import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Subtle Radial Gradient Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f8f8f8 100%)'
        }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm border border-black/10 bg-black/[0.02]">
              <Brain className="h-4 w-4" />
              <span>AI-Powered SaaS Development</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight tracking-tight">
              Build Your SaaS Business
              <br />
              <span className="text-gray-600">with Connected AI Agents</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your technical ideas into profitable SaaS businesses. Our AI agents work together 
              to handle everything from ideation to go-to-market strategy.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Built for Technical Founders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>End-to-End Business Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Context-Aware AI Workflow</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="px-6 bg-black text-white hover:bg-gray-900"
                onClick={() => navigate('/auth')}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 border-black/20 hover:bg-black/[0.02]"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>
          </div>

          {/* Product Preview Section */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative overflow-hidden bg-white border border-black/10 shadow-2xl">
              <div className="bg-gray-50 border-b border-black/10 px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-red-500" />
                  <div className="h-3 w-3 bg-yellow-500" />
                  <div className="h-3 w-3 bg-green-500" />
                  <span className="ml-4 text-sm text-gray-600">vibe-business-planner.ai</span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Before/After Preview */}
                  <div className="text-sm font-medium text-gray-600 mb-2">Your Idea:</div>
                  <div className="p-4 bg-gray-50 font-mono text-sm">
                    "I want to build a SaaS tool for developers that helps them manage their API documentation"
                  </div>

                  <div className="text-sm font-medium text-gray-600 mb-2">AI Agent Output:</div>
                  <div className="space-y-3 p-4 bg-green-50 border border-green-200 font-mono text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-black">Market Validated</div>
                        <div className="text-gray-700">$2.3B API management market, 23% CAGR</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-black">Target Customer Identified</div>
                        <div className="text-gray-700">Mid-size dev teams (10-50 engineers)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-black">GTM Strategy Ready</div>
                        <div className="text-gray-700">Developer-led growth, freemium model</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}