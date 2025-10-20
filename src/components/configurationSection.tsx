import { CodeBlock } from "./ui/code-block";

type ConfigType = {
  name: string;
  code: string;
  highlightLines: number[];
  language: "json";
};

export default function ConfigurationSection() {
  const configs: ConfigType[] = [
    {
      name: "Claude",
      language: "json",
      highlightLines: [2, 3, 8, 9],
      code: `// In Cluade_config.json
{
  "mcpServers": {
    "aiken": {
      "url": "https://your-deployment-url.com/mcp",
      "type": "http"
    }
  }
}`,
    },
    {
      name: "VS Code",
      language: "json",
      highlightLines: [2, 3, 8, 9],
      code: `// In settings.json
{
  "github.copilot.chat.mcpServer": {
    "aiken": {
      "url": "https://your-deployment-url.com/mcp",
      "type": "http"
    }
  }
}`,
    },
    {
      name: "Cursor",
      language: "json",
      highlightLines: [2, 3, 8, 9],
      code: `// In ~/.cursor/config.json
{
  "mcpServers": {
    "aiken": {
      "url": "https://your-deployment-url.com/mcp",
      "type": "http"
    }
  }
}`,
    },
    {
      name: "Windsurf",
      language: "json",
      highlightLines: [2, 3, 8, 9],
      code: `// In windsurf_config.json
{
  "mcpServers": {
    "aiken": {
      "url": "https://your-deployment-url.com/mcp",
      "type": "http"
    }
  }
}`,
    },
    {
      name: "MCP-Remote",
      language: "json",
      highlightLines: [2, 3, 8, 9],
      code: `// in mcpconfig
{
  "mcpServers": {
    "aiken": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-deployment-url.com/mcp"]
    }
  }
}`,
    },
  ];

  return (
    // <section className="py-24 bg-background">
    <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[50px] left-1/2 -translate-x-1/2 origin-top-left rotate-[33.39deg] bg-primary/10 blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 break-words">
            Easy Setup
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Configure Aiken MCP Server for your preferred IDE or tool
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-3xl mx-auto w-full">
            <CodeBlock language="jsx" filename="claude" tabs={configs} />
          </div>
        </div>
      </div>
    </section>
  );
}
