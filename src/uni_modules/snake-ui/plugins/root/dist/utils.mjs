import { readFileSync } from "node:fs";
import { join } from "node:path";
import { normalizePath } from "vite";
async function parseSFC(code) {
  try {
    const { parse } = await import("vue/compiler-sfc");
    return parse(code, { pad: "space" }).descriptor;
  } catch {
    return null;
  }
}
function stripJsonComments(str) {
  let out = "";
  let quote = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (quote) {
      out += char;
      if (char === "\\") {
        out += str[++i] ?? "";
        continue;
      }
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"') {
      quote = char;
      out += char;
      continue;
    }
    if (char === "/" && str[i + 1] === "/") {
      while (i < str.length && str[i] !== "\n") i++;
      out += "\n";
      continue;
    }
    if (char === "/" && str[i + 1] === "*") {
      i += 2;
      while (i < str.length && !(str[i] === "*" && str[i + 1] === "/")) i++;
      i += 1;
      out += " ";
      continue;
    }
    out += char;
  }
  return out;
}
function formatPagePath(root, path) {
  return normalizePath(`${join(root, path)}.vue`).replace(/^[A-Z]:/, (match) => match.toLowerCase());
}
function loadPagesJson(path, rootPath) {
  const raw = readFileSync(path, "utf-8");
  const { pages = [], subPackages = [] } = JSON.parse(stripJsonComments(raw));
  return [
    ...pages.map((page) => formatPagePath(rootPath, page.path)),
    ...subPackages.map(({ pages: subPages = [], root = "" }) => {
      return subPages.map((page) => formatPagePath(join(rootPath, root), page.path));
    }).flat()
  ];
}
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
}
function toPascalCase(str) {
  return str.replace(/(^\w|-+\w)/g, (match) => match.toUpperCase().replace(/-/g, ""));
}
function findNode(sfc, rawTagName) {
  const templateSource = sfc.template?.content;
  if (!templateSource) return;
  let tagName = "";
  if (templateSource.includes(`<${toKebabCase(rawTagName)}`)) {
    tagName = toKebabCase(rawTagName);
  } else if (templateSource.includes(`<${toPascalCase(rawTagName)}`)) {
    tagName = toPascalCase(rawTagName);
  }
  if (!tagName) return;
  const nodeAst = sfc.template?.ast;
  if (!nodeAst) return;
  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.type === 1) {
        if (node.tag === tagName) return node;
        if (node.children?.length) {
          const found = traverse(node.children);
          if (found) return found;
        }
      }
    }
    return void 0;
  };
  return traverse(nodeAst.children);
}
function wrapPageTemplate(code, sfc) {
  const openMatch = code.match(/<template\b[^>]*>/);
  if (!openMatch) return null;
  const closeTagStart = code.lastIndexOf("</template>");
  if (closeTagStart === -1) return null;
  const openTagEnd = openMatch.index + openMatch[0].length;
  const content = code.slice(openTagEnd, closeTagStart);
  let pageMetaSource = "";
  let newContent = content;
  if (sfc?.template) {
    const pageMetaNode = findNode(sfc, "PageMeta");
    if (pageMetaNode) {
      pageMetaSource = pageMetaNode.loc.source;
      const metaStart = pageMetaNode.loc.start.offset;
      const metaEnd = pageMetaNode.loc.end.offset;
      const metaStartInContent = metaStart - openTagEnd;
      const metaEndInContent = metaEnd - openTagEnd;
      newContent = content.slice(0, metaStartInContent) + content.slice(metaEndInContent);
    }
  } else {
    const pageMetaMatch = content.match(/<page-meta\b[^>]*>[\s\S]*?<\/page-meta>/);
    if (pageMetaMatch) {
      pageMetaSource = pageMetaMatch[0];
      newContent = content.replace(pageMetaMatch[0], "");
    } else {
      const selfClosingMatch = content.match(/<page-meta\b[^>]*\/>/);
      if (selfClosingMatch) {
        pageMetaSource = selfClosingMatch[0];
        newContent = content.replace(selfClosingMatch[0], "");
      }
    }
  }
  const wrappedContent = `
${pageMetaSource}
<global-root-view>${newContent}</global-root-view>
`;
  return {
    code: code.slice(0, openTagEnd) + wrappedContent + code.slice(closeTagStart),
    map: {
      version: 3,
      sources: [],
      names: [],
      mappings: ""
    }
  };
}
function normalizePlatformPath(id) {
  const platform = process.env.UNI_PLATFORM;
  if (!platform) return id;
  const regex = new RegExp(`\\.${platform}\\.vue$`);
  if (regex.test(id)) {
    return id.replace(`.${platform}.`, ".");
  }
  return id;
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
export {
  debounce,
  findNode,
  formatPagePath,
  loadPagesJson,
  normalizePlatformPath,
  parseSFC,
  stripJsonComments,
  toKebabCase,
  toPascalCase,
  wrapPageTemplate
};
