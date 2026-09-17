import type { RenderedMathText } from "@/lib/math/render";

type RenderedMathTextProps = {
  segments: RenderedMathText;
  className?: string;
};

export function RenderedMathText({ segments, className }: RenderedMathTextProps) {
  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
        }

        return (
          <span
            className={segment.displayMode ? "my-2 block overflow-x-auto" : undefined}
            dangerouslySetInnerHTML={{ __html: segment.html }}
            key={`${segment.html}-${index}`}
          />
        );
      })}
    </span>
  );
}
