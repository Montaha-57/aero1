"use client";
import { useEffect, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

export default function QuizPage(){
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(()=>{
    const handler = (e: any) => setToken(e.detail);
    window.addEventListener("cf-token", handler as any);
    return () => window.removeEventListener("cf-token", handler as any);
  },[]);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Decode the Mission</h2>

      <form
        onSubmit={async (e)=>{ 
          e.preventDefault(); setLoading(true);
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const payload: any = Object.fromEntries(fd.entries());
          payload.answers = { q1: payload.q1, q2: payload.q2, q3: payload.q3, q4: payload.q4, q5: payload.q5 };
          delete payload.q1; delete payload.q2; delete payload.q3; delete payload.q4; delete payload.q5;
          const res = await fetch("/api/submit",{method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({...payload, captchaToken: token})});
          const data = await res.json(); setLoading(false);
          if(data.success) setCoupon(data.coupon); else alert(data.reason || "Error");
        }}
        className="space-y-4"
      >
        {/* الأسئلة */}
        <fieldset className="space-y-2">
          <label>Q1: What does “C” stand for in GNC?</label>
          <select name="q1" required className="w-full bg-white/10 p-2 rounded">
            <option value="">اختر</option>
            <option>Coffee</option><option>Control</option><option>Calculator</option>
          </select>
        </fieldset>

        <fieldset className="space-y-2">
          <label>Q2: Which part of GNC tells the system where it is?</label>
          <select name="q2" required className="w-full bg-white/10 p-2 rounded">
            <option value="">اختر</option>
            <option>Guidance</option><option>Navigation</option><option>Control</option>
          </select>
        </fieldset>

        <fieldset className="space-y-2">
          <label>Q3: GNC systems are used in</label>
          <select name="q3" required className="w-full bg-white/10 p-2 rounded">
            <option value="">اختر</option>
            <option>Rockets</option><option>Drones</option><option>Both</option>
          </select>
        </fieldset>

        <fieldset className="space-y-2">
          <label>Q4: Unscramble → T O N C R O L</label>
          <input name="q4" required placeholder="Type the word" className="w-full bg-white/10 p-2 rounded"/>
        </fieldset>

        <fieldset className="space-y-2">
          <label>Q5: True or False: Coffee improves GNC performance</label>
          <select name="q5" required className="w-full bg-white/10 p-2 rounded">
            <option value="">اختر</option>
            <option>True</option><option>False</option>
          </select>
        </fieldset>

        <fieldset className="space-y-2">
          <label>Will you be part of the launch event (Nov 12)?</label>
          <select name="intent" className="w-full bg-white/10 p-2 rounded">
            <option>Of course, free knowledge (and coffee)</option>
            <option>I'll try to make it</option>
            <option>Not sure yet</option>
          </select>
        </fieldset>

        {/* معلومات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="name" required placeholder="الاسم" className="bg-white/10 p-2 rounded"/>
          <input type="email" name="email" required placeholder="الإيميل" className="bg-white/10 p-2 rounded"/>
          <input name="phone" required placeholder="الجوال" className="bg-white/10 p-2 rounded"/>
        </div>

        {/* Turnstile */}
        <Turnstile siteKey={siteKey}/>

        <button disabled={loading} className="w-full py-3 rounded bg-white/20 hover:bg-white/30">
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </form>

      {coupon && (
        <div className="p-4 rounded border border-white/20 text-center">
          <div className="text-lg">🎉 مبروك! هذا كوبون القهوة:</div>
          <div className="text-3xl font-mono tracking-widest mt-2">{coupon}</div>
          <p className="opacity-80 mt-2">أُرسل إلى بريدك أيضاً.</p>
        </div>
      )}
    </main>
  );
}

function Turnstile({siteKey}:{siteKey:string}){
  return (
    <>
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="dark"
        data-callback="onTurnstile" />
      <script dangerouslySetInnerHTML={{__html:`
        window.onTurnstile = function(token){ window.dispatchEvent(new CustomEvent('cf-token',{detail:token})); }
      `}} />
    </>
  );
}
