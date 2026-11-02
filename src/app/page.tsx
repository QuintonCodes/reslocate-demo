"use client";

import {
  ArrowUp,
  GraduationCap,
  Mail,
  PlusCircle,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

type UICard = {
  title: string;
  status: string;
  color: "green" | "yellow" | "red";
  actionLink?: string;
  actionText?: string;
};

type Message = { role: "learner" | "agent"; text: string; card?: UICard };

const starter: Message[] = [
  {
    role: "agent",
    text: "Welcome to Reslocate. I’m here to help you understand your funding status. What would you like to know?",
  },
];

function readChatHistory(): Message[] {
  if (typeof window === "undefined") return starter;

  const savedChat = localStorage.getItem("reslocate_chat_history");
  if (!savedChat) return starter;

  try {
    return JSON.parse(savedChat) as Message[];
  } catch (error) {
    console.error("Failed to parse chat history from local storage.", error);
    return starter;
  }
}

export default function Home() {
  const [messages, setMessages] = useState(readChatHistory);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  // User Authentication State
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("reslocate_user_email") ?? "";
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("reslocate_user_name") ?? "";
  });

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Save chat history to local storage whenever messages update
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("reslocate_chat_history", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  function startNewChat() {
    localStorage.removeItem("reslocate_chat_history");
    setMessages(starter);
  }

  async function handleUserSwitch() {
    const input = window.prompt("Please enter your registered email address:");
    if (!input || !input.trim()) return;

    const testEmail = input.trim();
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmail(testEmail);
        setUserName(data.name);
        localStorage.setItem("reslocate_user_email", testEmail);
        localStorage.setItem("reslocate_user_name", data.name);
        startNewChat(); // Clear previous user's chat history
      } else {
        alert("Could not find an account registered with that email.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while verifying the email.");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      alert("Please log in by clicking the user profile in the header first.");
      return handleUserSwitch();
    }

    const message = value.trim();
    if (!message || loading) return;

    setValue("");
    setMessages((items) => [...items, { role: "learner", text: message }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass the current message AND the existing chat history
        body: JSON.stringify({ message, email }),
      });
      const result = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessages((items) => [
        ...items,
        {
          role: "agent",
          text: result.reply || "I was unable to process that message.",
          card: result.card, // Inject the UI card if it exists
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <GraduationCap />
            </div>
            <div>
              <p className="text-sm font-semibold">Reslocate</p>
              {isMounted && (
                <button
                  onClick={handleUserSwitch}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  title="Click to switch user"
                >
                  {email
                    ? `Logged in as ${userName}`
                    : "Click to identify yourself"}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {isMounted && messages.length > 1 && (
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                <PlusCircle /> New chat
              </button>
            )}
            <Link
              className="text-sm text-slate-600 hover:text-slate-950"
              href="/staff"
            >
              Staff dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col px-5 py-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-700">
            Private learner support
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Pathway Assistant
          </h1>
          <p className="mt-2 text-slate-600">
            Ask about your funding, registration, or next step.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {isMounted &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-3 ${message.role === "learner" ? "justify-end" : ""}`}
              >
                {message.role === "agent" && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
                    <GraduationCap />
                  </div>
                )}

                <div className="flex flex-col max-w-[85%] gap-2">
                  <div
                    className={`px-4 py-3 text-[15px] leading-6 ${
                      message.role === "learner"
                        ? "rounded-2xl rounded-br-sm bg-slate-950 text-white"
                        : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>

                  {/* Dynamic UI Card Rendering */}
                  {message.card && (
                    <div
                      className={`rounded-xl border p-4 shadow-sm ${
                        message.card.color === "green"
                          ? "border-green-200 bg-green-50"
                          : message.card.color === "yellow"
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <h4 className="text-sm font-semibold text-slate-900">
                        {message.card.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-700">
                        System Status:{" "}
                        <span className="font-medium capitalize">
                          {message.card.status}
                        </span>
                      </p>
                      {message.card.actionLink && (
                        <a
                          href={message.card.actionLink}
                          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <Mail /> {message.card.actionText}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {message.role === "learner" && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600">
                    <UserRound />
                  </div>
                )}
              </div>
            ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="grid size-8 place-items-center rounded-full bg-blue-100 text-blue-700">
                <GraduationCap />
              </div>
              <span aria-live="polite">typing...</span>
            </div>
          )}
        </div>

        <form
          onSubmit={submit}
          className="mt-8 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          <input
            aria-label="Your question"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type your question..."
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            disabled={loading}
          />
          <button
            aria-label="Send question"
            className="grid size-10 place-items-center rounded-xl bg-slate-950 text-white disabled:opacity-40"
            disabled={loading || !value.trim()}
          >
            <ArrowUp />
          </button>
        </form>
      </section>
    </main>
  );
}
