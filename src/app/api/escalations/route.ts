import { NextResponse } from "next/server";

import { getEscalations } from "@/lib/escalations";

export async function GET() {
  return NextResponse.json({ cases: getEscalations() });
}
