/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* Emits .next/standalone with only the modules actually reached, so the
     runtime image carries a few hundred files instead of the whole of
     node_modules. */
  output: "standalone",

  experimental: {
    serverActions: {
      /*
       * Server actions refuse a request whose `origin` does not match the host,
       * which is what stops a CSRF. Behind a reverse proxy the host Next sees is
       * whatever the proxy forwarded, and if that does not line up every action
       * on the site fails with "Invalid Server Actions request" — sign-in
       * included.
       *
       * Traefik normally forwards it correctly, so this is usually empty. Set
       * SERVER_ACTION_ORIGINS to a comma-separated host list if it is not.
       */
      allowedOrigins: (process.env.SERVER_ACTION_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    },
  },
};

module.exports = nextConfig;
