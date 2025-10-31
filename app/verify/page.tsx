"use client";
import Starfield from "../components/Starfield";
export default function Verify(){
  const [msg,setMsg] = useState(""); 
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">تحقّق كوبون</h2>
      <form onSubmit={async e=>{
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const res = await fetch("/api/verify",{method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(Object.fromEntries(fd.entries()))});
        const data = await res.json();
        setMsg(data.ok ? "✅ Coupon redeemed" : "❌ " + (data.reason||"Error"));
      }} className="space-y-3">
        <input name="code" required placeholder="الكود" className="w-full bg-white/10 p-2 rounded"/>
        <input name="pin" type="password" required placeholder="PIN" className="w-full bg-white/10 p-2 rounded"/>
        <input name="clerk" placeholder="اسم الموظف (اختياري)" className="w-full bg-white/10 p-2 rounded"/>
        <button className="w-full py-2 bg-white/20 rounded">تأشير Redeemed</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
