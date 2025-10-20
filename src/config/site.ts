export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Aiken MCP",
  description:
    "The modern MCP server for Aiken. Accelerate your development with AI assistants that understand your code.",
  url: "https://aiken-mcp.vercel.app",
  ogImage: "https://aiken-mcp.vercel.app/og.jpg",
  logo: {
    default: "/logo.png",
    light: "/logo-dark.png",
    dark: "/logo-light.png",
    typo: "/typo.webp",
  },
  links: {
    github: "https://github.com/rahatsayyed/aiken-mcp",
    docs: "https://github.com/rahatsayyed/aiken-mcp#readme",
    discord: "https://discord.gg/ub6atE94v4",
    aikenWebsite: "https://aiken-lang.org/",
    aikenTutorial: "https://aiken-lang.org/language-tour/hello-world",
    mcpProtocol: "https://modelcontextprotocol.io/",
    issues: "https://github.com/rahatsayyed/aiken-mcp/issues",
    license: "https://github.com/rahatsayyed/aiken-mcp/blob/main/LICENSE",
  },
  navItems: [
    {
      label: "Features",
      href: "#features",
    },
    // {
    //   label: "Pricing",
    //   href: "#pricing",
    // },
    {
      label: "Config",
      href: "#configuration",
    },
  ],
  footerLinks: {
    product: [
      {
        label: "Features",
        href: "#features",
      },
      {
        label: "Pricing",
        href: "#pricing",
      },
      {
        label: "Aiken Language",
        href: "https://aiken-lang.org/",
        external: true,
      },
    ],
    resources: [
      {
        label: "Documentation",
        href: "https://github.com/rahatsayyed/aiken-mcp#readme",
        external: true,
      },
      {
        label: "MCP Protocol",
        href: "https://modelcontextprotocol.io/",
        external: true,
      },
      {
        label: "Tutorial",
        href: "https://aiken-lang.org/language-tour/hello-world",
        external: true,
      },
    ],
    community: [
      {
        label: "GitHub",
        href: "https://github.com/rahatsayyed/aiken-mcp",
        external: true,
      },
      {
        label: "Discord",
        href: "https://discord.gg/ub6atE94v4",
        external: true,
      },
      {
        label: "Support",
        href: "https://github.com/rahatsayyed/aiken-mcp/issues",
        external: true,
      },
    ],
    legal: [
      {
        label: "License",
        href: "https://github.com/rahatsayyed/aiken-mcp/blob/main/LICENSE",
        external: true,
      },
      {
        label: "Contributing",
        href: "https://github.com/rahatsayyed/aiken-mcp/fork",
        external: true,
      },
    ],
  },
};
