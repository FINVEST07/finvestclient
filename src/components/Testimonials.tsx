import React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  content: string;
  author: string;
  position: string;
  rating: number;
  delay?: string;
}

const Testimonial = ({
  content,
  author,
  position,
  rating,
  delay = "0",
}: TestimonialProps) => (
  <div
    className="bg-white rounded-xl p-6 shadow-md relative border border-gray-100 animate-fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="absolute -top-3 -left-3 bg-blue-900 rounded-full p-2">
      <Quote className="h-5 w-5 text-white" />
    </div>

    <div className="flex items-center mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "text-finance-gold fill-finance-gold" : "text-gray-300"
          )}
        />
      ))}
    </div>

    <p className="text-finance-slate mb-6">{content}</p>

    <div className="flex items-center">
      
      <div>
        <h4 className="font-bold text-finance-navy">{author}</h4>
        <p className="text-finance-slate text-sm">{position}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-finance-cream/30">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-sm font-medium text-blue-900 bg-blue-200 py-1 px-4 rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-finance-navy">
            What Our Clients Say
          </h2>
          <p className="text-finance-slate text-lg">
            Don't just take our word for it. Hear from some of our satisfied
            clients about their experience working with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Testimonial
            content="The business loan I received allowed me to expand my company and double our revenue. Their rates were competitive and the process was seamless."
            author="Nikita Rai"
            position="Entrepreneur"
            rating={5}
          
            delay="200ms"
          />

          <Testimonial
            content="Choosing the right health insurance felt confusing, but FinvestCorp made it easy. They helped me compare plans and pick one that fit my needs and budget perfectly. Super helpful and stress-free!"
            author="Ravi Sharma"
            position="Recently Retired"
            rating={4}
            delay="300ms"
          />

          <Testimonial
            content="Working with this team transformed my financial outlook. Their investment advice helped me grow my retirement fund by 32% in just two years."
            author="Kartik Singh"
            position="Business Owner"
            rating={5}
            delay="100ms"
          />
        </div>

        
      </div>
    </section>
  );
};

export default Testimonials;
