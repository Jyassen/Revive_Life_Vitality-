/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          },
          {
            key: 'Content-Security-Policy',
            // Note: Development may require 'unsafe-eval' and 'unsafe-inline' for Next.js dev overlay/react-refresh.
            // In production, both are omitted.
            value: [
              "default-src 'self'",
              // Allow Next dev websockets and APIs
              "connect-src 'self' https://sandbox.dev.clover.com https://api.clover.com ws: wss:",
              // Images, media
              "img-src 'self' data: blob:",
              // Styles from self; inline for Tailwind/Next dev overlay
              "style-src 'self' 'unsafe-inline'",
              // Scripts: Next.js emits small inline scripts for RSC/streaming; allow inline always, eval only in dev
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
              // Frames: allow Clover iframes when using hosted fields (sandbox + prod)
              'frame-src \"self\" https://sandbox.dev.clover.com https://api.clover.com',
              // Fonts
              "font-src 'self' data:",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig; 