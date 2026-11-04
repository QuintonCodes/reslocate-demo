export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
};

export type UICard = {
  title: string;
  status: string;
  color: "green" | "yellow" | "red";
  actionLink?: string;
  actionText?: string;
};

export type Escalation = {
  responder: string;
  reason: string;
  message: string;
  learnerName: string;
  learnerId?: number;
  createdAt?: string;
};
