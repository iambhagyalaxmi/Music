import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
}

export function Carousel({ children }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Left Button */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-[#161A23] border border-[#262C3A] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl hover:bg-[#1D2230] hover:text-[#FF4D8D]"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 snap-x snap-mandatory scrollbar-hide pb-4 pt-2 px-1 -mx-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, child => (
          <div className="snap-start shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-[#161A23] border border-[#262C3A] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl hover:bg-[#1D2230] hover:text-[#FF4D8D]"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
