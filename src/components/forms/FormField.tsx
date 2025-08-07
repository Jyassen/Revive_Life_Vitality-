'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  className?: string
  rows?: number
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  options,
  className = '',
  rows = 3
}) => {
  const baseInputStyles = `
    w-full px-4 py-3 rounded-lg border bg-white text-brand-dark
    placeholder-brand-brown/60 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-brand-brown/50 focus:border-brand-brown
    ${error 
      ? 'border-red-300 bg-red-50' 
      : 'border-brand-brown/30 hover:border-brand-brown/50'
    }
  `

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputStyles}
            required={required}
          >
            <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputStyles}
            required={required}
            rows={rows}
          />
        )
      
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputStyles}
            required={required}
            autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : name}
          />
        )
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-brand-dark">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField