import type { PolicyBlock, PolicyRun } from "@/lib/policy-content";

function Runs({ runs }: { runs: PolicyRun[] }) {
  return (
    <>
      {runs.map((r, i) =>
        r.b ? <strong key={i}>{r.t}</strong> : <span key={i}>{r.t}</span>,
      )}
    </>
  );
}

/** Renders the legal documents exactly as approved in the source document. */
export function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: PolicyRun[][] = [];
  const flush = (key: string) => {
    if (!list.length) return;
    const items = list;
    list = [];
    out.push(
      <ul key={key}>
        {items.map((r, i) => (
          <li key={i}>
            <Runs runs={r} />
          </li>
        ))}
      </ul>,
    );
  };
  blocks.forEach((b, i) => {
    if (b.k === "li") {
      list.push(b.r);
      return;
    }
    flush(`ul-${i}`);
    if (b.k === "h2") {
      out.push(
        <h2 key={i}>
          <Runs runs={b.r} />
        </h2>,
      );
    } else if (b.k === "p") {
      out.push(
        <p key={i}>
          <Runs runs={b.r} />
        </p>,
      );
    } else if (b.k === "table") {
      const [head, ...rows] = b.rows;
      out.push(
        <div key={i} className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {head.map((c, j) => (
                  <th key={j} className="border border-border bg-surface px-3 py-2 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((c, j) => (
                    <td key={j} className="border border-border px-3 py-2 align-top">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    }
  });
  flush("ul-end");
  return <>{out}</>;
}
