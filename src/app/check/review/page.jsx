import Header from "@/components/HeaderStart";
import Link from "next/link";

export const metadata = { title: "Urgent Care Needed • Curebbear" };

export default function ResultUrgent() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Header />

      <section className="mx-auto w-full max-w-[720px] px-4 pt-16">
        <h1 className="text-[28px] leading-[34px] md:text-[33px] md:leading-[48px] font-bold text-[#0F172A]">
          Urgent Care Needed
        </h1>

        <p className="mt-4 text-[16px] leading-[26px] text-[#334155]">
          Based on your answers, please seek immediate medical attention.
        </p>
        <p className="mt-4 text-[16px] leading-[26px] text-[#475569]">
          This tool does not provide emergency services. Contact your local
          emergency number.
        </p>

        <Link
          href="/check/symptom-checker"
          className="mt-8 inline-flex h-[40px] md:h-[48px] w-[75%] items-center justify-center rounded-[8px] px-12 md:px-16
             text-sm md:text-base font-semibold text-white shadow-sm hover:opacity-95
             focus:outline-none focus:ring-2 focus:ring-[#DD5124]/30"
          style={{ backgroundColor: "#DD5124" }}
        >
          Restart Symptom Checker
        </Link>

        <p className="mx-auto mt-6 max-w-[800px] text-center text-[13px] leading-[20px] text-[#4A739C]">
          Disclaimer: This app is for informational purposes only and does not
          provide medical advice.
          <br className="hidden sm:block" />
          Always consult a healthcare professional for diagnosis and treatment.
        </p>
      </section>
    </main>
  );
}
