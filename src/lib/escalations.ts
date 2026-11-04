import type { Escalation } from "./types";

const escalations: Escalation[] = [];

export function addEscalation(escalation: Escalation) {
  // Prevent duplicate spamming of the exact same query in the app's memory
  const exists = escalations.some(
    (e) =>
      e.message === escalation.message &&
      e.learnerName === escalation.learnerName,
  );

  if (!exists) {
    escalations.unshift({ ...escalation, createdAt: new Date().toISOString() });
  }
}

export function getEscalations(role?: string) {
  if (!role) return escalations;
  return escalations.filter((e) => e.responder === role);
}
