'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import Button from '@/components/ui/Button'

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
})

type ContactFormData = z.infer<typeof contactFormSchema>

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(formData)
      
      // TODO: Replace with actual API call when backend is ready
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Form submitted:', validatedData)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const formattedErrors: Partial<Record<keyof ContactFormData, string>> = {}
        error.errors.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof ContactFormData] = err.message
          }
        })
        setErrors(formattedErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 bg-brand-green-light/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark mb-3">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or want to learn more? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
          {submitSuccess ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your message has been received. We&apos;ll get back to you soon!</p>
              <Button 
                variant="secondary" 
                size="md" 
                className="mt-6"
                onClick={() => setSubmitSuccess(false)}
                ariaLabel="Send another message"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green-light focus:border-brand-green transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green-light focus:border-brand-green transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green-light focus:border-brand-green transition-colors ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                ariaLabel="Send message"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
            <p className="text-gray-600">support@revivelife.com</p>
          </div>
          
          <div>
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
            <p className="text-gray-600">(800) 555-VITA</p>
          </div>
          
          <div>
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Social Media</h3>
            <p className="text-gray-600">@ReviveLifeVitality</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 