// Minimal markdown → HTML for memo output.
// Supports: # / ## / ###, -/• lists, > blockquotes, **bold**, *em*, paragraphs.

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

export function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    // Headings
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    // Blockquote (single or consecutive)
    if (/^\s*>\s?/.test(line)) {
      const bq: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        bq.push(inline(lines[i].replace(/^\s*>\s?/, "")));
        i++;
      }
      out.push(`<blockquote>${bq.join("<br/>")}</blockquote>`);
      continue;
    }
    // Lists
    if (/^\s*[-•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-•]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-•]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    // Paragraph
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,3}\s+|\s*>\s?|\s*[-•]\s+)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }

  return out.join("\n");
}
