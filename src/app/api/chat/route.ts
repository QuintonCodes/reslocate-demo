import { NextRequest, NextResponse } from "next/server";

import { addEscalation } from "@/lib/escalations";
import { runPipeline } from "@/lib/pipeline";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json(
      { error: "Authentication required. Please provide an email." },
      { status: 401 },
    );
  }

  if (!message)
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );

  const result = runPipeline(message, email);

  if (result.escalation) addEscalation(result.escalation);

  return NextResponse.json(result);
}
