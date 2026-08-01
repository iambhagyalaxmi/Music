"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../lib/AuthContext';
import { API_URL } from '../lib/api';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Disc, PlaySquare, Users, MessageCircle, Heart, Zap, Sparkles, Video, ArrowRight, Activity, Play } from 'lucide-react';

// ----------------------------------------------------------------------
// Mini Components
// ----------------------------------------------------------------------

const MiniEqualizer = () => (
  <div className="flex items-end gap-0.5 h-4 w-4">
    {[1, 2, 3].map((i) => (
      <div 
        key={i} 
        className="w-1 bg-[#FF4D8D] rounded-t-sm" 
        style={{ 
          animation: `equalizer-bar ${0.6 + i * 0.2}s ease-in-out infinite alternate`,
          transformOrigin: 'bottom' 
        }} 
      />
    ))}
  </div>
);

const FeatureChip = ({ icon: Icon, text, delay }: { icon: any, text: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full transition-colors cursor-default"
  >
    <Icon size={16} className="text-[#06B6D4]" />
    <span className="text-sm font-semibold text-white/90">{text}</span>
  </motion.div>
);

// ----------------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------------

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const backgroundX = useTransform(smoothX, [0, 1000], [0, 30]);
  const backgroundY = useTransform(smoothY, [0, 1000], [0, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen w-full bg-[#09090B] relative overflow-hidden text-[#F8FAFC] selection:bg-[#7C3AED]/30">
      
      {/* ---------------------------------------------------------
          Aurora Background & Particles (Interactive)
      --------------------------------------------------------- */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/20 blur-[120px] rounded-full mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[60%] bg-[#4F46E5]/15 blur-[130px] rounded-full mix-blend-screen animate-blob-delayed" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-[#06B6D4]/15 blur-[140px] rounded-full mix-blend-screen animate-blob" />
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </motion.div>

      {/* Floating Album Covers (Abstract Representations) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          { src: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300', class: 'top-[15%] left-[5%] w-32 h-32 animate-float opacity-15 rotate-12 blur-[2px]' },
          { src: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f56468?w=300', class: 'top-[10%] right-[15%] w-40 h-40 animate-float-delayed opacity-10 -rotate-12 blur-[4px]' },
          { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', class: 'bottom-[20%] left-[10%] w-24 h-24 animate-float-fast opacity-20 rotate-45 blur-[1px]' },
          { src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', class: 'bottom-[15%] right-[5%] w-48 h-48 animate-float-slow opacity-[0.08] -rotate-6 blur-[6px]' },
          { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300', class: 'top-[45%] left-[30%] w-20 h-20 animate-float opacity-[0.12] rotate-180 blur-[2px]' },
        ].map((album, idx) => (
          <img key={idx} src={album.src} className={`absolute rounded-xl object-cover shadow-2xl ${album.class}`} alt="" />
        ))}
        {/* Floating Vinyl */}
        <Disc className="absolute top-[35%] right-[25%] w-32 h-32 text-black opacity-20 animate-spin blur-[2px]" style={{ animationDuration: '10s' }} />
      </div>

      {/* ---------------------------------------------------------
          Main Split Layout
      --------------------------------------------------------- */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-12 py-12 lg:py-0 items-center">
        
        {/* LEFT COLUMN: Product Selling & Discovery */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full gap-10 pt-10 lg:pt-0">
          
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-3 pr-4 py-2 rounded-full backdrop-blur-md">
              <span className="text-2xl">🎵</span>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#A1A1AA] font-display tracking-tight">
                SoundSphere
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-[#FF4D8D]/10 border border-[#FF4D8D]/30 px-3 py-1.5 rounded-full">
              <MiniEqualizer />
              <span className="text-[#FF4D8D] text-[11px] font-bold tracking-widest uppercase mt-0.5">Live Rooms</span>
            </div>
          </motion.div>

          {/* Hero Typography */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
              Experience Music <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] via-[#FF4D8D] to-[#F97316]">
                Like Never Before.
              </span>
            </h2>
            <p className="text-xl text-[#A1A1AA] leading-relaxed max-w-xl font-medium">
              Create synchronized listening rooms, chat with friends, react using emojis, and watch music videos together in real-time.
            </p>
          </motion.div>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-3">
            <FeatureChip icon={PlaySquare} text="Live Listening" delay={0.3} />
            <FeatureChip icon={Users} text="Group Rooms" delay={0.4} />
            <FeatureChip icon={MessageCircle} text="Real-Time Chat" delay={0.5} />
            <FeatureChip icon={Heart} text="Emoji Reactions" delay={0.6} />
            <FeatureChip icon={Video} text="HD Music Videos" delay={0.7} />
          </div>

          {/* Activity & Social Proof Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            {/* Live Activity Preview */}
            <div className="bg-[#111827]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] opacity-50" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Activity size={14} className="text-[#06B6D4]" /> Friends Listening Now
                </h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-[#A1A1AA]">+284 online</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Aarav', song: 'Blinding Lights', img: 'https://ui-avatars.com/api/?name=Aarav&background=0D8ABC&color=fff' },
                  { name: 'Ananya', song: 'Cruel Summer', img: 'https://ui-avatars.com/api/?name=Ananya&background=7C3AED&color=fff' },
                  { name: 'Rahul', song: 'Starboy', img: 'https://ui-avatars.com/api/?name=Rahul&background=F97316&color=fff' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={f.img} alt={f.name} className="w-6 h-6 rounded-full shadow-sm" />
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/90 truncate">{f.name}</span>
                      <span className="text-[10px] text-[#A1A1AA] truncate flex items-center gap-1">
                        <span className="text-[#FF4D8D]">🎵</span> {f.song}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Music Player Preview */}
            <div className="bg-[#111827]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D8D]/10 blur-[40px] rounded-full" />
              <div className="flex gap-4 items-center mb-4">
                <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100" className="w-12 h-12 rounded-lg shadow-md object-cover" alt="Album" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Midnight City</h4>
                    <MiniEqualizer />
                  </div>
                  <p className="text-xs text-[#A1A1AA]">M83</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-gradient-to-r from-[#7C3AED] to-[#FF4D8D]" />
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] text-[#A1A1AA]">2:14</span>
                  <div className="flex gap-3 text-lg opacity-80 cursor-default">
                    <span className="hover:scale-125 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">❤️</span>
                    <span className="hover:scale-125 transition-transform">💬</span>
                    <span className="hover:scale-125 transition-transform">🔥</span>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA]">4:03</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Statistics */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center gap-8 mt-4 pt-6 border-t border-white/10"
          >
            <div>
              <p className="text-3xl font-display font-bold text-white">150K+</p>
              <p className="text-sm text-[#A1A1AA] font-medium">Songs Available</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-display font-bold text-white">12K+</p>
              <p className="text-sm text-[#A1A1AA] font-medium">Music Lovers</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-display font-bold text-white">500+</p>
              <p className="text-sm text-[#A1A1AA] font-medium">Live Rooms Daily</p>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Authentication Card */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5 flex justify-center lg:justify-end w-full"
        >
          {/* Glassmorphic Container */}
          <div className="w-full max-w-[440px] relative">
            {/* Ambient background glow specifically for the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] via-[#FF4D8D] to-[#06B6D4] rounded-[32px] blur-[30px] opacity-30 animate-pulse-glow pointer-events-none" />
            
            <div className="relative bg-[rgba(17,24,39,0.75)] backdrop-blur-[40px] border border-[rgba(255,255,255,0.1)] rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-8">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#FF4D8D] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FF4D8D]/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold font-display text-white mb-2">Continue Your Journey</h2>
                <p className="text-sm text-[#A1A1AA]">Join the ultimate social music experience.</p>
              </div>

              {/* Login Actions */}
              <div className="flex flex-col gap-4 mt-2">
                
                {/* Custom Google Button Wrapper for Premium Feel */}
                <div className="relative group w-full h-[56px] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] bg-white flex items-center justify-center border border-transparent hover:border-white/50">
                  <div className="absolute inset-0 w-full h-full opacity-0">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const res = await fetch(`${API_URL}/auth/google`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: credentialResponse.credential }),
                          });
                          const data = await res.json();
                          if (data.token) {
                            login(data.token, data.user);
                          }
                        } catch (err) {
                          console.error('Google Login Error:', err);
                        }
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                      useOneTap
                      theme="outline"
                      size="large"
                      width="1000" // Oversize to fill the absolute container
                      text="continue_with"
                    />
                  </div>
                  {/* Visual Fake Button beneath the invisible real one to ensure perfect styling */}
                  <div className="flex items-center gap-3 pointer-events-none text-black font-semibold text-[15px]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </div>
                </div>

                <div className="flex items-center gap-4 my-2 opacity-40">
                  <div className="flex-1 h-px bg-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">OR</span>
                  <div className="flex-1 h-px bg-white" />
                </div>

                {/* Secondary Action */}
                <Link 
                  href="/signup" 
                  className="group relative w-full h-[56px] rounded-xl overflow-hidden flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 transition-colors duration-300"
                >
                  <span className="font-semibold text-white group-hover:text-[#06B6D4] transition-colors flex items-center gap-2">
                    Create Free Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

              </div>
              
              <p className="text-center text-[11px] text-[#A1A1AA] mt-4 leading-relaxed">
                By continuing, you agree to our <Link href="#" className="text-white hover:underline">Terms of Service</Link> and <Link href="#" className="text-white hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------
          Footer
      --------------------------------------------------------- */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#8C93A7]">
          <div className="flex items-center gap-2">
            <span className="text-white">© 2026 SoundSphere</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">API</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
