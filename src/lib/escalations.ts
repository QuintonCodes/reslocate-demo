import type { Escalation } from "./pipeline";

const escalations: Escalation[] = [];

export function addEscalation(escalation: Escalation) {
  escalations.unshift({ ...escalation, createdAt: new Date().toISOString() });
}

export function getEscalations() {
  return escalations;
}
