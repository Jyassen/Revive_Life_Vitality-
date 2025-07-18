'use client';

import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-brand-dark text-white hover:bg-brand-dark/90 focus:ring-brand-dark',
    secondary: 'bg-brand-green text-white hover:bg-brand-green/90 focus:ring-brand-green',
    outline: 'border border-brand-dark text-brand-dark hover:bg-brand-green hover:text-white focus:ring-brand-dark',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault(); // Prevent default spacebar scroll
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button; 