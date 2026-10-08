import { NextRequest, NextResponse } from "next/server";
import { briefFormSchema, BriefApiResponse } from "@/types/brief";
import { STUDIO_CONFIG } from "@/content/studio";

// Simple in-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse<BriefApiResponse>> {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submissions from your connection. Please wait a few minutes or email us directly.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Honeypot Bot Trap Check
    if (body.botCheckField && body.botCheckField.trim() !== "") {
      // Silently accept bot submission without processing
      return NextResponse.json({
        success: true,
        message: "Your submission has been received.",
      });
    }

    // 2. Server-side Zod validation
    const validation = briefFormSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid form data";
      return NextResponse.json(
        {
          success: false,
          message: firstError,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const clientEmail = process.env.STUDIO_RECIPIENT_EMAIL || STUDIO_CONFIG.email;
    const resendApiKey = process.env.RESEND_API_KEY;

    // 3. Compose Email Content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0a0a0a; color: #f5f2ee; margin: 0; padding: 24px; }
            .card { background: #141414; border: 1px solid #2a2a2a; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e10600; padding-bottom: 16px; margin-bottom: 24px; }
            .badge { display: inline-block; background: #e10600; color: #fff; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; }
            h1 { font-size: 22px; margin: 12px 0 4px 0; color: #ffffff; }
            .field-row { margin-bottom: 16px; border-bottom: 1px solid #1f1f1f; padding-bottom: 12px; }
            .field-label { font-size: 12px; color: #8e8e93; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .field-value { font-size: 15px; color: #f5f2ee; line-height: 1.5; font-weight: 500; }
            .desc-box { background: #1a1a1a; padding: 16px; border-radius: 8px; border-left: 3px solid #e10600; margin-top: 6px; }
            .footer { font-size: 12px; color: #666; margin-top: 24px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">New Project Brief</span>
              <h1>${data.companyName} &mdash; ${data.fullName}</h1>
            </div>

            <div class="field-row">
              <div class="field-label">Contact Details</div>
              <div class="field-value">
                <strong>${data.fullName}</strong> &bull; <a href="mailto:${data.email}" style="color: #e10600;">${data.email}</a>
                ${data.phone ? `<br/>Phone: ${data.phone}` : ""}
                ${data.websiteOrSocial ? `<br/>Website / Social: <a href="${data.websiteOrSocial}" style="color: #8e8e93;">${data.websiteOrSocial}</a>` : ""}
              </div>
            </div>

            <div class="field-row">
              <div class="field-label">Requested Services</div>
              <div class="field-value">${data.services.join(", ")}</div>
            </div>

            <div class="field-row">
              <div class="field-label">Project Description</div>
              <div class="field-value desc-box">${data.projectDescription.replace(/\n/g, "<br/>")}</div>
            </div>

            <div class="field-row">
              <div class="field-label">Deliverables & References</div>
              <div class="field-value">
                ${data.deliverablesCount ? `Units / Deliverables: ${data.deliverablesCount}<br/>` : ""}
                ${data.referenceLinks ? `References: ${data.referenceLinks}` : "None provided"}
              </div>
            </div>

            <div class="field-row">
              <div class="field-label">Logistics</div>
              <div class="field-value">
                Budget: <strong>${data.budgetRange}</strong><br/>
                Timeline: <strong>${data.timeline}</strong>
                ${data.heardAboutUs ? `<br/>Referral Source: ${data.heardAboutUs}` : ""}
              </div>
            </div>

            <div class="footer">
              Submitted via Red Studios Project Brief Gateway &bull; ${new Date().toISOString()}
            </div>
          </div>
        </body>
      </html>
    `;

    // 4. Dispatch Email via Resend if API key is present
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // Send full brief to studio
        await resend.emails.send({
          from: "Red Studios Briefs <briefs@redstudios.com>", // [REPLACE ME with your verified Resend domain]
          to: clientEmail,
          subject: `[New Brief] ${data.companyName} (${data.fullName})`,
          html: emailHtml,
          replyTo: data.email,
        });

        // Send confirmation auto-reply to client
        await resend.emails.send({
          from: "Red Studios <hello@redstudios.com>", // [REPLACE ME with your verified Resend domain]
          to: data.email,
          subject: `We received your brief – Red Studios`,
          html: `
            <div style="font-family: sans-serif; background: #0a0a0a; color: #f5f2ee; padding: 32px; border-radius: 8px;">
              <h2 style="color: #e10600; margin-top: 0;">Thanks, ${data.fullName}!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #ccc;">
                We have received your project brief for <strong>${data.companyName}</strong>. Our creative directors and technical leads are reviewing your requirements and will reach back out within 24 hours with next steps.
              </p>
              <p style="font-size: 14px; color: #888; margin-top: 24px;">
                Direct inquiries: <a href="mailto:${clientEmail}" style="color: #e10600;">${clientEmail}</a>
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Resend delivery warning (check RESEND_API_KEY):", emailErr);
        // Continue returning success so visitor experience is graceful
      }
    } else {
      console.log("No RESEND_API_KEY found in .env. Form submission logged successfully:");
      console.log({
        client: data.companyName,
        contact: data.email,
        services: data.services,
        budget: data.budgetRange,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Thanks, ${data.fullName}! We'll get back to you within 24 hours.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    console.error("Brief API route error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please email us directly at " + STUDIO_CONFIG.email,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
