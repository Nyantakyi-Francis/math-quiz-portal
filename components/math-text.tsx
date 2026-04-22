import katex from "katex";

type MathTextProps = {
  text: string;
  className?: string;
};

function renderMath(expression: string, displayMode: boolean) {
  try {
    return katex.renderToString(expression, {
      throwOnError: false,
      displayMode
    });
  } catch {
    return expression;
  }
}

export function MathText({ text, className }: MathTextProps) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const expression = part.slice(2, -2);
          return (
            <span
              className="my-2 block overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: renderMath(expression, true) }}
              key={`${part}-${index}`}
            />
          );
        }

        if (part.startsWith("$") && part.endsWith("$")) {
          const expression = part.slice(1, -1);
          return (
            <span
              dangerouslySetInnerHTML={{ __html: renderMath(expression, false) }}
              key={`${part}-${index}`}
            />
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </span>
  );
}
