import { RenderedMathText } from "@/components/rendered-math-text";
import type {
  RenderedQuizDiagramStimulus,
  RenderedQuizImageStimulus,
  RenderedQuizStimulus,
  RenderedQuizTableStimulus
} from "@/lib/quiz/types";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians)
  };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const startPoint = polarToCartesian(cx, cy, r, end);
  const endPoint = polarToCartesian(cx, cy, r, start);
  const largeArcFlag = Math.abs(end - start) <= 180 ? "0" : "1";

  return [
    "M",
    startPoint.x,
    startPoint.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    endPoint.x,
    endPoint.y
  ].join(" ");
}

function QuizTableStimulus({ stimulus }: { stimulus: RenderedQuizTableStimulus }) {
  return (
    <figure className="mt-5 rounded-[1.25rem] border border-slate-200 bg-white/50 p-4">
      <figcaption className="mb-3">
        <span className="block text-sm font-bold text-slate-900">{stimulus.title}</span>
        {stimulus.description ? (
          <span className="mt-1 block text-xs leading-5 text-slate-500">{stimulus.description}</span>
        ) : null}
      </figcaption>
      <div
        aria-label={`${stimulus.title} scrollable data`}
        className="overflow-x-auto"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <caption className="sr-only">{stimulus.title}</caption>
          <thead>
            <tr>
              {stimulus.columns.map((column) => (
                <th className="border border-slate-300 bg-slate-100 px-3 py-2 font-semibold text-slate-900" key={JSON.stringify(column)} scope="col">
                  <RenderedMathText segments={column} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stimulus.rows.map((row, rowIndex) => (
              <tr key={`${stimulus.title}-${rowIndex}`}>
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th className="border border-slate-300 px-3 py-2 font-medium text-slate-900" key={`${rowIndex}-${cellIndex}`} scope="row">
                      <RenderedMathText segments={cell} />
                    </th>
                  ) : (
                    <td className="border border-slate-300 px-3 py-2 text-slate-700" key={`${rowIndex}-${cellIndex}`}>
                      <RenderedMathText segments={cell} />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function QuizDiagramStimulus({ stimulus }: { stimulus: RenderedQuizDiagramStimulus }) {
  return (
    <figure className="mt-5 rounded-[1.25rem] border border-slate-200 bg-white/50 p-4">
      <figcaption className="mb-3">
        <span className="block text-sm font-bold text-slate-900">{stimulus.title}</span>
        {stimulus.description ? (
          <span className="mt-1 block text-xs leading-5 text-slate-500">{stimulus.description}</span>
        ) : null}
      </figcaption>
      <svg
        aria-label={stimulus.alt}
        className="h-auto w-full max-w-xl rounded-xl bg-white"
        role="img"
        viewBox={stimulus.viewBox.join(" ")}
      >
        {stimulus.elements.map((element, index) => {
          if (element.type === "line") {
            return (
              <line
                className="stroke-slate-800"
                key={`line-${index}`}
                strokeLinecap="round"
                strokeWidth="3"
                x1={element.x1}
                x2={element.x2}
                y1={element.y1}
                y2={element.y2}
              />
            );
          }
          if (element.type === "polygon") {
            return (
              <polygon
                className="fill-blue-50 stroke-slate-800"
                key={`polygon-${index}`}
                points={element.points.map((point) => point.join(",")).join(" ")}
                strokeLinejoin="round"
                strokeWidth="3"
              />
            );
          }
          if (element.type === "circle") {
            return (
              <circle
                className="fill-blue-50 stroke-slate-800"
                cx={element.cx}
                cy={element.cy}
                key={`circle-${index}`}
                r={element.r}
                strokeWidth="3"
              />
            );
          }
          if (element.type === "arc") {
            return (
              <path
                className="fill-none stroke-blue-700"
                d={arcPath(element.cx, element.cy, element.r, element.start, element.end)}
                key={`arc-${index}`}
                strokeLinecap="round"
                strokeWidth="3"
              />
            );
          }

          return (
            <text
              className="fill-slate-900 text-[13px] font-semibold"
              dominantBaseline="middle"
              key={`text-${index}`}
              textAnchor="middle"
              x={element.x}
              y={element.y}
            >
              {element.text}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}

function QuizImageStimulus({ stimulus }: { stimulus: RenderedQuizImageStimulus }) {
  return (
    <figure className="mt-5 rounded-[1.25rem] border border-slate-200 bg-white/50 p-4">
      <figcaption className="mb-3">
        <span className="block text-sm font-bold text-slate-900">{stimulus.title}</span>
        {stimulus.description ? (
          <span className="mt-1 block text-xs leading-5 text-slate-500">{stimulus.description}</span>
        ) : null}
      </figcaption>
      {/* Question-bank image sources may be local or licensed external assets. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={stimulus.alt}
        className="h-auto max-h-[26rem] w-full rounded-xl bg-white object-contain"
        loading="lazy"
        src={stimulus.src}
      />
      {stimulus.attribution ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{stimulus.attribution}</p>
      ) : null}
    </figure>
  );
}

export function QuizStimulus({ stimulus }: { stimulus: RenderedQuizStimulus }) {
  if (stimulus.type === "image") {
    return <QuizImageStimulus stimulus={stimulus} />;
  }

  if (stimulus.type === "diagram") {
    return <QuizDiagramStimulus stimulus={stimulus} />;
  }

  return <QuizTableStimulus stimulus={stimulus} />;
}
