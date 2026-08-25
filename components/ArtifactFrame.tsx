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
  focus,
}: {
  image?: string;
  alt?: string;
  focus?: string;
}) {
  return (
    <div className="relative aspect-square w-full">
      {/* Photo well — set inside the reach of the corner clamps (which run to
          12.5%) so the frame never crops into the artwork, leaving a thin
          parchment mat between the inner rule and the print. */}
      <div className="absolute inset-[12.5%] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={alt ?? ""}
            fill
            sizes="(max-width: 767px) 200px, 180px"
            style={focus ? { objectPosition: focus } : undefined}
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
          strokeWidth="4"
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
