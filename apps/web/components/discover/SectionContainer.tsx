import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionContainer({ children, className = '', id }: SectionContainerProps) {
  return (
    <section id={id} className={`bg-[#111118] p-6 md:p-[24px] rounded-[18px] mb-[40px] shadow-sm overflow-hidden ${className}`}>
      {children}
    </section>
  );
}
