"use client";

import React, { useRef, useEffect, useState } from "react";

export function RfidAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const blobsRef = useRef<{ [key: string]: string }>({});

  // Detect orientation change
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch / Switch based on orientation
  useEffect(() => {
    if (isMobile === null) return;
    
    const targetAsset = isMobile ? "/videos/RFID-animation-mobile.mp4" : "/videos/RFID-animation.mp4";
    
    // Use cached blob if available
    if (blobsRef.current[targetAsset]) {
      setVideoSrc(blobsRef.current[targetAsset]);
      return;
    }

    fetch(targetAsset)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        blobsRef.current[targetAsset] = url;
        setVideoSrc(url);
      })
      .catch(err => {
        console.error("Video blob fetch failed:", err);
        setVideoSrc(targetAsset); // Fallback
      });
  }, [isMobile]);

  // Cleanup all Object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(blobsRef.current).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.pause();

    let rafId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    const lerpFactor = 0.08; // Adjusted for buttery smoothness

    const handleScroll = () => {
      if (!containerRef.current || !video.duration || isNaN(video.duration)) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const navOffset = viewHeight > 640 ? 72 : 60;
      const total = rect.height - viewHeight;
      
      const scrollProgress = -rect.top / total;
      // Map 0-0.75 of scroll range to 0-1.0 of video progress
      // This creates a 25% "freeze zone" at the end for reading the content
      const animationEndScroll = 0.75; 
      targetProgress = Math.min(Math.max(scrollProgress / animationEndScroll, 0), 1);
    };

    const updateVideo = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * lerpFactor;
        if (video.readyState >= 2) {
          video.currentTime = currentProgress * video.duration;
        }

        // Apply scroll-triggered opacity to text (starts at 0.7, full at 0.95)
        if (textRef.current) {
          const textOpacity = Math.min(Math.max((currentProgress - 0.7) / 0.25, 0), 1);
          textRef.current.style.opacity = textOpacity.toString();
          textRef.current.style.transform = `translateY(${10 - textOpacity * 10}px)`;

          // Synchronize overlay opacity (subtle base, dark when text is visible)
          if (overlayRef.current) {
            const baseOpacity = isMobile ? 0.05 : 0.15;
            const targetOpacity = isMobile ? 0.4 : 0.8;
            const currentOverlayOpacity = baseOpacity + (targetOpacity - baseOpacity) * textOpacity;
            overlayRef.current.style.opacity = currentOverlayOpacity.toString();
          }
        }
      }
      rafId = requestAnimationFrame(updateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(updateVideo);

    // Initial activation trick for some browsers
    const activateVideo = () => {
      video.play().then(() => video.pause());
      window.removeEventListener('touchstart', activateVideo);
      window.removeEventListener('click', activateVideo);
    };
    window.addEventListener('touchstart', activateVideo);
    window.addEventListener('click', activateVideo);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', activateVideo);
      window.removeEventListener('click', activateVideo);
      cancelAnimationFrame(rafId);
    };
  }, [videoSrc]);

  return (
    <section ref={containerRef} className="h-[300vh] relative bg-black">
      <div className="sticky top-[60px] sm:top-[72px] h-[calc(100vh-60px)] sm:h-[calc(100vh-72px)] w-full flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc ?? undefined}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-60"
            />
           )}
          {/* Dynamic Backdrop Overlay */}
          <div 
            ref={overlayRef} 
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black transition-opacity duration-300 pointer-events-none"
            style={{ opacity: isMobile ? 0.05 : 0.15 }}
          />

          {/* Permanent Edge Fades for Desktop */}
          <div className="absolute top-0 left-0 right-0 h-24 lg:h-48 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none hidden lg:block" />
          <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none hidden lg:block" />

          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Content Overlay */}
        <div 
          ref={textRef} 
          className="relative z-10 w-full px-6 lg:px-14 flex items-start md:items-center pt-6 md:pt-0 opacity-0 pointer-events-none transition-transform duration-300 ease-out h-full"
        >
           <div className="mx-auto max-w-7xl w-full">
             <div className="max-w-2xl text-center lg:text-left space-y-4 lg:space-y-8">
               <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Seamless Integration</h3>
                 <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-white leading-tight">
                   Fast. Seamless. <br />
                   <span className="text-primary italic">Effortless.</span>
                 </h2>
               </div>
               <p className="sm:text-xl text-white/50 font-sans leading-relaxed">
                 Experience the future of gym access with lightning-fast RFID check-ins that keep your community moving.
               </p>
             </div>
           </div>
        </div>

        {/* Decorative Light Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </section>
  );
}
