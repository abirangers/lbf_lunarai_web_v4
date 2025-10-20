'use client'

import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, MessageCircle, Mail, FlaskConical, Rocket, Zap, TrendingUp, Clock } from 'lucide-react'
import { useSimulator } from '@/contexts/SimulatorContext'
import { SimulatorForm } from '@/components/form/SimulatorForm'
import { LiveBrief } from '@/components/form/LiveBrief'
import { GlassCard } from '@/components/common/GlassCard'
import { GlowButton } from '@/components/common/GlowButton'
import { NeonBadge } from '@/components/common/NeonBadge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function HomePage() {
  const { environment, setEnvironment, submissionCount } = useSimulator()

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Simulator Workspace */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero + Header Combined */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 rounded-2xl p-8 mb-8 border-2 border-blue-200/50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="relative z-10">
              {/* Hero Content - Left Right Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
                {/* Left Content */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-7"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 leading-tight">
                    <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">
                      LunarAI Beauty
                    </span>
                  </h1>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-secondary mb-3">
                    Business Analysis
                  </h2>
                  <p className="text-sm text-brand-primary mb-6 max-w-xl">
                    Isi detail produk Anda untuk menghasilkan analisis mendalam yang komprehensif
                  </p>

                  {/* Features Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 rounded-full text-xs text-brand-primary">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                      Mudah
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 rounded-full text-xs text-brand-primary">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                      Cepat
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 rounded-full text-xs text-brand-primary">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                      Evidence-Based
                    </span>
                  </div>
                </motion.div>

                {/* Right Content - Feature Cards + Env Toggle */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-5"
                >
                  <div className="space-y-4">
                    {/* Feature Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-blue-500/30 bg-white/50 hover:bg-white hover:shadow-md transition-all">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-brand-secondary">AI-Powered</div>
                            <div className="text-xs text-brand-primary">Analysis</div>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-cyan-500/30 bg-white/50 hover:bg-white hover:shadow-md transition-all">
                          <div className="p-2 rounded-lg bg-cyan-100">
                            <TrendingUp className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-brand-secondary">{submissionCount}+</div>
                            <div className="text-xs text-brand-primary">Submissions</div>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-purple-500/30 bg-white/50 hover:bg-white hover:shadow-md transition-all">
                          <div className="p-2 rounded-lg bg-purple-100">
                            <Zap className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-brand-secondary">Lightning</div>
                            <div className="text-xs text-brand-primary">Fast</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Environment Toggle */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-brand-primary font-medium">Environment:</span>
                        <div className="flex items-center gap-3">
                          <ToggleGroup
                            type="single"
                            value={environment}
                            onValueChange={(value: 'test' | 'production') => value && setEnvironment(value)}
                          >
                            <ToggleGroupItem value="test" className="glass-effect flex items-center gap-2">
                              <FlaskConical className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="production" className="glass-effect flex items-center gap-2">
                              <Rocket className="h-4 w-4" />
                            </ToggleGroupItem>
                          </ToggleGroup>
                          <NeonBadge variant={environment === 'test' ? 'cyan' : 'blue'} pulse>
                            {environment === 'test' ? 'Test' : 'Production'}
                          </NeonBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <SimulatorForm />
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <h3 className="text-lg font-semibold text-brand-secondary mb-4">Live Brief Preview</h3>
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                  <LiveBrief />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with CTA */}
      <footer className="py-8 px-4 border-t border-blue-500/20 bg-gradient-to-b from-transparent to-blue-500/5 mt-12">
        <div className="container mx-auto max-w-7xl">
          {/* CTA Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-blue-500/10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">Ready to Transform Your Product Development?</h2>
              <p className="text-brand-primary">Join leading Indonesian beauty brands using LunarAI Beauty</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <GlowButton 
                glowColor="blue" 
                className="px-6 py-2.5 w-full sm:min-w-[150px] flex items-center justify-center"
                onClick={() => window.open('https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20untuk%20konsultasi', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="ml-2">WhatsApp Us</span>
              </GlowButton>
              <GlowButton 
                glowColor="cyan" 
                className="px-6 py-2.5 w-full sm:min-w-[180px] flex items-center justify-center"
                onClick={() => window.open('https://calendly.com/lunarai', '_blank')}
              >
                <Mail className="h-5 w-5" />
                <span className="ml-2">Schedule Meeting</span>
              </GlowButton>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-left">
            <p className="text-xs text-brand-primary">
              © 2024 LunarAI Beauty. All rights reserved | Powered by <span className="font-semibold text-blue-500">Amaizing</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
