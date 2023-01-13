/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
});

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['spirit-dev.s3.eu-west-2.amazonaws.com'],
    },
};

module.exports = withPWA(nextConfig);
