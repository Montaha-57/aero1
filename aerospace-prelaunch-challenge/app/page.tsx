import Starfield from "@/components/Starfield";

export default function Landing(){
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <Starfield/>
      <section className="relative z-10 max-w-2xl p-6 text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          🌠 Embark on the Pre-Launch Challenge!
        </h1>
        <p className="opacity-90 leading-8">
          Before we ascend into the fascinating realm of Aerospace Engineering, here’s your chance to ignite your curiosity.
          Complete this brief challenge to test your insight, showcase your passion for the skies, and earn a free coffee reward:
          because every great mission begins with the right fuel. ☕🚀
        </p>
        <a href="/quiz" className="inline-block rounded-lg px-6 py-3 bg-white/10 hover:bg-white/20 transition
          shadow-[0_0_25px_rgba(255,255,255,0.1)]">Continue</a>
      </section>
    </main>
  );
}
