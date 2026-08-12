import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const error = request.nextUrl.searchParams.get("error");

    if (error) {
        return NextResponse.json(
            {
                success: false,
                error: `Yahoo authorization failed: ${error}`,
            },
            { status: 400 }
        );
    }

    if (!code) {
        return NextResponse.json(
            {
                success: false,
                error: "Yahoo did not return an authorization code.",
            },
            { status: 400 }
        );
    }

    const clientId = process.env.YAHOO_CLIENT_ID;
    const clientSecret = process.env.YAHOO_CLIENT_SECRET;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return NextResponse.json(
            {
                success: false,
                error: "Yahoo environment variables are missing.",
            },
            { status: 500 }
        );
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            {
                success: false,
                error: "You must be signed in to connect Yahoo.",
            },
            { status: 401 }
        );
    }

    const credentials = Buffer.from(
        `${clientId}:${clientSecret}`
    ).toString("base64");

    const tokenResponse = await fetch(
        "https://api.login.yahoo.com/oauth2/get_token",
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
                code,
            }),
            cache: "no-store",
        }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
        console.error("Yahoo token exchange failed.");

        return NextResponse.json(
            {
                success: false,
                error: "Yahoo token exchange failed.",
            },
            { status: tokenResponse.status }
        );
    }

    const accessToken =
        typeof tokenData.access_token === "string"
            ? tokenData.access_token
            : "";

    const refreshToken =
        typeof tokenData.refresh_token === "string"
            ? tokenData.refresh_token
            : "";

    const expiresIn =
        typeof tokenData.expires_in === "number"
            ? tokenData.expires_in
            : Number(tokenData.expires_in ?? 3600);

    if (!accessToken || !refreshToken) {
        return NextResponse.json(
            {
                success: false,
                error: "Yahoo did not return the required tokens.",
            },
            { status: 500 }
        );
    }

    const expiresAt = new Date(
        Date.now() + expiresIn * 1000
    ).toISOString();

    const admin = createAdminClient();

    const {
        data: existingConnection,
        error: lookupError,
    } = await admin
        .from("yahoo_connections")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (lookupError) {
        return NextResponse.json(
            {
                success: false,
                error: "Unable to check the existing Yahoo connection.",
            },
            { status: 500 }
        );
    }

    if (existingConnection) {
        const { error: updateError } = await admin
            .from("yahoo_connections")
            .update({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingConnection.id);

        if (updateError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to update the Yahoo connection.",
                },
                { status: 500 }
            );
        }
    } else {
        const { error: insertError } = await admin
            .from("yahoo_connections")
            .insert({
                user_id: user.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: expiresAt,
                updated_at: new Date().toISOString(),
            });

        if (insertError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to save the Yahoo connection.",
                },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({
        success: true,
        message: "The Gefe Gazette successfully connected to Yahoo.",
    });
}