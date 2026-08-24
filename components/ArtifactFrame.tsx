import Image from "next/image";

/**
 * Ornamental double-ruled frame with interlocking corner clamps, drawn to
 * the design supplied in the brief. Four-fold rotational symmetry: each
 * corner carries one vertical and one horizontal clamp pair that bridges
 * the gap between the two rules and overshoots the inner one.
 *
 * The photo well sits inside the inner rule; leave `image` unset and the
 * parchment shows through as an empty plate.
 */
export default function ArtifactFrame({
  image,
  alt,
}: {
  image?: string;
  alt?: string;
}) {
  return (
    <div className="relative aspect-square w-full">
      {/* Photo well — clipped to just inside the inner rule */}
      <div className="absolute inset-[9%] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={alt ?? ""}
            fill
            sizes="(max-width: 640px) 90vw, 30vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        role="presentation"
        focusable="false"
      >
        <g
          stroke="var(--ink)"
          strokeWidth="2.8"
          strokeLinecap="butt"
        >
          <rect x="4" y="4" width="192" height="192" />
          <rect x="14" y="14" width="172" height="172" />
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <path d="M30 4 V25 M36 4 V25" />
              <path d="M4 30 H25 M4 36 H25" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
