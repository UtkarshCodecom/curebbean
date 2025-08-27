import Header from "@/components/HeaderStart";
import Link from "next/link";

export const metadata = { title: "Start Symptom Check • Curebbear" };

export default function StartScreen() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Header />

      {/* centered hero */}
      <section className="grid min-h-[calc(100dvh-64px)] place-items-center px-4">
        {/* moved up with negative margin */}
        <div className="w-full max-w-[720px] text-center -mt-12 md:-mt-20">
          <h1 className="text-[28px] leading-[34px] font-extrabold text-[#0F172A] md:text-[44px] md:leading-[52px]">
            Start Symptom Check
          </h1>

          <p className="mx-auto mt-3 max-w-[640px] text-[15px] leading-[24px] text-[#64748B] md:text-[16px] md:leading-[26px]">
            This is not a diagnostic tool. Consult a doctor for medical advice.
          </p>

          {/* larger button + more top margin */}
          <Link
            href="/check/symptom-checker"
            className="mt-8 inline-flex h-14 md:h-16 items-center justify-center rounded-[10px] px-14 md:px-16 text-[18px] font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#DD5124]/30"
            style={{ backgroundColor: "#DD5124" }}
          >
            Start
          </Link>

          <div className="mt-5 text-[14px] leading-[20px] text-[#5B7FA6]">
            Coming Soon – Private Beta
          </div>
        </div>
      </section>
    </main>
  );
}
