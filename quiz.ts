export const ANSWERS = {
  q1: "Control",
  q2: "Navigation",
  q3: "Both",
  q4: "CONTROL",
  q5: "True",
} as const;

export function grade(answers: Record<string,string>) {
  let score = 0;
  for (const k of Object.keys(ANSWERS) as (keyof typeof ANSWERS)[]) {
    if ((answers[k]||"").trim().toLowerCase() === ANSWERS[k].toLowerCase()) score++;
  }
  return { score, passed: score === 5 };
}

import { randomBytes } from "crypto";
export function generateCoupon(): string {
  return randomBytes(6).toString("base64url").toUpperCase().slice(0,8);
}
