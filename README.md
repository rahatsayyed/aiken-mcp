# Aiken MCP Server

A Model Context Protocol (MCP) server providing tools and documentation for the Aiken programming language. This server enables AI assistants to access Aiken's standard library documentation, language tour, and module implementations.

## Features

- **Language Tour**: Brief metadata about Aiken docs and syntax
- **Standard Library**: Functions and types for Aiken's standard library
- **Module Source**: Complete source code implementation for specific Aiken stdlib modules

## Development

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Running Locally

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. The server will be available at [http://localhost:3000](http://localhost:3000)

## MCP Server Setup

This server can be configured as an MCP server in various AI assistants and IDEs. Below are the different methods to connect to this server.

### Method 1: Remote Server with Direct URL

For remote deployments, configure your MCP client to connect via HTTP/SSE:

```json
{
  "mcpServers": {
    "aiken": {
      "type": "http",
      "url": "https://your-deployment-url.com/mcp"
    }
  }
}
```

### Method 2: Using mcp-remote Package

The [mcp-remote](https://www.npmjs.com/package/mcp-remote) package allows you to connect MCP clients that only support stdio to remote MCP servers over HTTP.

```json
{
  "mcpServers": {
    "aiken": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-deployment-url.com/mcp"]
    }
  }
}
```

### Method 3: Claude Desktop Configuration

Add to your Claude Desktop configuration file (`claude_desktop_config.json`):

**For remote server:**

```json
{
  "mcpServers": {
    "aiken": {
      "url": "https://your-deployment-url.com/mcp"
    }
  }
}
```

## Configuration Options

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any required environment variables here
```

## Available Tools

Once configured, the following tools will be available to your AI assistant:

- `languageTour`: Get brief metadata about Aiken docs and syntax
- `stdlib`: Access functions and types for Aiken's standard library
- `stdlib-module`: Fetch complete source code for specific Aiken stdlib modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
