import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, DataSync",
      avatar: "SC",
      content: "Went from idea to paying customers in 6 weeks. The AI agents helped me validate my market and build a solid business plan.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CTO, CloudMetrics",
      avatar: "MR",
      content: "The connected workflows are game-changing. Each agent builds on the previous work, creating a coherent strategy.",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Solo Founder",
      avatar: "ET",
      content: "As a technical founder, I struggled with the business side. This platform made it easy to handle pricing, marketing, and legal.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Loved by SaaS Founders
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of founders building successful SaaS businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-black text-black" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-sm text-gray-600">Active Founders</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">$2.5M</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50+</div>
              <div className="text-sm text-gray-600">Launched SaaS</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}