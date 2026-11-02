import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const db = new Database("../database/reslocate_mock.db", {
      readonly: true,
    });
    const user = db
      .prepare(
        `SELECT first_name, last_name FROM learners WHERE lower(email) = lower(?)`,
      )
      .get(email.toLowerCase()) as
      | { first_name: string; last_name: string }
      | undefined;

    db.close();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ name: `${user.first_name} ${user.last_name}` });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
