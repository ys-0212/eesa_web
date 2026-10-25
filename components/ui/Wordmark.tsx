import Image from 'next/image';
import { site } from '@/src/content';

/**
 * Brand wordmark. Uses `site.logo` when provided, otherwise sets the brand name in the script face.
 * `fill` mode renders an SVG <text> stretched to the container width (footer giant wordmark).
 */
export function Wordmark({ className = '', fill = false }: { className?: string; fill?: boolean }) {
  if (site.logo) {
    return <Image src={site.logo.src} alt={site.brand} width={site.logo.width} height={site.logo.height} className={className} priority={!fill} />;
  }
  if (fill) {
    return (
      <svg viewBox="0 0 1440 330" className={className} role="img" aria-label={site.brand} preserveAspectRatio="xMidYMax meet">
        <text
          x="720"
          y="250"
          textAnchor="middle"
          textLength="1360"
          lengthAdjust="spacingAndGlyphs"
          className="fill-ink font-script"
          style={{ fontSize: 380, fontWeight: 400, stroke: 'currentColor', strokeWidth: 10, strokeLinejoin: 'round' }}
        >
          {site.brand}
        </text>
      </svg>
    );
  }
  return (
    <span className={`font-script leading-none tracking-[-0.01em] text-ink [-webkit-text-stroke:0.035em_currentColor] ${className}`}>{site.brand}</span>
  );
}
