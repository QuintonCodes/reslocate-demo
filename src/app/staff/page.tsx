"use client";

import LoginModal from "@/components/login-modal";
import { User } from "@/lib/types";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  LogOut,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

type CaseItem = {
  id?: number;
  learnerId: number;
  message: string;
  responder: string;
  reason: string;
  learnerName: string;
  createdAt?: string;
  type?: "standard" | "lease";
};

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function StaffPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data, mutate, isValidating } = useSWR<{ cases: CaseItem[] }>(
    user ? `/api/escalations?role=${user.role}` : null,
    fetcher,
  );

  const cases = useMemo(() => data?.cases ?? [], [data]);

  // Simulate logging a view when a user logs in and sees cases
  useEffect(() => {
    if (user && cases.length > 0) {
      cases.forEach((c) => {
        fetch("/api/escalations/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            staffId: user.id,
            learnerId: c.learnerId,
            action: "viewed_record",
            details: "Opened escalated record on dashboard",
          }),
        });
      });
    }
  }, [user, cases]);

  async function handleAction(caseItem: CaseItem, decision: string) {
    if (!user) return;
    setActionLoading(`${caseItem.learnerId}-${decision}`);

    try {
      await fetch("/api/escalations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: user.id,
          learnerId: caseItem.learnerId,
          action: "decision",
          details: decision,
        }),
      });
      // Optimistically clear the case or refresh
      mutate();
      alert("Decision logged securely to audit_log.");
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  function logout() {
    setUser(null);
    setShowLogin(true);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <LoginModal
          isOpen={showLogin}
          closable={false}
          defaultTab="staff"
          onSuccess={(u) => {
            if (u.role !== "learner") {
              setUser(u);
              setShowLogin(false);
            } else {
              alert("Unauthorized: Only staff can access this portal.");
            }
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <GraduationCap />
            </div>
            <div>
              <p className="text-sm font-semibold">Reslocate staff</p>
              <p className="text-xs text-slate-500">
                {user.name} • {user.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950"
            >
              <ArrowLeft /> Learner screen
            </Link>
            <button
              onClick={logout}
              className="flex cursor-pointer items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut /> Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              Human handoff
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Escalated cases
            </h1>
            <p className="mt-2 text-slate-600">
              Review cases the pathway service could not safely resolve.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={isValidating ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <ClipboardList /> {cases.length} open cases
            </div>
          </div>
        </div>
        {cases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No new handovers yet.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {cases.map((item, index) => (
              <article
                key={`${item.message}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <AlertTriangle /> {item.responder}
                    </span>
                    <span className="text-xs text-slate-500">
                      Learner: {item.learnerName}
                    </span>
                  </div>
                  <blockquote className="border-l-2 border-slate-300 pl-4 text-base leading-7 text-slate-800">
                    “{item.message}”
                  </blockquote>
                  <div className="mt-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Reason for escalation
                    </span>
                    <p className="mt-1 text-sm text-slate-700">{item.reason}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 md:w-64 md:border-l md:border-t-0 md:pl-5 justify-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                    Record Action
                  </p>

                  {user.role === "Funding Officer" && (
                    <>
                      <button
                        disabled={!!actionLoading}
                        onClick={() =>
                          handleAction(
                            item,
                            "Told learner to contact Financial Aid Office",
                          )
                        }
                        className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                      >
                        <CheckCircle2 /> Advise Financial Aid
                      </button>
                      <button
                        disabled={!!actionLoading}
                        onClick={() =>
                          handleAction(
                            item,
                            "Denied sharing unverified NSFAS data with landlord",
                          )
                        }
                        className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Deny Landlord Share
                      </button>
                    </>
                  )}

                  {user.role === "Compliance Officer" && (
                    <>
                      <button
                        disabled={!!actionLoading}
                        onClick={() =>
                          handleAction(
                            item,
                            "Flagged account for POPIA violation attempt",
                          )
                        }
                        className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        <AlertTriangle size={16} /> Flag Account
                      </button>
                      <button
                        disabled={!!actionLoading}
                        onClick={() =>
                          handleAction(
                            item,
                            "Issued formal privacy warning to user",
                          )
                        }
                        className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Issue Warning
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
