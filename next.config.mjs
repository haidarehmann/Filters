/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/(^(?:(?!bar).)*$)',
        has: [{
          type: 'cookie',
          key: 'utm_source',
          value: 'bar',

        }],
        destination: '/foo/bar',
        permanent: true
      }
    ]
  }
}
export default nextConfig;
