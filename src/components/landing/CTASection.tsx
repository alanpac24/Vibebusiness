import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-medium mb-6">
            Ready to Build Your SaaS?
          </h2>
          
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of founders who are building successful SaaS businesses 
            with AI-powered guidance. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 px-8"
              onClick={() => navigate('/auth')}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black px-8"
              onClick={() => navigate('/demo')}
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}