import Database from "better-sqlite3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = body.role; // "learner" or "staff"
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const secret =
      typeof body.secret === "string" ? body.secret.replace(/\s+/g, "") : "";

    if (!email || !secret) {
      return NextResponse.json(
        { error: "Email and credentials are required." },
        { status: 400 },
      );
    }

    const db = new Database("../database/reslocate_mock.db", {
      readonly: true,
    });

    let user;

    if (role === "learner") {
      // Require phone number to verify learner identity, not just email
      user = db
        .prepare(
          `SELECT id, first_name, last_name FROM learners WHERE lower(email) = ? AND replace(phone, ' ', '') = ?`,
        )
        .get(email, secret) as
        | { id: number; first_name: string; last_name: string }
        | undefined;

      if (user) {
        user = {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          role: "learner",
          email: email,
        };
      }
    } else if (role === "staff") {
      // Staff login using staff_users table
      user = db
        .prepare(
          `SELECT id, full_name, role FROM staff_users WHERE lower(email) = ? AND password = ? AND active = 1`,
        )
        .get(email, secret) as
        | { id: number; full_name: string; role: string }
        | undefined;

      if (user) {
        user = {
          id: user.id,
          name: user.full_name,
          role: user.role,
          email: email,
        };
      }
    } else {
      db.close();
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 },
      );
    }

    db.close();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or user not found." },
        { status: 401 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
