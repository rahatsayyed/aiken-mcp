import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/app/supabase";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse("OK", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  console.log("Received token request");

  const formData = await request.formData();
  const grant_type = formData.get("grant_type") as string;
  const code = formData.get("code") as string;
  const redirect_uri = formData.get("redirect_uri") as string;
  const client_id = formData.get("client_id") as string;
  const client_secret = formData.get("client_secret") as string | null;
  const code_verifier = formData.get("code_verifier") as string | undefined;

  console.log("Form data:", { grant_type, code, redirect_uri, client_id });

  if (grant_type !== "authorization_code") {
    console.log("Unsupported grant type:", grant_type);
    return NextResponse.json(
      { error: "Unsupported grant type" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  if (!code || !redirect_uri || !client_id) {
    console.log("Invalid request: missing parameters");
    return NextResponse.json(
      { error: "Invalid request" },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  try {
    console.log("Finding client for client_id:", client_id);
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("client_id", client_id)
      .single();
    if (!client || clientError) {
      console.log("Invalid client.", { client_id, error: clientError });
      return NextResponse.json(
        { error: "Invalid client" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    console.log("Finding auth code:", code);
    const { data: authCode, error: authCodeError } = await supabase
      .from("auth_codes")
      .select("*")
      .eq("code", code)
      .single();
    if (
      !authCode ||
      authCodeError ||
      authCode.client_id !== client.id ||
      authCode.redirect_uri !== redirect_uri
    ) {
      console.log("Invalid code or redirect_uri mismatch.", {
        authCode,
        client_id: client.id,
        redirect_uri,
        error: authCodeError,
      });
      return NextResponse.json(
        { error: "Invalid code" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
    console.log("Found auth code for user:", authCode.user_id);

    if (new Date(authCode.expires_at) < new Date()) {
      console.log("Auth code expired at:", authCode.expires_at);
      return NextResponse.json(
        { error: "Code expired" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
    console.log("Auth code is valid.");

    // PKCE validation
    let pkceValid = false;
    if (authCode.code_challenge) {
      if (!code_verifier) {
        return NextResponse.json(
          { error: "Missing code_verifier for PKCE" },
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }
      if (authCode.code_challenge_method === "S256") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const hash = require("crypto")
          .createHash("sha256")
          .update(code_verifier)
          .digest();
        const base64url = hash
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
        pkceValid = base64url === authCode.code_challenge;
      } else if (
        authCode.code_challenge_method === "plain" ||
        !authCode.code_challenge_method
      ) {
        pkceValid = code_verifier === authCode.code_challenge;
      }
      if (!pkceValid) {
        return NextResponse.json(
          { error: "Invalid code_verifier for PKCE" },
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }
    }

    // If PKCE is not present or not valid, require client secret for confidential clients
    if (
      !authCode.code_challenge &&
      client.client_secret &&
      client.client_secret !== client_secret
    ) {
      console.log("Invalid client_secret.", { client_id });
      return NextResponse.json(
        { error: "Invalid client" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Delete the auth code so it can't be used again
    console.log("Deleting auth code:", authCode.id);
    await supabase.from("auth_codes").delete().eq("id", authCode.id);
    console.log("Auth code deleted.");

    const accessToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    console.log("Creating access token for user:", authCode.user_id);
    await supabase.from("access_tokens").insert({
      token: accessToken,
      expires_at: expiresAt.toISOString(),
      client_id: client.id,
      user_id: authCode.user_id,
    });
    console.log("Access token created.");

    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (e) {
    console.error("Error in token endpoint:", e);
    return NextResponse.json(
      { error: "Server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
