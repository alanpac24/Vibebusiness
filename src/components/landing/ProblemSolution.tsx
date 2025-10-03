import React from "react";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    {
      title: "Information Overload",
      description: "Too many disconnected tools and resources to navigate"
    },
    {
      title: "Starting from Scratch",
      description: "Every decision requires research and context you don't have"
    },
    {
      title: "Repetitive Work",
      description: "Re-entering the same information across different tools"
    }
  ];

  const solutions = [
    {
      title: "Connected AI Agents",
      description: "Each agent builds on previous outputs, creating a coherent business plan"
    },
    {
      title: "Guided Journey",
      description: "Step-by-step process from idea validation to launch"
    },
    {
      title: "Single Source of Truth",
      description: "All your business context in one place, accessible by every agent"
    }
  ];

  return (
    <section id="problem-solution" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Building a SaaS is Complex
            </h2>
            <p className="text-lg text-gray-600">
              We simplify the journey with AI-powered guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problems */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                The Traditional Way
              </h3>
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div key={index} className="bg-white p-6 border border-red-200">
                    <h4 className="font-semibold mb-2">{problem.title}</h4>
                    <p className="text-sm text-gray-600">{problem.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                The Vibe Business Way
              </h3>
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div key={index} className="bg-green-50 p-6 border border-green-200">
                    <h4 className="font-semibold mb-2">{solution.title}</h4>
                    <p className="text-sm text-gray-600">{solution.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-lg font-medium text-black hover:text-gray-700 transition-colors"
            >
              <span>See how it works</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}