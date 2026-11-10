"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  debounce: () => debounce,
  findNode: () => findNode,
  formatPagePath: () => formatPagePath,
  loadPagesJson: () => loadPagesJson,
  normalizePlatformPath: () => normalizePlatformPath,
  parseSFC: () => parseSFC,
  stripJsonComments: () => stripJsonComments,
  toKebabCase: () => toKebabCase,
  toPascalCase: () => toPascalCase,
  wrapPageTemplate: () => wrapPageTemplate
});
module.exports = __toCommonJS(utils_exports);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_vite = require("vite");
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
  return (0, import_vite.normalizePath)(`${(0, import_node_path.join)(root, path)}.vue`).replace(/^[A-Z]:/, (match) => match.toLowerCase());
}
function loadPagesJson(path, rootPath) {
  const raw = (0, import_node_fs.readFileSync)(path, "utf-8");
  const { pages = [], subPackages = [] } = JSON.parse(stripJsonComments(raw));
  return [
    ...pages.map((page) => formatPagePath(rootPath, page.path)),
    ...subPackages.map(({ pages: subPages = [], root = "" }) => {
      return subPages.map((page) => formatPagePath((0, import_node_path.join)(rootPath, root), page.path));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
