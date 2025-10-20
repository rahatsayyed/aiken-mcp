import AiCodeReviews from "./bento/aiCodeReviews"
import RealtimeCodingPreviews from "./bento/realTimePreviews"
import OneClickIntegrationsIllustration from "./bento/oneClickIntegrations"
import MCPConnectivityIllustration from "./bento/mcpConnectivity" // Updated import
import EasyDeployment from "./bento/easyDeployment"
import ParallelCodingAgents from "./bento/parallelAgents" // Updated import

interface BentoCardProps {
  title: string
  description: string
  Component: React.ComponentType
}

const BentoCard = ({ title, description, Component }: BentoCardProps) => (
  <div className="overflow-hidden rounded-2xl border border-white/20 flex flex-col justify-start items-start relative">
    {/* Background with blur effect */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(231, 236, 235, 0.08)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative -mt-0.5 z-10">
      <Component />
    </div>
  </div>
)

export function BentoSection() {
  const cards = [
    {
      title: "Language Tour Access",
      description: "Get comprehensive Aiken syntax and documentation metadata.",
      Component: AiCodeReviews,
    },
    {
      title: "Standard Library Docs",
      description: "Access complete functions and types from Aiken's stdlib.",
      Component: RealtimeCodingPreviews,
    },
    {
      title: "Module Source Code",
      description: "Fetch full implementation of any Aiken stdlib module.",
      Component: OneClickIntegrationsIllustration,
    },
    {
      title: "MCP Protocol Support",
      description: "Built on Model Context Protocol for seamless AI integration.",
      Component: MCPConnectivityIllustration, // Updated component
    },
    {
      title: "Multiple Connection Methods",
      description: "Connect via HTTP, SSE, or stdio with mcp-remote package.",
      Component: ParallelCodingAgents, // Updated component
    },
    {
      title: "Easy Deployment",
      description: "Deploy to Vercel or run locally with simple configuration.",
      Component: EasyDeployment,
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              Powerful MCP Integration
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Access Aiken&apos;s documentation, standard library, and module source code directly through your AI assistant.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
