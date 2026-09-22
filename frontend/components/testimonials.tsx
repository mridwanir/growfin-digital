import { Star } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Owner, Prime Dental Clinic",
      text: "Growfin completely changed how we handle new patient inquiries. The automated demo they sent us was so professional, we upgraded our entire online presence the same day.",
      rating: 5,
    },
    {
      name: "James Lee",
      role: "Director, Aesthetic Care",
      text: "We were struggling to get bookings from Google Maps. The custom booking interface Growfin built for us increased our conversion rate by 40% in just two weeks.",
      rating: 5,
    },
    {
      name: "Dr. Amanda Chen",
      role: "Dermato Pro",
      text: "I was amazed at how fast they deployed our site. The AI-generated demo was spot on, and the design is absolutely premium. Highly recommended for any clinic.",
      rating: 5,
    }
  ];

  return (
    <section className="w-full py-24 bg-[#0B0B0E]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#FFFFFF]">
            Loved by Clinic Owners
          </h2>
          <p className="text-[#8E8EA0] text-lg max-w-[600px]">
            See how our automated solutions and premium designs are helping local businesses scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="flex flex-col p-6 bg-[#14141A] rounded-2xl border border-[#262633] hover:border-[#00b894]/50 transition-colors">
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#00e0b8] fill-[#00e0b8]" />
                ))}
              </div>
              <p className="text-[#8E8EA0] italic mb-6 grow">"{review.text}"</p>
              <div>
                <p className="font-bold text-[#FFFFFF]">{review.name}</p>
                <p className="text-sm text-[#00e0b8]">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
