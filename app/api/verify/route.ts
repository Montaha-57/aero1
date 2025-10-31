import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request){
  const { code, pin, clerk } = await req.json();
  if (pin !== process.env.ADMIN_PIN) return NextResponse.json({ ok:false, reason:"forbidden" },{status:403});

  const { data, error } = await supabase.from("coupons").select("*").eq("code", code).single();
  if (error || !data) return NextResponse.json({ ok:false, reason:"not_found" },{status:404});

  if (data.status === "redeemed") return NextResponse.json({ ok:true, status:"redeemed", redeemed_at: data.redeemed_at });

  await supabase.from("coupons").update({
    status: "redeemed", redeemed_at: new Date().toISOString(), redeemed_by: clerk || "staff"
  }).eq("id", data.id);

  return NextResponse.json({ ok:true, status:"redeemed" });
}
