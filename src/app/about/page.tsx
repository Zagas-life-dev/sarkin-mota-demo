'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import { trackPageView } from '@/lib/analytics'
import { 
  ChevronRight,
  Shield,
  Clock,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  useEffect(() => {
    trackPageView('about')
  }, [])

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-light text-white mb-3 md:mb-4 tracking-tight">
            About Sarkin Mota Autos
          </h1>
          <p className="text-base md:text-xl text-gray-300 font-light px-4">
            Redefining the quality automotive experience in Nigeria.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#0a0e1a] border-t border-[#1a1f35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 fade-in-up">
            <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-3 md:mb-4 uppercase font-light">THE STORY</div>
            <h2 className="text-2xl md:text-4xl lg:text-6xl text-white font-light mb-4 md:mb-6 leading-tight px-4">
              Watch the Journey
            </h2>
            <p className="text-base md:text-xl text-gray-300 font-light max-w-2xl mx-auto px-4">
              Experience the story of Sarkin Mota Autos from the beginning—from zero capital to becoming the first King of Cars.
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto fade-in-up delay-1 px-4 md:px-0">
            <div className="relative aspect-video bg-[#0f1419] rounded-lg overflow-hidden border-2 border-[#1a1f35] shadow-2xl">
              <video
                id="about-video"
                className="w-full h-full object-cover rounded-lg"
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
              >
                <source 
                  src="https://res.cloudinary.com/ddnlbizum/video/upload/v1768496776/social-cat-instagram_instagram_1_ib41db.mp4" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section with proof points */}
      <section className="py-12 md:py-24 bg-background border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">OUR PHILOSOPHY</h4>
              <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-light mb-6 md:mb-8">
                Driven by Passion, Proven by the Journey.
              </h2>
              <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed mb-4 md:mb-6">
                Sarkin Mota Autos began without investors or inherited capital—just a phone, persistence, and a promise to always protect our name. From snapping cars on the street to serving clients nationwide, every step has been earned.
              </p>
              <div className="space-y-3 md:space-y-4">
                <p className="text-base md:text-lg text-white font-light italic">
                  "I started Sarkin Mota Autos without a dime."
                </p>
                <p className="text-base md:text-lg text-white/80 font-light italic">
                  "My mistakes were my mentor."
                </p>
              </div>
            </div>

            {/* Timeline proof */}
            <div className="lg:pl-8">
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-1 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/30 flex items-center justify-center text-xs text-white/70 flex-shrink-0">
                    <span className="text-[10px] md:text-xs">2018–19</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-white font-medium mb-1">First Twitter Sales</h3>
                    <p className="text-sm md:text-base text-gray-300 font-light">
                      Three BMW 3 Series sold within 24 hours of posting—followed by three months with no sales. The brand was built by showing up daily, even when nothing moved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-1 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/30 flex items-center justify-center text-xs text-white/70 flex-shrink-0">
                    <span className="text-[10px] md:text-xs">NET</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-white font-medium mb-1">2,500+ Dealers, 500+ Groups</h3>
                    <p className="text-sm md:text-base text-gray-300 font-light">
                      A deliberate networking system turned simple WhatsApp introductions into more than 2,500 direct dealer contacts and over 500 active groups across Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-1 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/30 flex items-center justify-center text-xs text-white/70 flex-shrink-0">
                    <span className="text-[10px] md:text-xs">HON</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl text-white font-medium mb-1">Recognised as Sarkin Motor</h3>
                    <p className="text-sm md:text-base text-gray-300 font-light">
                      Honoured by the Federal Road Safety Corps, awarded an honorary doctorate, and turbaned by the Emir of Daura as{' '}
                      <span className="font-semibold">Sarkin Motor Jan Kasar Hausa</span>—the first King of Cars.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Sarkin Mota Difference – proof of how we work */}
      <section className="py-12 md:py-24 bg-background text-foreground border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">HOW WE OPERATE</h4>
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-light mb-4 md:mb-6 px-4">The Sarkin Mota Difference</h2>
            <p className="text-base md:text-xl text-gray-300 font-light max-w-3xl mx-auto px-4">
              Beyond cars, our real product is trust—earned through process, discipline, and how we handle challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 relative">
                <div className="absolute inset-0 bg-white/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl text-white font-medium mb-3 md:mb-4">Extended Due Diligence (EDD)</h3>
              <p className="text-sm md:text-base text-gray-300 font-light">
                We verify both cars and buyers, applying extended due diligence so that stolen funds and bad actors never define our brand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 relative">
                <div className="absolute inset-0 bg-white/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl text-white font-medium mb-3 md:mb-4">We Stand by Our Cars</h3>
              <p className="text-sm md:text-base text-gray-300 font-light">
                From engines that misbehave overnight to issues days after purchase, we prioritise fixing problems—even when it means spending our own profit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 relative">
                <div className="absolute inset-0 bg-white/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl text-white font-medium mb-3 md:mb-4">Documented Recognition</h3>
              <p className="text-sm md:text-base text-gray-300 font-light">
                Multiple awards—from FRSC honours to an honorary doctorate and traditional title—are external confirmations of the standards we hold ourselves to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive: Networking, Relationships & 40% Vision */}
      <section className="py-12 md:py-24 bg-background border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">NETWORKING & MIDDLEMAN ERA</h4>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-4 md:mb-6">
                From JB Street Studio to a Nationwide Network
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                Long before anyone called him Sarkin Motor, Dr. Aliyu was a middleman with a phone and a street in JB that became his studio. 
                He would photograph 10, 20, sometimes 30 cars a day, posting them in batches across Twitter and dealer groups.
              </p>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                With a simple preset message and relentless consistency, he turned one WhatsApp group into thousands of contacts—snapping 
                Dealer A&apos;s car and connecting it to Dealer B&apos;s buyer. The lesson was simple: if you work the network, the network works for you.
              </p>
              <p className="text-base md:text-lg text-white/80 font-light italic">
                "I understood that if I took the pictures myself, no matter how far they travelled, they would always lead back to me."
              </p>
            </div>

            <div>
              <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">RELATIONSHIPS & BIG BREAKS</h4>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-4 md:mb-6">
                Choosing Relationships Over Quick Profit
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                One early client almost walked away because the deal would only make ₦10,000. Aliyu chose to do the business anyway, 
                understanding that relationships outlive margins.
              </p>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                Months later, that same client returned—now elevated in status—to buy two cars. After hearing that Aliyu had earned ₦1,000,000 
                on each, he doubled the profit and opened doors to an entire circle of high–value clients.
              </p>
              <p className="text-base md:text-lg text-white/80 font-light italic">
                That one "small" deal became the bridge to the kind of clients who buy big cars and stay for life.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">40% INITIAL DEPOSIT PROGRAM</h4>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-4 md:mb-6">
                Making Cars Possible for Civil Servants & Business Owners
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                A harmless joke about civil servants not affording certain cars sparked a serious solution: a structure where 
                anyone—civil servant, salary earner, or entrepreneur—could start with just 40% and pay the balance over time.
              </p>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                For big men, it means keeping 60% of their cash working in business while still driving. For savers, it beats 
                waiting years only to find that inflation has moved the car out of reach.
              </p>
              <p className="text-base md:text-lg text-white/80 font-light italic">
                "If policy and inflation are moving prices, we must move access too. Forty percent is the bridge."
              </p>
            </div>

            <div>
              <h4 className="text-white/60 text-xs md:text-sm tracking-widest mb-3 md:mb-4">MENTORSHIP, SMALL BUSINESS & THE MAN BEHIND THE SHADES</h4>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-light mb-4 md:mb-6">
                No Mentor, So Now He Becomes One
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                Sarkin Mota Autos was built without a mentor—mistakes and setbacks were the teachers. That is why today, upcoming 
                dealers get the guidance he never had, from branding and networking to handling clients and structuring deals.
              </p>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                Many small business owners have also felt this support: free promotion, referrals, and a platform that believes 
                visibility is sometimes more valuable than cash.
              </p>
              <p className="text-base md:text-lg text-gray-300 font-light mb-3 md:mb-4">
                And the glasses? They are not a fashion statement but prescription—yet they became part of the brand. 
                So when he takes them off, it is a nod to transparency: this is the real person behind the name.
              </p>
              <p className="text-base md:text-lg text-white/80 font-light italic">
                "Start somewhere, be consistent, be confident, persevere. The sky would only be your starting point."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="bg-background py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-light mb-4 md:mb-8 px-4">
            Begin Your Journey
          </h2>
          <p className="text-base md:text-xl text-gray-300 font-light mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Explore our collection or contact our team to find your next exceptional vehicle.
          </p>
          <Link 
            href="/contact" 
            className="group inline-flex items-center bg-white text-black px-8 md:px-12 py-4 md:py-5 hover:bg-gray-200 transition-colors text-base md:text-lg"
          >
            <span>Contact Us</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
} 