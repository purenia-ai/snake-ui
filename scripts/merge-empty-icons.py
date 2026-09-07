#!/usr/bin/env python3
"""Merge empty-state glyphs from a third-party iconfont CSS (base64-embedded woff2)
into snake-ui's iconfont.

Usage:
    python scripts/merge-empty-icons.py \
        --source "D:/path/to/third-party/iconfont.css" \
        --css "src/uni_modules/snake-ui/iconfont.css" \
        --font "src/uni_modules/snake-ui/iconfont.woff2"

What it does:
1. Extracts the base64 woff2 embedded in the source css.
2. Finds every `.uicon-empty-<mode>:before` rule and its codepoint.
3. Remaps those codepoints to a fresh private-use block (\\uf100..) that does not
   collide with codepoints already used in the target css.
4. Subsets the source font to just those glyphs and merges them into the target
   woff2 (TrueType outline copy + metrics + cmap).
5. Appends `.sicon-empty-<mode>:before` rules to the target css (idempotent:
   previously appended rules are removed first).

The source font must have the same unitsPerEm as the target (both are
iconfont.cn builds, 1024). Source: third-party open-source UI lib (MIT).
"""

import argparse
import base64
import io
import re
import sys

from fontTools.ttLib import TTFont

RULE_RE = re.compile(
    r"\.uicon-empty-([a-z]+):before\s*\{[^}]*?content:\s*'\\([0-9a-fA-F]{4})'"
)
SNK_RULE_RE = re.compile(r"\.sicon-empty-[a-z]+:before\s*\{[^}]*?\}")
DATA_URI_RE = re.compile(
    r"url\('data:application/(?:x-font-woff2|font-woff2);[^']*?base64,([^']+)'\)"
)


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, help="third-party iconfont.css with base64 woff2")
    parser.add_argument("--css", required=True, help="snake-ui iconfont.css")
    parser.add_argument("--font", required=True, help="snake-ui iconfont.woff2")
    args = parser.parse_args()

    src_css = open(args.source, encoding="utf-8").read()
    m = DATA_URI_RE.search(src_css)
    if not m:
        fail("no base64 woff2 data uri found in source css")
    src_font = TTFont(io.BytesIO(base64.b64decode(m.group(1))))

    rules = [(mode, int(cp, 16)) for mode, cp in RULE_RE.findall(src_css)]
    if not rules:
        fail("no .uicon-empty-* rules found in source css")
    if len(rules) != len({cp for _mode, cp in rules}):
        fail("duplicate codepoints among empty glyphs")

    raw_dst = open(args.css, "rb").read()
    dst_css = raw_dst.decode("utf-8")
    newline = "\r\n" if b"\r\n" in raw_dst else "\n"
    used = {int(cp, 16) for cp in re.findall(r"content:\s*'\\([0-9a-fA-F]{4})'", dst_css)}
    new_cps: dict[str, int] = {}
    next_cp = 0xF100
    for mode, _old_cp in sorted(rules):
        while next_cp in used:
            next_cp += 1
        new_cps[mode] = next_cp
        used.add(next_cp)
        next_cp += 1
    print(f"found {len(rules)} empty glyphs -> new codepoints: {new_cps}")

    dst_font = TTFont(args.font)
    src_units = src_font["head"].unitsPerEm
    dst_units = dst_font["head"].unitsPerEm
    if src_units != dst_units:
        fail(f"unitsPerEm mismatch: source {src_units} vs target {dst_units}; cannot merge without scaling")
    if "glyf" not in src_font or "glyf" not in dst_font:
        fail("both fonts must be TrueType outline fonts (glyf table)")

    # Remap the source font's cmap: old codepoint -> fresh private-use codepoint.
    old_to_new = {old_cp: new_cps[mode] for mode, old_cp in rules}
    src_cmap = src_font.getBestCmap()
    for old_cp, new_cp in old_to_new.items():
        gname = src_cmap.get(old_cp)
        if gname is None:
            fail(f"source font has no glyph for U+{old_cp:04X}")
        for table in src_font["cmap"].tables:
            cmap = table.cmap
            if old_cp in cmap:
                del cmap[old_cp]
            if table.format in (4, 12, 13):
                cmap[new_cp] = gname

    # Subset the source font to just the empty glyphs (plus .notdef / components).
    from fontTools import subset

    options = subset.Options()
    options.glyph_names = True
    options.layout_features = []
    options.drop_tables += ["name", "post", "OS/2"]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=list(new_cps.values()))
    subsetter.subset(src_font)

    # Copy glyph outlines + metrics into the target font, renaming on collision.
    # Order matters: glyf.decompile slices loca by maxp.numGlyphs over the FIRST
    # names of the glyph order, so new names must be appended at the end.
    dst_font["glyf"]  # force full decompile while the order is still the original one
    dst_font["hmtx"]
    dst_order = list(dst_font.getGlyphOrder())
    src_order = src_font.getGlyphOrder()
    src_notdef = src_order[0]  # 源字体 .notdef 可能叫 glyph00000 之类的名字,只能按 id 0 识别
    name_map: dict[str, str] = {}
    for gname in src_order:
        if gname == src_notdef:
            continue
        new_name = gname
        while new_name in dst_order:
            new_name = f"{new_name}.empty"
        dst_order.append(new_name)
        name_map[gname] = new_name

    dst_font.setGlyphOrder(dst_order)
    dst_font["maxp"].numGlyphs = len(dst_order)
    glyf = dst_font["glyf"]
    hmtx = dst_font["hmtx"]
    src_glyf = src_font["glyf"]
    src_hmtx = src_font["hmtx"]
    for old_name, new_name in name_map.items():
        glyf.glyphs[new_name] = src_glyf[old_name]
        hmtx[new_name] = src_hmtx[old_name]
        # 源字体空状态字形 lsb=0 且墨迹远窄于 advance,渲染时整块靠左(120rpx 下约偏 10-18px)。
        # 居中轴承:lsb = (advance - 墨迹宽) / 2,让墨迹中心与 advance 中心重合。
        # 注意:源 woff2 的 post 表损坏,新拷贝字形对象的 xMin/xMax 缓存会读错(偏 0),
        # 必须先 recalcBounds 从坐标重算。
        advance = hmtx[new_name][0]
        gg = glyf.glyphs[new_name]
        gg.recalcBounds(glyf)
        ink_width = gg.xMax - gg.xMin
        hmtx[new_name] = (advance, max(0, round((advance - ink_width) / 2)))

    # Add cmap entries for the new codepoints.
    src_best = src_font.getBestCmap()
    new_entries = {}
    for new_cp in new_cps.values():
        gname = src_best.get(new_cp)
        if gname is None:
            fail(f"subset lost glyph for U+{new_cp:04X}")
        new_entries[new_cp] = name_map[gname]
    dst_best = dst_font.getBestCmap()
    if any(cp in dst_best for cp in new_entries):
        fail("codepoint collision after remap")
    for table in dst_font["cmap"].tables:
        if table.format in (4, 12, 13):
            for cp, gname in new_entries.items():
                table.cmap[cp] = gname

    dst_font.save(args.font)
    print(f"merged {len(new_entries)} glyphs into {args.font}")

    # Update the target css: strip previously appended sicon-empty rules, append fresh ones.
    dst_css = SNK_RULE_RE.sub("", dst_css).rstrip()
    if not dst_css.endswith("\n"):
        dst_css += "\n"
    dst_css += "\n/* empty-state glyphs (merged from third-party open-source iconfont, MIT) */\n"
    for mode, cp in sorted(new_cps.items()):
        dst_css += f".sicon-empty-{mode}:before {{\n    content: '\\{cp:04x}';\n}}\n\n"
    open(args.css, "w", encoding="utf-8", newline=newline).write(dst_css)
    print(f"appended {len(new_cps)} .sicon-empty-* rules to {args.css}")


if __name__ == "__main__":
    main()
