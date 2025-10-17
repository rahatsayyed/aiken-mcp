import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { supabase } from '@/app/supabase';
import { NextRequest } from 'next/server';

// Authentication helper
async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  console.log('[MCP] Auth header present:', !!authHeader);
  
  if (!authHeader) {
    console.log('[MCP] No auth header, returning 401');
    return null;
  }

  const token = authHeader.split(' ')[1];
  console.log('[MCP] Token extracted:', token ? 'present' : 'missing');
  
  if (!token) {
    console.log('[MCP] No token, returning 401');
    return null;
  }

  try {
    console.log('[MCP] Looking up access token in database');
    const { data: accessToken } = await supabase
      .from('access_tokens')
      .select('*')
      .eq('token', token)
      .single();

    console.log('[MCP] Access token found:', !!accessToken);
    
    if (!accessToken) {
      console.log('[MCP] No access token found, returning 401');
      return null;
    }

    console.log('[MCP] Token expires at:', accessToken.expires_at);
    console.log('[MCP] Current time:', new Date());
    
    if (new Date(accessToken.expires_at) < new Date()) {
      console.log('[MCP] Token expired, returning 401');
      return null;
    }

    console.log('[MCP] Authentication successful');
    return accessToken;
  } catch (e) {
    console.error('[MCP] Error validating token:', e);
    return null;
  }
}

// MCP handler with authentication
const handler = async (req: Request) => {
  // Inject authentication here
  const nextReq = req as unknown as NextRequest; // for type compatibility
  const accessToken = await authenticateRequest(nextReq);
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Log request body
  const requestBody = await req.clone().json().catch(() => null);
  console.log('[MCP] Request body:', requestBody);

  return createMcpHandler(
    (server) => {
      server.tool(
        "add_numbers",
        "Adds two numbers together and returns the sum",
        {
          a: z.number().describe("First number to add"),
          b: z.number().describe("Second number to add"),
        },
        async ({ a, b }) => {
          return {
            content: [
              {
                type: "text",
                text: `The sum of ${a} and ${b} is ${a + b}`,
              },
            ],
          };
        }
      );
    },
    {
      // Optionally add server capabilities here
    },
    {
      basePath: "/",
      verboseLogs: true,
      redisUrl: process.env.REDIS_URL,
    }
  )(req);
};

export { handler as GET, handler as POST };

// CORS preflight handler
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
} 
