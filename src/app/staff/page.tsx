"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

type CaseItem = {
  message: string;
  responder: string;
  reason: string;
  learnerName: string;
  createdAt?: string;
};
const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function StaffPage() {
  const { data, mutate, isValidating } = useSWR<{ cases: CaseItem[] }>(
    "/api/escalations",
    fetcher,
  );

  const cases = data?.cases ?? [];

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
              <p className="text-xs text-slate-500">Case 4 escalation desk</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft /> Learner screen
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-5 py-8">
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
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
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
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <AlertTriangle /> {item.responder}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.learnerName}
                  </span>
                </div>
                <blockquote className="border-l-2 border-slate-300 pl-4 text-lg leading-7 text-slate-800">
                  “{item.message}”
                </blockquote>
                <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Reason
                    </dt>
                    <dd className="mt-1 text-sm text-slate-700">
                      {item.reason}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-blue-700">
                      Open handover
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
