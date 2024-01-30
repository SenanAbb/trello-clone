/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        // port: "",
        // pathname: "/wikipedia/en/thumb/8/8c/Trello_logo.svg/1280px-Trello_logo.svg.png",
      },
    ],
  },
  // Necesario para trabajar con react-beautiful-dnd que este en false
  reactStrictMode: false
};

export default nextConfig;
