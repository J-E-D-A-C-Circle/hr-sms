import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.MNOTIFY_API_KEY;

  if (!apiKey || apiKey === "your_mnotify_api_key_here") {
    return NextResponse.json({
      success: false,
      error: "mNotify API key is not configured in .env.local",
      balance: null
    });
  }

  try {
    const response = await fetch(`https://api.mnotify.com/api/balance/sms?key=${apiKey}`, {
      cache: "no-store"
    });

    const data = await response.json();

    if (data && (data.balance !== undefined || data.credit !== undefined || data.status === "success")) {
      const balanceVal = Number(data.balance ?? data.credit ?? data.sms_balance ?? 0);
      return NextResponse.json({
        success: true,
        balance: balanceVal,
        provider: "mNotify Ghana Enterprise API Gateway"
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.error || data.message || "Invalid API response from mNotify",
        balance: null
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to connect to mNotify API",
      balance: null
    });
  }
}
