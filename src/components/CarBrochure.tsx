'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { brochurePages } from '@/lib/brochureData';

export const CarBrochure: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const pages = brochurePages;
  const totalPages = pages.length;

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = pages.flatMap(page => [
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = page.frontImage;
        }),
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = page.backImage;
        }),
      ]);
      await Promise.all(imagePromises);
    };
    loadImages();
  }, [pages]);

  // Handle page flip
  const flipToPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages - 1)
      : Math.max(currentPage - 1, 0);
    
    if (newPage === currentPage) return;
    
    setIsFlipping(true);
    let progress = 0;
    
    const animate = () => {
      progress += 0.05;
      setFlipProgress(Math.min(progress, 1));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentPage(newPage);
        setFlipProgress(0);
        setIsFlipping(false);
      }
    };
    
    animate();
  };

  // Render 3D page flip on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const drawPage = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      const pageWidth = rect.width * 0.4;
      const pageHeight = rect.height * 0.8;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Left page (previous)
      if (currentPage > 0 || flipProgress > 0) {
        ctx.save();
        ctx.translate(centerX - pageWidth - 20, centerY - pageHeight / 2);
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(5, 5, pageWidth, pageHeight);
        
        // Page
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageWidth, pageHeight);
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, pageWidth, pageHeight);
        
        ctx.restore();
      }
      
      // Right page (current) with flip effect
      ctx.save();
      ctx.translate(centerX + 20, centerY - pageHeight / 2);
      
      if (isFlipping) {
        // Flip animation
        const angle = flipProgress * Math.PI;
        const segments = 20;
        const segmentWidth = pageWidth / segments;
        
        for (let i = 0; i < segments; i++) {
          const segmentAngle = (i / segments) * angle;
          const x = i * segmentWidth;
          const rotateAmount = Math.cos(segmentAngle);
          const currentWidth = segmentWidth * Math.abs(rotateAmount);
          
          ctx.save();
          ctx.translate(x + segmentWidth / 2, pageHeight / 2);
          ctx.scale(rotateAmount, 1);
          ctx.translate(-segmentWidth / 2, -pageHeight / 2);
          
          // Shadow gradient during flip
          const shadowAlpha = Math.abs(Math.sin(segmentAngle)) * 0.5;
          const gradient = ctx.createLinearGradient(0, 0, currentWidth, 0);
          gradient.addColorStop(0, `rgba(0, 0, 0, ${shadowAlpha})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, segmentWidth, pageHeight);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, segmentWidth, pageHeight);
          
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.strokeRect(0, 0, segmentWidth, pageHeight);
          
          ctx.restore();
        }
      } else {
        // Static page
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(5, 5, pageWidth, pageHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageWidth, pageHeight);
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, pageWidth, pageHeight);
      }
      
      ctx.restore();
      
      // Page corner curl hint
      if (!isFlipping && mouseX > rect.width / 2 + pageWidth / 2 - 60) {
        ctx.save();
        ctx.translate(centerX + 20 + pageWidth - 40, centerY - pageHeight / 2 + 20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
        ctx.restore();
      }
    };
    
    drawPage();
    
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      drawPage();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPage, isFlipping, flipProgress, mouseX]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    console.log('Canvas clicked at:', clickX, 'Center:', centerX);
    
    if (clickX > centerX) {
      flipToPage('next');
    } else {
      flipToPage('prev');
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const centerX = rect.width / 2;
    
    console.log('Canvas touched at:', touchX, 'Center:', centerX);
    
    if (touchX > centerX) {
      flipToPage('next');
    } else {
      flipToPage('prev');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('brochure.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('brochure.subtitle')}
          </p>
        </div>

        {/* Brochure Canvas */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl mx-auto mb-12"
          onMouseMove={handleMouseMove}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onTouchStart={handleTouchStart}
            width={1024}
            height={600}
            className="w-full h-[600px] cursor-pointer rounded-lg shadow-2xl"
            style={{ 
              background: '#1a1a1a', 
              touchAction: 'manipulation',
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />
          
          {/* Page Info Overlay */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full pointer-events-none">
            <p className="text-white font-semibold">
              {pages[currentPage]?.title}
            </p>
            <p className="text-gray-400 text-sm text-center">
              {t('brochure.pageCount', { current: currentPage + 1, total: totalPages })}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <button
            onClick={() => flipToPage('prev')}
            disabled={currentPage === 0 || isFlipping}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('brochure.previous')}
          </button>
          
          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx !== currentPage && !isFlipping) {
                    setCurrentPage(idx);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentPage 
                    ? 'bg-yellow-500 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => flipToPage('next')}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {t('brochure.next')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Page Details */}
        <div className="max-w-3xl mx-auto bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <h3 className="text-2xl font-bold text-white mb-3">
            {pages[currentPage]?.title}
          </h3>
          <p className="text-gray-400 mb-6">
            {pages[currentPage]?.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-center"
            >
              View Products
            </Link>
            <Link
              href="/checkout"
              className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-center"
            >
              Request Quote
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Expert Craftsmanship</h4>
            <p className="text-gray-400">Professional installation and modifications by experienced technicians</p>
          </div>
          
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Quality Guarantee</h4>
            <p className="text-gray-400">Premium parts and accessories with guaranteed satisfaction</p>
          </div>
          
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Fast Turnaround</h4>
            <p className="text-gray-400">Quick and efficient service without compromising quality</p>
          </div>
        </div>
      </div>
    </section>
  );
};

