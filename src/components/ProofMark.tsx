interface ProofMarkProps {
  size?: number;
  className?: string;
  color?: string;
  animated?: boolean;
}

export default function ProofMark({
  size = 28,
  className = '',
  color = '#C8F169',
  animated = false,
}: ProofMarkProps) {
  return (
    <svg
      id="skillproof-proof-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none transition-transform duration-300 ${animated ? 'animate-pulse' : ''} ${className}`}
      aria-label="SkillProof Motif: Evidence, Skill, Proof"
    >
      {/* Three stacked lines ending in a check mark:
          Top line 1 (Evidence)
          Middle line 2 (Skill)
          Bottom line 3 sweeping into Check mark (Proof) */}
      <line
        x1="5"
        y1="9"
        x2="19"
        y2="9"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="16"
        x2="15"
        y2="16"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <path
        d="M5 23H13L17.5 27.5L27 6.5"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
