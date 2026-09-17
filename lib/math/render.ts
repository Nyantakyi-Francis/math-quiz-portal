import katex from "katex";

export type RenderedMathSegment =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "math";
      html: string;
      displayMode: boolean;
    };

export type RenderedMathText = RenderedMathSegment[];

function renderExpression(expression: string, displayMode: boolean) {
  try {
    return katex.renderToString(expression, {
      throwOnError: false,
      displayMode
    });
  } catch {
    return expression;
  }
}

export function renderMathText(text: string): RenderedMathText {
  return text
    .split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
    .filter(Boolean)
    .map((part): RenderedMathSegment => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return {
          type: "math",
          html: renderExpression(part.slice(2, -2), true),
          displayMode: true
        };
      }

      if (part.startsWith("$") && part.endsWith("$")) {
        return {
          type: "math",
          html: renderExpression(part.slice(1, -1), false),
          displayMode: false
        };
      }

      return {
        type: "text",
        value: part
      };
    });
}
