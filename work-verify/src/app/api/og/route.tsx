"use server";

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const imageUrl = new URL("/verify-bot-profile.svg", request.url);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8fafc",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* Work Logo - Top Right */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            display: "flex",
          }}
        >
          <img src={"https://media.gib.work/work-logo.png"} width={65} />
        </div>

        {/* Main Content Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "60px",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "60px 80px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Bot Image */}
          <img
            src={imageUrl.toString()}
            width={180}
            height={180}
            tw="rounded-xl"
          />

          {/* Text Content */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "52px",
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Verify Bot
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#64748b",
                marginBottom: "32px",
              }}
            >
              Token-Gated Discord Roles
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#475569",
                marginBottom: "8px",
              }}
            >
              🔗 verify-bot.gib.work
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#475569",
                marginBottom: "8px",
              }}
            >
              📦 github.com/gibwork/verify-bot
            </div>
            <div style={{ fontSize: "18px", color: "#475569" }}>
              ⚡ Use /verify in Discord
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{ fontSize: "16px", color: "#94a3b8", marginTop: "24px" }}>
          Secure • Automated • Seamless
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 675,
    }
  );
}
