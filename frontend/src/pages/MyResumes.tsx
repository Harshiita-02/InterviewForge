import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Resume } from "../types/resume";
import { deleteResume, getResumes, uploadResume } from "../services/resumeService";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function usedText(count: number): string {
  if (count === 0) return "Not used yet";
  return count === 1 ? "Used in 1 interview" : `Used in ${count} interviews`;
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 20h16" />
    </svg>
  );
}

const outlineButton =
  "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--accent-soft)]";

export default function MyResumes() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    getResumes().then((data) => {
      setResumes(data);
      setLoading(false);
    });
  }, []);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Choose a PDF file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("That file is over 5 MB. Choose a smaller one.");
      return;
    }
    setError("");
    const created = await uploadResume(file);
    setResumes((prev) => [created, ...prev]);
  }

  async function handleDelete(id: number) {
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setConfirmId(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-xl font-medium text-[var(--text)]">My resumes</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Upload a resume to get questions based on your own experience.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`mt-6 rounded-xl border border-dashed px-4 py-8 text-center ${
          dragging
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <div className="flex justify-center text-[var(--muted)]">
          <UploadIcon />
        </div>
        <p className="mt-2 text-sm text-[var(--text)]">Drag a PDF here or choose a file</p>
        <p className="mt-1 text-xs text-[var(--muted)]">PDF only, up to 5 MB</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Upload resume
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {error && <p className="mt-3 text-sm text-[var(--bad)]">{error}</p>}
      </div>

      <p className="mt-8 mb-2 text-sm text-[var(--muted)]">
        Your resumes ({resumes.length})
      </p>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading your resumes…</p>
      ) : resumes.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-8 text-center">
          <p className="text-base font-medium text-[var(--text)]">Add your first resume</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Upload a PDF above and use it to get questions based on your own experience.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {resumes.map((resume, index) => (
            <div
              key={resume.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                index > 0 ? "border-t border-[var(--border)]" : ""
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--purple) 15%, transparent)",
                  color: "var(--purple)",
                }}
              >
                <FileIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text)]">
                  {resume.fileName}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Uploaded {formatDate(resume.uploadedAt)} · {resume.sizeKb} KB ·{" "}
                  {usedText(resume.interviewsUsed)}
                </p>
              </div>

              {confirmId === resume.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--bad)]">Delete this resume?</span>
                  <button type="button" onClick={() => setConfirmId(null)} className={outlineButton}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(resume.id)}
                    className="rounded-lg border border-[var(--bad)] px-3 py-1.5 text-sm text-[var(--bad)] hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/interview/setup", { state: { resumeId: resume.id } })
                    }
                    className={outlineButton}
                  >
                    Use in interview
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${resume.fileName}`}
                    onClick={() => setConfirmId(resume.id)}
                    className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] hover:bg-[var(--accent-soft)]"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}