import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request){
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin");
  if (pin !== process.env.ADMIN_PIN) return NextResponse.json({ok:false},{status:403});

  const { data, error } = await supabase.rpc("export_joined_csv");
  if (error) return NextResponse.json({ ok:false }, { status: 500 });

  return new NextResponse((data as any) ?? "", {
    headers: {
      "Content-Type":"text/csv; charset=utf-8",
      "Content-Disposition":"attachment; filename=results.csv"
    }
  });
}
