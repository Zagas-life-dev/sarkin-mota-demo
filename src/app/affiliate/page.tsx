'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { trackPageView, trackAffiliateApply } from '@/lib/analytics'
import { 
  ChevronRight,
  DollarSign,
  Zap,
  Target,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function AffiliatePage() {
  useEffect(() => {
    trackPageView('affiliate')
  }, [])

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            Partner with Excellence
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-12">
            Join the Sarkin Mota Autos Affiliate Program and earn substantial commissions by referring clients to Nigeria's premier quality automotive destination.
          </p>
          <Link 
            href="/auth/register" 
            className="group inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            <span className="text-lg font-light">Become an Affiliate</span>
            <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-white/60 text-sm tracking-widest mb-4">THE PROCESS</h4>
            <h2 className="text-4xl md:text-5xl text-white font-light">A Simple Path to Earning</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="border-t border-border pt-8">
              <div className="text-5xl text-white/50 font-light mb-4">01</div>
              <h3 className="text-2xl text-white font-light mb-4">Register & Apply</h3>
              <p className="text-white/70 font-light">Create a Sarkin Mota Autos account and submit your affiliate application through your dashboard.</p>
            </div>
            <div className="border-t border-border pt-8">
              <div className="text-5xl text-white/50 font-light mb-4">02</div>
              <h3 className="text-2xl text-white font-light mb-4">Share Your Link</h3>
              <p className="text-white/70 font-light">Once approved, you'll receive a unique referral link to share with your network.</p>
            </div>
            <div className="border-t border-border pt-8">
              <div className="text-5xl text-white/50 font-light mb-4">03</div>
              <h3 className="text-2xl text-white font-light mb-4">Earn Commissions</h3>
              <p className="text-white/70 font-light">Earn a flat ₦100,000 commission for every vehicle purchased through your referral.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-white/60 text-sm tracking-widest mb-4">THE ADVANTAGE</h4>
            <h2 className="text-4xl md:text-5xl text-white font-light">Why Partner With Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, title: 'Generous Commissions', description: 'A highly competitive flat rate of ₦100,000 per sale.' },
              { icon: Zap, title: 'Prompt Payouts', description: 'Receive your earnings quickly after a sale is confirmed.' },
              { icon: Target, title: 'Advanced Tracking', description: 'A personal dashboard to monitor clicks, referrals, and earnings.' },
              { icon: Globe, title: 'Prestigious Brand', description: 'Align yourself with Nigeria\'s leading name in quality auto sales.' },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-8 border border-border">
                <benefit.icon className="w-8 h-8 text-white/80 mx-auto mb-6" />
                <h3 className="text-xl text-white font-light mb-4">{benefit.title}</h3>
                <p className="text-white/70 font-light">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background text-foreground py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl text-white font-light mb-8">
            Join Our Exclusive Network
          </h2>
          <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto">
            Ready to elevate your earnings? Apply to the Sarkin Mota Autos Affiliate Program today.
          </p>
          <Link 
            href="/auth/register" 
            className="group inline-flex items-center bg-white text-black px-12 py-5 hover:bg-gray-200 transition-colors"
          >
            <span className="text-lg font-light">Apply Now</span>
            <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
} 