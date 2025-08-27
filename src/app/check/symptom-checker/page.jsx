"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import flowsData from "@/data/flows.json";
import { db, loginAnonymous } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

const OPTIONS = ["Yes", "No", "Not sure"];
const DISCLAIMER =
  "Disclaimer: This app is for informational purposes only and does not provide medical advice. Always consult a healthcare professional for diagnosis and treatment.";

export default function Checker() {
  const router = useRouter();
  const flows = flowsData?.flows || [];

  // stages: select → questions → redflag
  const [stage, setStage] = useState("select");
  const [disease, setDisease] = useState("");
  const current = useMemo(() => flows.find((f) => f.disease === disease), [flows, disease]);

  // state for Q&A
  const [qIndex, setQIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [qa, setQa] = useState([]); // [{ idx, text, answer }]
  const [redFlagChoice, setRedFlagChoice] = useState("");

  // firestore session
  const [sessionId, setSessionId] = useState(null);

  // keep anonymous auth (no PII)
  useEffect(() => { loginAnonymous().catch(() => {}); }, []);

  // when user selects a disease: reset + create session
  useEffect(() => {
    
    setQIndex(0);
    setChoice("");
    setQa([]);
    setRedFlagChoice("");
    setSessionId(null);

    if (!disease) { setStage("select"); return; }
    setStage("questions");

    (async () => {
      try {
        const ref = await addDoc(collection(db, "check_sessions"), {
          startedAt: serverTimestamp(),
          disease,
          stage: "questions",
          qIndex: 0,
          qa: [], // array of { idx, text, answer }
          redFlag: null, // { text, answer }
          outcome: null, // "red_flag" | "non_urgent"
          advice: null,  // { type, text, summary?, conditions? }
          ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
        });
        setSessionId(ref.id);
        console.log("session started", ref.id);
      } catch (e) {
        console.error("session create failed", e);
      }
    })();
  }, [disease]);

  function pick(opt) { setChoice(opt); }

  async function saveProgress(partial) {
    if (!sessionId) return;
    try {
      await updateDoc(doc(db, "check_sessions", sessionId), {
        ...partial,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("progress save failed", e);
    }
  }

  async function next() {
    if (stage === "questions") {
      if (!choice || !current) return;

      const text = current.questions[qIndex];
      const row = { idx: qIndex, text, answer: choice };
      // upsert into qa
      const nextQa = [...qa];
      nextQa[qIndex] = row;
      setQa(nextQa);
      setChoice("");

      const hasMore = qIndex + 1 < (current.questions?.length || 0);

      await saveProgress({
        qa: nextQa,
        qIndex: hasMore ? qIndex + 1 : qIndex,
      });

      if (hasMore) setQIndex(qIndex + 1);
      else {
        setStage("redflag");
        await saveProgress({ stage: "redflag" });
      }
      return;
    }

    // stage === "redflag"
    if (!redFlagChoice || !current) return;

    const redFlagText =
      current.redFlagText || "Do any of the following serious symptoms apply to you?";
    const isRed = redFlagChoice === "Yes";
    const outcome = isRed ? "red_flag" : "non_urgent";

    // prepare advice payload to store exactly what we’ll tell the user
    let advice = { type: outcome, text: "" };
    if (isRed) {
      advice.text = current.redFlagGuidance || "Seek immediate medical attention.";
    } else {
      advice.text = current.nonUrgentAdvice || "";
      if (current.summary) advice.summary = current.summary;
      if (current.nonUrgentConditions?.length) advice.conditions = current.nonUrgentConditions;
    }

    const target = isRed
      ? `/check/review?src=triage&d=${encodeURIComponent(disease)}`
      : `/check/non-urgent?d=${encodeURIComponent(disease)}`;

    // finalize session (save Q&A, redFlag Q&A, outcome, and advice)
    await saveProgress({
      redFlag: { text: redFlagText, answer: redFlagChoice },
      outcome,
      advice,
      stage: "done",
      completedAt: serverTimestamp(),
    });

    // optional lightweight audit log collection
    try {
      await addDoc(collection(db, "mvp_logs"), {
        ts: serverTimestamp(),
        sessionId,
        disease,
        qa, // full questions with answers
        redFlag: { text: redFlagText, answer: redFlagChoice },
        outcome,
        advice,
        dest: target,
      });
    } catch (e) {
      console.error("audit log failed", e);
    }

    // navigate (middleware will gate /check/** if needed)
    if (isRed) router.replace(target);
    else router.push(target);
  }

  // progress (questions only; last step is red flag)
  const progressPct = useMemo(() => {
    if (!current) return 0;
    const totalSteps = (current.questions?.length || 0) + 1; // + redflag
    const done = stage === "questions" ? qIndex : current.questions.length;
    return Math.round((done / totalSteps) * 100);
  }, [stage, qIndex, current]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-8">
      <section className="mx-auto w-full max-w-[900px]">
        {/* SELECT */}
        {stage === "select" && (
          <div className="mx-auto max-w-[680px] text-center">
            <h1 className="text-[24px] md:text-[32px] font-bold text-[#0F172A]">
              Select a Symptom Category
            </h1>
            <p className="mt-2 text-[14px] md:text-[15px] text-[#64748B]">
              We’ll ask a few quick questions.
            </p>
            <div className="mx-auto mt-6 max-w-[520px]">
              <select
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#DD5124]/20"
              >
                <option value="">Choose an option...</option>
                {flows.map((f) => (
                  <option key={f.disease} value={f.disease}>
                    {f.disease}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {stage === "questions" && current && (
          <div className="mx-auto max-w-[720px]">
            {/* progress */}
            <div className="mb-6">
              <div className="mb-2 text-sm text-[#111827]/70">
                Q{qIndex + 1} of {current.questions.length}
              </div>
              <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
                <div
                  className="h-2 rounded-full bg-[#1E2D7A]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <h2 className="mt-6 text-center text-[24px] md:text-[32px] font-extrabold text-[#0F172A]">
              {current.questions[qIndex]}
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className={`rounded-[10px] border px-4 py-2 text-[14px] ${
                    qa[qIndex]?.answer === opt || (qa[qIndex] == null && opt === "") || false
                      ? "bg-[#E8EEF3] border-[#94A3B8]"
                      : choice === opt
                      ? "bg-[#E8EEF3] border-[#94A3B8]"
                      : "border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={next}
              disabled={!choice}
              className="mt-8 inline-flex h-[48px] w-full max-w-[520px] items-center justify-center rounded-[10px] bg-[#DD5124] px-6 text-[15px] font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>

            <p className="mt-6 text-center text-[13px] leading-[20px] text-[#4A739C]">
              {DISCLAIMER}
            </p>
          </div>
        )}

        {/* RED FLAG */}
        {stage === "redflag" && current && (
          <div className="mx-auto max-w-[720px]">
            {/* progress at end */}
            <div className="mb-6">
              <div className="mb-2 text-sm text-[#111827]/70">Final red flag check</div>
              <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
                <div className="h-2 rounded-full bg-[#1E2D7A]" style={{ width: "100%" }} />
              </div>
            </div>

            <h2 className="mt-6 text-center text-[24px] md:text-[32px] font-extrabold text-[#0F172A]">
              Red flag check
            </h2>
            <p className="mt-3 text-center text-[15px] text-[#334155]">
              {current.redFlagText || "Do any of the following serious symptoms apply to you?"}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRedFlagChoice(opt)}
                  className={`rounded-[10px] border px-4 py-2 text-[14px] ${
                    redFlagChoice === opt
                      ? "bg-[#E8EEF3] border-[#94A3B8]"
                      : "border-[#E5E7EB] hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={next}
              disabled={!redFlagChoice}
              className="mt-8 inline-flex h-[48px] w-full max-w-[520px] items-center justify-center rounded-[10px] bg-[#DD5124] px-6 text-[15px] font-semibold text-white disabled:opacity-40"
            >
              See guidance
            </button>

            <p className="mt-6 text-center text-[13px] leading-[20px] text-[#4A739C]">
              {DISCLAIMER}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
