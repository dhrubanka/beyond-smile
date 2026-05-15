import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  treatment: string;
  beforeAfter?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sayan Banerjee",
    location: "Guwahati Resident",
    rating: 5,
    text: "Great experience at this clinic Got my teeth extracted and my root canal treatment (rct) done in another tooth along with crown placement. Excellent behaviour of the doctor. He explained every procedure in great detail. Would highly recommend this clinic for all kinds of dental treatment.",
    treatment: "Root Canal Treatment",
    beforeAfter: true
  },
  {
    id: 2,
    name: "Kanmani Kalita",
    location: "Guwahati",
    rating: 5,
    text: "Best Dentist in Lokhora Chariali. Do visit for any kind of Dental related problems. The clinic is well maintained and hygiene.",
    treatment: "Oral Prophylaxis"
  },
  {
    id: 3,
    name: "Samiran Nath",
    location: "Guwahati",
    rating: 5,
    text: "Very Good service given by Dr Kalita. Treatment was nice.",
    treatment: "Porcelain veneers"
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; isActive: boolean }> = ({ 
  testimonial, 
  isActive 
}) => {
  return (
    <div className={`transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute pointer-events-none'}`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-4xl">
        <div className="flex items-start space-x-6">
          {/* Avatar Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="flex-1">
            {/* Star Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
              "{testimonial.text}"
            </blockquote>

            {/* Patient Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-gray-600 text-sm">{testimonial.location}</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Treatment:</div>
                <div className="font-semibold text-blue-600">{testimonial.treatment}</div>
              </div>
            </div>

            {/* Before/After Badge */}
            {testimonial.beforeAfter && (
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <Camera className="w-4 h-4 mr-1" />
                Before/After Photos Available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextTestimonial]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextTestimonial();
      else prevTestimonial();
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from real patients who trust us with their dental care. 
            See why thousands choose Beyond Smile Dental Care for their oral health needs.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="relative mb-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[300px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={index === currentIndex}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-105 border border-gray-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-105 border border-gray-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mb-16" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to testimonial ${index + 1}`}
              role="tab"
              aria-selected={index === currentIndex}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-12 shadow-xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Years of Service</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
