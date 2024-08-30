"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import ModeToggle from '@/components/theme-toggle';
import HeroVideoDialog from '@/components/video-dialog';
import FlickeringGrid from '@/components/flickering-grid';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import BentoGrid from '@/components/bentogrid';
import { useRouter } from 'next/navigation';
import { Unauthenticated, useConvexAuth } from 'convex/react';
export default function Home() {
  const r = useRouter()
  function Herovideo() {
    return (
      <section className="max-w-5xl mx-auto h-screen flex flex-col justify-center items-center px-7 lg:px-0 relative">
        <div className="relative rounded-2xl p-1 overflow-hidden">

          <HeroVideoDialog
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />

        </div>
      </section>
    );
  }
  return (
    <>
      <div className="fixed inset-0 z-0">

        <FLickeringBg />
      </div>
      <div className="relative z-10">
        <header className="flex justify-between items-center p-4">
          <div className="logo text-xl font-bold">Keyzilla</div>
          <nav className="flex items-center space-x-4">
            <SignedOut >
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <Button className='bg-gradient-to-br from-indigo-700 via-accent-foreground to-fuchsia-500'>Get Started</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <UserButton />
            </SignedIn>
            <ModeToggle />
          </nav>
        </header>
        <div className='text-sm sm:text-3xl flex flex-col items-center justify-center mt-20 relative'>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <h1 className='dar animate-fade-up bg-gradient-to-br from-indigo-700 via-accent-foreground to-fuchsia-500 bg-clip-text text-center text-5xl/[3rem] font-bold text-transparent opacity-100 drop-shadow-sm md:text-7xl/[5rem] m-6'>
              Framework agnostic encryption library for type-safe TypeScript environments
            </h1>
            <h1 className='text-sm mb-4'>
              Built on top of <Link className='text-blue-500 after:content-["↗"]  ' href="https://env.t3.gg">T3 Env</Link>,
            </h1>
            <Button>see Demo</Button>
          </div>
          <Hero />
          <BentoGrid />
        </div>
      </div>
    </>
  );
}




export function Hero() {
  return (
    <section className="max-w-5xl mx-auto h-screen flex flex-col justify-center items-center px-7 lg:px-0 relative">
      <div className="relative rounded-2xl p-1 overflow-hidden">

        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />

      </div>
    </section>
  );
}




function FLickeringBg() {
  return (
    <div className="absolute inset-0 w-full h-full bg-background overflow-hidden">
      <FlickeringGrid
        className="w-full h-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </div>
  );
}
