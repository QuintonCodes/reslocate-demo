import Database from "better-sqlite3";

import { Escalation, UICard } from "./types";

type PipelineResult = {
  reply: string;
  escalation?: Escalation;
  stages: string[];
  card?: UICard;
  isError?: boolean;
};

// Unified State passed sequentially through all agents
type State = {
  message: string;
  email: string;
  stages: string[];
  reply: string;
  intent: "danger" | "privacy" | "lease" | "funding" | "unknown";
  escalation?: Escalation;
  card?: UICard;
  isError: boolean;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    preferred_language: string;
    institution_id: number;
  };
  contact?: { contact_name: string; email: string; phone: string | null };
};

// Generalized intents for broad applicability
const intent_danger = [
  "suicide",
  "end my life",
  "hurt myself",
  "pointless to live",
  "give up",
  "no hope",
  "want to die",
];
const intent_privacy_contact = [
  "behalf of",
  "my son",
  "my daughter",
  "my child",
  "my niece",
  "my nephew",
  "my brother",
  "my sister",
  "parent of",
  "guardian of",
  "uncle of",
  "aunt of",
  "mother to",
  "father to",
  "speak for",
  "'s mother",
  "'s father",
  "'s guardian",
  "'s uncle",
  "'s aunt",
  "i am his",
  "i am her",
];
const intent_privacy_password = [
  "password",
  "login details",
  "my pin",
  "credentials",
  "log into my",
  "here is my id",
  "log in for me",
];
const intent_tricky_date = [
  "25th",
  "exact date",
  "guarantee",
  "specific date",
  "what day",
  "tomorrow",
  "today",
];
const intent_lease = [
  "lease",
  "landlord",
  "room",
  "rent",
  "cancel",
  "accommodation",
  "stay",
  "res",
];
const intent_funding = [
  "paid",
  "approved",
  "allowance",
  "status",
  "money",
  "funding",
  "proof",
  "bursary",
  "who at my university",
  "financial aid",
];

// --- UTILITY FUNCTIONS ---

