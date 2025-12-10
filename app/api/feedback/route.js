import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, message, email } = await req.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Send to Discord
    const discordPayload = {
      embeds: [
        {
          title: "📝 New Feedback Received",
          color: 0x10b981, // emerald-500
          fields: [
            {
              name: "👤 Name",
              value: name,
              inline: true,
            },
            {
              name: "📧 Email",
              value: email || "Not provided",
              inline: true,
            },
            {
              name: "💬 Message",
              value: message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "VoiceFlow Feedback System",
          },
        },
      ],
    };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordRes.ok) {
      throw new Error(`Discord webhook failed: ${discordRes.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
