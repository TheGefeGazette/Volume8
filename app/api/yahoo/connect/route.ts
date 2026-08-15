import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.redirect(
            new URL("/offices/login", process.env.YAHOO_REDIRECT_URI)
        );
    }

    const clientId = process.env.YAHOO_CLIENT_ID;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            {
                success: false,
                error: "Yahoo environment variables are missing.",
            },
            { status: 500 }
        );
    }

    const state = randomBytes(32).toString("hex");

    const authorizationUrl = new URL(
        "https://api.login.yahoo.com/oauth2/request_auth"
    );

    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authorizationUrl);

    response.cookies.set("yahoo_oauth_state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 600,
        path: "/",
    });

    return response;
}