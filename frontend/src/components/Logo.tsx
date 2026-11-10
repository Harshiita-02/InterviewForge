interface LogoProps {
  tagline: string;
}

export default function Logo({ tagline }: LogoProps) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-2 flex flex-col items-center leading-none">
        <span className="text-2xl text-[var(--auth-blue)]">🎓</span>
        <span className="text-[26px] font-medium tracking-tighter">
          <span className="text-[var(--auth-navy)]">I</span>
          <span className="text-[var(--auth-blue)]">F</span>
        </span>
      </div>
      <h1 className="text-[22px] font-medium">
        <span className="text-[var(--auth-navy)]">Interview</span>
        <span className="text-[var(--auth-blue)]">Forge</span>
      </h1>
      <p className="mt-1 text-sm text-[var(--auth-muted)]">{tagline}</p>
    </div>

    
  );
}