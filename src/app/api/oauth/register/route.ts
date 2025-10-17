import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/app/supabase";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { client_name, redirect_uris } = body;

  if (!client_name || !redirect_uris) {
    const response = NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  const clientSecret = randomBytes(32).toString("hex");

  try {
    const { data: newClient, error } = await supabase
      .from("clients")
      .insert({
        name: client_name,
        redirect_uris: redirect_uris,
        client_secret: clientSecret, // This should be hashed in a real app
        user_id: null, // Allow unauthenticated clients
      })
      .select()
      .single();

    if (error) {
      console.log("Error creating client", error);
      throw error;
    }

    const response = NextResponse.json({
      client_id: newClient.client_id,
      client_secret: clientSecret, // This is the only time the secret is sent
      redirect_uris: redirect_uris,
    });

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (e) {
    console.error(e);
    const response = NextResponse.json(
      { error: "Error creating client" },
      { status: 500 }
    );

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse("OK", { status: 200 });

  // Add CORS headers for preflight requests
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}
