import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // autres options ici si besoin
}

// Plugin PWA
export default withPWA({
    ...nextConfig,
    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true,
    },
})
