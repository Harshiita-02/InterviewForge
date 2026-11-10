import { useState } from "react";
import type { ScorePoint } from "../../types/progress";
import SegmentedControl from "../ui/SegmentedControl";
import Section from "../ui/Section";
import { formatSessionDate } from "../../utils/dashboard";

type Range = "5" | "10" | "all";
const RANGES: Range[] = ["5", "10", "all"];
const RANGE_LABEL: Record<Range, string> = { "5": "Last 5", "10": "Last 10", all: "All time" };

const X0 = 36;
const X1 = 458;
const Y_TOP = 10;
const Y_BOTTOM = 150;

function TrendChart({ points }: { points: ScorePoint[] }) {
  const values = points.map((p) => p.score);
  const yMin = Math.min(40, Math.floor(Math.min(...values) / 10) * 10);
  const yMid = (yMin + 100) / 2;

  const x = (i: number) => X0 + ((X1 - X0) * i) / (points.length - 1);
  const y = (v: number) => Y_BOTTOM - ((v - yMin) / (100 - yMin)) * (Y_BOTTOM - Y_TOP);

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${Y_BOTTOM} L${x(0).toFixed(1)},${Y_BOTTOM} Z`;
  const radius = points.length > 12 ? 2.5 : 3.5;

  return (
    <svg
      viewBox="0 0 470 176"
      className="block h-auto w-full"
      role="img"
      aria-label="Line chart of your interview scores over time"
    >
      {[100, yMid, yMin].map((tick) => (
        <g key={tick}>
          <line x1={X0} x2={X1} y1={y(tick)} y2={y(tick)} stroke="var(--border)" strokeWidth={1} />
          <text x={X0 - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">
            {tick}
          </text>
        </g>
      ))}

      <path d={area} fill="var(--accent)" fillOpacity={0.12} />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth={2}
            strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <circle
          key={p.sessionId}
          cx={x(i)}
          cy={y(p.score)}
          r={i === points.length - 1 ? radius + 1 : radius}
          fill="var(--accent)"
        >
          <title>{`${formatSessionDate(p.completedAt)}: ${p.score}%`}</title>
        </circle>
      ))}

      <text x={X0 - 8} y={170} textAnchor="start" fontSize={11} fill="var(--muted)">
        {formatSessionDate(points[0].completedAt)}
      </text>
      <text x={X1 + 8} y={170} textAnchor="end" fontSize={11} fill="var(--muted)">
        {formatSessionDate(points[points.length - 1].completedAt)}
      </text>
    </svg>
  );
}

export default function ScoreTrend({ scores }: { scores: ScorePoint[] }) {
  const [range, setRange] = useState<Range>("10");
  const points = range === "all" ? scores : scores.slice(-Number(range));

  return (
    <Section
      title="Score trend"
      action={
        <SegmentedControl
          compact
          options={RANGES}
          value={range}
          onChange={setRange}
          getLabel={(r) => RANGE_LABEL[r]}
        />
      }
    >
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 pb-2 pt-3.5">
        {points.length < 2 ? (
          <p className="py-10 text-center text-[13px] text-[var(--muted)]">
            Complete at least two interviews to see your trend.
          </p>
        ) : (
          <TrendChart points={points} />
        )}
      </div>
    </Section>
  );
}