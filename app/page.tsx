// app/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Contacts from "@/components/sections/Contacts";
import InView from "@/components/InView";
import Terms from "@/components/sections/Terms";
import AdvantagesBento from "@/components/sections/AdvantagesBento";
import Portfolio from "@/components/sections/Portfolio";
import { getRuCopy } from "@/lib/copy";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm text-current/70">
        Заглушка. Сюда позже вынесем отдельный компонент секции.
      </p>
    </div>
  );
}

export default function HomePage() {
  const copy = getRuCopy();
  return (
    <>
      <Header copy={copy} />
      <InView />

      <main>
        <section id="hero">
          {/* ✅ измени только это */}
          <Hero copy={copy} />
        </section>

        <section id="terms">
        <Terms copy={copy} />
        </section>

        <section id="production">
          <About copy={copy} />
        </section>

        <AdvantagesBento copy={copy} />

        <section id="portfolio">
          <Portfolio copy={copy} />
        </section>

        <section id="contacts">
          <Contacts copy={copy} />
        </section>
      </main>

      <Footer copy={copy} />
    </>
  );
}
