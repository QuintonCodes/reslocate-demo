import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staffId, learnerId, action, details } = body;

    if (!staffId || !action) {
      return NextResponse.json(
        { error: "Staff ID and action are required." },
        { status: 400 },
      );
    }

    const db = new Database("../database/reslocate_mock.db");

    const stmt = db.prepare(
      `INSERT INTO audit_log (staff_id, action, learner_id, details) VALUES (?, ?, ?, ?)`,
    );

    stmt.run(staffId, action, learnerId || null, details || null);
    db.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audit Log Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
