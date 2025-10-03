import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How does the AI agent system work?",
      answer: "Our AI agents are specialized for specific business tasks. Each agent can access the outputs from previous agents, creating a connected workflow. For example, your Customer Personas agent uses insights from your Idea Refiner to create more accurate profiles."
    },
    {
      question: "What makes this different from ChatGPT or other AI tools?",
      answer: "Unlike general AI tools, our agents are specifically trained for SaaS business building. They understand the context of your entire business, share information between workflows, and provide structured outputs that build on each other."
    },
    {
      question: "Can I use this if I'm not technical?",
      answer: "While our platform is optimized for technical founders building SaaS products, you don't need coding skills to use it. The AI agents handle the business strategy, planning, and documentation aspects."
    },
    {
      question: "How long does it take to go from idea to launch?",
      answer: "Most founders complete the full journey in 2-6 weeks, depending on the complexity of their SaaS and how much time they dedicate. The AI significantly accelerates research, planning, and content creation phases."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! All your work can be exported as PDFs, spreadsheets, or markdown files. You own all the content generated and can use it however you wish."
    },
    {
      question: "What if I already have a business plan?",
      answer: "You can start at any stage of the journey. Upload existing documents to give the AI context, then use specific agents to fill gaps or improve areas you're less confident about."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption, never train our AI on your data, and comply with GDPR and SOC2 standards. Each project is isolated and only accessible by you."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the platform, we'll refund your subscription, no questions asked."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about building your SaaS with AI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions?
            </p>
            <button className="text-black hover:text-gray-700 underline font-medium">
              Contact our support team →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}