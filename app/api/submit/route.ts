import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { grade, generateCoupon } from "@/lib/quiz";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

async function verifyTurnstile(token: string, ip?: string) {
  const form = new URLSearchParams();
  form.append("secret", process.env.TURNSTILE_SECRET_KEY!);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  const data = await r.json();
  return !!data.success;
}

export async function POST(req: Request) {
  const { name, email, phone, intent, answers, captchaToken } = await req.json();

  if (!captchaToken || !(await verifyTurnstile(captchaToken))) {
    return NextResponse.json({ success:false, reason:"captcha_failed" }, { status: 400 });
  }

  const result = grade(answers||{});
  // Upsert participant regardless
  const { data: p, error: perr } = await supabase.from("participants")
    .upsert({ email, name, phone }).select().single();
  if (perr || !p) return NextResponse.json({ success:false, reason:"db_error" }, { status: 500 });

  if (!result.passed) {
    await supabase.from("responses").insert({
      participant_id: p.id, q1: answers?.q1, q2: answers?.q2, q3: answers?.q3, q4: answers?.q4, q5: answers?.q5,
      intent, score: result.score, is_correct: false
    });
    return NextResponse.json({ success:false, reason:"wrong_answers" }, { status: 200 });
  }

  // Success path
  const { data: existing } = await supabase.from("coupons")
    .select("*").eq("participant_id", p.id).limit(1);
  const code = existing?.[0]?.code || generateCoupon();

  if (!existing?.length) {
    await supabase.from("coupons").insert({ participant_id: p.id, code });
  }

  await supabase.from("responses").insert({
    participant_id: p.id, q1: answers?.q1, q2: answers?.q2, q3: answers?.q3, q4: answers?.q4, q5: answers?.q5,
    intent, score: 5, is_correct: true
  });

  // send email
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: "Your Coffee Coupon ☕🚀",
        html: `<p>مبروك! هذا كوبونك: <b style="font-family:monospace">${code}</b></p>`
      });
    } catch {}
  }

  return NextResponse.json({ success:true, coupon: code });
}
