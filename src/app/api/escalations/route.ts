import { NextRequest, NextResponse } from "next/server";

import { getEscalations } from "@/lib/escalations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || undefined;

  return NextResponse.json({ cases: getEscalations(role) });
}
