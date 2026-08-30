import { MathText } from "@/components/math-text";
import type { QuizTableStimulus } from "@/lib/quiz/types";

export function QuizStimulus({ stimulus }: { stimulus: QuizTableStimulus }) {
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
                <th className="border border-slate-300 bg-slate-100 px-3 py-2 font-semibold text-slate-900" key={column} scope="col">
                  <MathText text={column} />
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
                      <MathText text={cell} />
                    </th>
                  ) : (
                    <td className="border border-slate-300 px-3 py-2 text-slate-700" key={`${rowIndex}-${cellIndex}`}>
                      <MathText text={cell} />
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