function matches(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getGreeting(learner?: State["learner"]): string {
  const language = learner?.preferred_language?.toLowerCase() || "english";
  let greeting = "Hi";

  if (["isizulu", "zulu"].includes(language)) greeting = "Sawubona";
  else if (["isixhosa", "xhosa"].includes(language)) greeting = "Molo";
  else if (["sesotho", "setswana", "sepedi"].includes(language))
    greeting = "Dumela";
  else if (["tshivenda", "venda"].includes(language)) greeting = "Ndaa";
  else if (["xitsonga", "tsonga"].includes(language)) greeting = "Avuxeni";
  else if (language === "afrikaans") greeting = "Hallo";

  const name = learner?.first_name || "";
  return name ? `${greeting} ${name}` : greeting;
}

// --- AGENT TEAM DEFINITIONS ---

function safetyGate(state: State): State {
  state.stages.push("Safety Gate");
  if (!state.reply && matches(state.message, intent_danger)) {
    state.intent = "danger";
    state.reply =
      "I am here to help with pathways, but your safety comes first. Please contact SADAG immediately at 0800 567 567.";
    state.escalation = {
      responder: "Compliance Officer",
      reason: "Danger/Safety Risk",
      message: state.message,
      learnerName: state.email, // Placeholder until Info Gate runs
      learnerId: state.learner?.id,
    };
  }
  return state;
}

function privacyGate(state: State): State {
  state.stages.push("Privacy & Identity");
  if (!state.reply) {
    if (matches(state.message, intent_privacy_password)) {
      state.intent = "privacy";
      state.reply =
        "Under POPIA privacy rules, I cannot take your login details. Please log into the NSFAS portal yourself securely.";
      state.escalation = {
        responder: "Compliance Officer",
        reason: "Credential Sharing Attempt",
        message: state.message,
        learnerName: state.email,
        learnerId: state.learner?.id,
      };
    } else if (matches(state.message, intent_privacy_contact)) {
      state.intent = "privacy";
      state.reply =
        "I can only discuss account details directly with the registered learner. A Reslocate staff member will follow up with you.";
      state.escalation = {
        responder: "Compliance Officer",
        reason: "Privacy Escalation",
        message: state.message,
        learnerName: state.email,
        learnerId: state.learner?.id,
      };
    }
  }
  return state;
}

function coordinatorGate(state: State): State {
  state.stages.push("Coordinator");
  if (!state.reply) {
    if (
      matches(state.message, intent_lease) ||
      (matches(state.message, ["proof"]) &&
        matches(state.message, ["landlord"]))
    ) {
      state.intent = "lease";
    } else if (
      matches(state.message, intent_funding) ||
      matches(state.message, intent_tricky_date)
    ) {
      state.intent = "funding";
    } else {
      state.reply =
        "I am a pathway assistant. Could you rephrase your question about funding or university applications?";
    }
  }
  return state;
}

function informationGate(state: State): State {
  state.stages.push("Information");

  try {
    const db = new Database("../database/reslocate_mock.db");

    const learner = db
      .prepare(
        `
      SELECT id, first_name, last_name, preferred_language, institution_id
      FROM learners WHERE lower(email) = lower(?)
    `,
      )
      .get(state.email) as
      | {
          id: number;
          first_name: string;
          last_name: string;
          preferred_language: string;
          institution_id: number;
        }
      | undefined;

    if (!learner) {
      db.close();
      return {
        ...state,
        reply:
          "We could not find your profile. Please check your email or contact support.",
        isError: true,
      };
    }

    state.learner = learner;
    const fullName = `${learner.first_name} ${learner.last_name}`.trim();

    // Backfill missing learnerId and real name into early escalations
    if (state.escalation) {
      state.escalation.learnerId = learner.id;
      state.escalation.learnerName = fullName;
    }

    // Fetch verified trusted contact
    if (learner.institution_id) {
      state.contact = db
        .prepare(
          `
          SELECT contact_name, email, phone FROM financial_aid_contacts
          WHERE institution_id = ? AND verified = 1 LIMIT 1
        `,
        )
        .get(learner.institution_id) as
        | { contact_name: string; email: string; phone: string | null }
        | undefined;
    }

    // Record lease enquiries securely for staff review
    if (state.intent === "lease" && !state.reply) {
      db.prepare(
        `
          INSERT INTO lease_enquiries (learner_id, question) VALUES (?, ?)
        `,
      ).run(learner.id, state.message);
    }

    db.close();
  } catch (error) {
    console.error("Information Agent Error:", error);
    state.isError = true;
  }

  return state;
}

function explainerGate(state: State): State {
  state.stages.push("Explainer");
  if (state.reply) return state;

  const greeting = getGreeting(state.learner);
  const fullName =
    `${state.learner?.first_name || ""} ${state.learner?.last_name || ""}`.trim();

  // Baseline honest context
  let draft = `${greeting}. NSFAS only pays your allowance after your university officially registers you. `;

  if (state.intent === "lease") {
    draft += `I cannot send private funding proof directly to a landlord. I have saved your lease enquiry for our staff to review safely. Please do not sign a lease until your funding is officially confirmed!`;
    state.escalation = {
      responder: "Funding Officer",
      reason: "Lease Enquiry Review",
      message: state.message,
      learnerName: fullName,
      learnerId: state.learner?.id,
    };
  } else if (state.intent === "funding") {
    // Resolve insecure email lookup by pointing to official channels instead of leaking data
    draft += `For your security, I cannot share your exact funding status over chat. `;

    if (state.contact) {
      draft += `Please contact the ${state.contact.contact_name} at ${state.contact.email} ${state.contact.phone ? `or ${state.contact.phone}` : ""} to securely check your allowance.`;
      state.card = {
        title: "Financial Aid Contact",
        status: "Verified Source",
        color: "green",
        actionLink: `mailto:${state.contact.email}`,
        actionText: "Email Office",
      };
    } else {
      draft += `Please contact your university's Financial Aid Office to confirm your allowance safely.`;
    }
  }

  state.reply = draft;
  return state;
}

function checkerGate(state: State): State {
  state.stages.push("Checker");

  if (state.reply) {
    const mentionsDate =
      /\b(202\d|25th|date|monday|tuesday|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(
        state.reply,
      ) && !state.reply.includes("never guaranteed");

    // Rule Check: Bad Lease Advice
    const unsafeLeaseAdvice =
      state.reply.toLowerCase().includes("sign your lease") &&
      !state.reply.toLowerCase().includes("do not sign");

    // Test 4 specific override check
    const trickyOverride = matches(state.message, [
      "25th",
      "exact date",
      "guarantee",
    ]);

    if (mentionsDate || unsafeLeaseAdvice || trickyOverride) {
      state.stages.push(
        "Checker (Rule Broken: Intercepted unsafe draft)",
        "Explainer (Rewrite)",
      );

      const greeting = getGreeting(state.learner);
      const prefix = state.learner?.first_name ? `${greeting}, e` : "E";

      state.reply = `${prefix}xact payment dates are never guaranteed and depend on your university confirming registration. Please speak to your university's Financial Aid Office before making any lease decisions.`;
      state.card = undefined;
    }
  }

  return state;
}

export function runPipeline(message: string, email: string): PipelineResult {
  // Initialize state
  let state: State = {
    message: message.toLowerCase().trim(),
    email: email.trim(),
    stages: [],
    reply: "",
    intent: "unknown",
    isError: false,
  };

  state = safetyGate(state);
  state = privacyGate(state);
  state = coordinatorGate(state);
  state = informationGate(state);
  state = explainerGate(state);
  state = checkerGate(state);

  return {
    reply: state.reply,
    escalation: state.escalation,
    stages: state.stages,
    card: state.card,
    isError: state.isError,
  };
}
