import React from 'react';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';

interface TypographyProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
  lang?: 'en' | 'ar' | 'ur';
}

export function Typography({ variant, children, className = '', lang = 'en' }: TypographyProps) {
  const base = lang === 'ar' || lang === 'ur' ? 'font-arabic' : 'font-body';
  const variants = {
    display: "font-display text-5xl font-bold md:text-7xl",
    h1: "font-heading text-4xl font-bold md:text-5xl",
    h2: "font-heading text-3xl font-semibold md:text-4xl",
    h3: "font-heading text-2xl font-semibold md:text-3xl",
    body: "text-base md:text-lg",
    small: "text-sm",
    caption: "text-xs text-tx-secondary",
  };
  
  const Tag = (variant === 'body' || variant === 'small' || variant === 'caption') ? 'p' : (variant === 'display' ? 'h1' : variant) as any;
  return <Tag className={`${base} ${variants[variant]} ${className}`}>{children}</Tag>;
}
