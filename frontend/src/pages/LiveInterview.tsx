import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Info } from "lucide-react";
import type { AnswerSource, InterviewQuestion, InterviewSessionInfo } from "../types/interview";
import { endInterview, getInterview, submitAnswer } from "../services/interviewService";
import { useCountdown } from "../hooks/setCountdown";
import InterviewHeader from "../components/interview/InterviewHeader";
import QuestionProgress from "../components/interview/QuestionProgress";
import QuestionCard from "../components/interview/QuestionCard";
import AnswerPanel from "../components/interview/AnswerPanel";

export default function LiveInterview() {
  const { sessionId } = useParams();
  const id = Number(sessionId);
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSessionInfo | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<AnswerSource>("TYPED");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    getInterview(id)
      .then((res) => {
        // No question means this interview is already finished
        if (!res.question) {
          navigate(`/results/${id}`, { replace: true });
          return;
        }
        setSession(res.session);
        setQuestion(res.question);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load this interview. Please go back and try again."
        )
      );
  }, [id, navigate]);

  async function submit() {
    if (!question || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const res = await submitAnswer(id, {
        questionId: question.id,
        text: answer.trim(),
        source: mode,
      });
      if (res.nextQuestion) {
        setQuestion(res.nextQuestion);
        setAnswer("");
        setMode("TYPED");
      } else {
        navigate(`/results/${id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't submit your answer. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const remaining = useCountdown(question?.timeLimitSeconds ?? 0, question?.id ?? 0, submit);

  async function handleEnd() {
    if (!window.confirm("End this interview now? Your answers so far will be scored.")) return;
    try {
      await endInterview(id);
      navigate(`/results/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't end the interview. Please try again.");
    }
  }

  if (!session || !question) {
    return (
      <p className={"p-6 text-sm " + (error ? "text-[var(--bad)]" : "text-[var(--muted)]")}>
        {error || "Loading…"}
      </p>
    );
  }

  return (
    <>
      <InterviewHeader
        context={`${session.role}, ${session.type}, ${question.difficulty}`}
        onEnd={handleEnd}
      />
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-5 pb-8 pt-7">
        <QuestionProgress current={question.number} total={question.total} remaining={remaining} />

        {question.difficultyNote && (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]">
            <Info size={15} className="mt-px shrink-0 text-[var(--accent)]" />
            {question.difficultyNote}
          </p>
        )}

        <QuestionCard text={question.text} isFollowUp={question.isFollowUp} />

        <AnswerPanel
          key={question.id}
          mode={mode}
          onModeChange={setMode}
          answer={answer}
          onAnswerChange={setAnswer}
          onSubmit={submit}
          canSubmit={answer.trim().length > 0 && !submitting}
          submitting={submitting}
          error={error}
        />
      </main>
    </>
  );
}