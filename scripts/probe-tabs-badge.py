# -*- coding: utf-8 -*-
"""tabs 徽标几何探针：用真实渲染坐标回答徽标是否被 scroll-view 裁切"""
import json
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:5173/#/pages/componentsA/tabs/index"

JS = """
() => {
    const q = sel => document.querySelector(sel);
    const rect = el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2),
                 left: +r.left.toFixed(2), right: +r.right.toFixed(2),
                 width: +r.width.toFixed(2), height: +r.height.toFixed(2) };
    };
    const sv = q('.snake-tabs__scroll-view');
    const svInner = sv ? (sv.querySelector('.uni-scroll-view') || sv) : null;
    const items = [...document.querySelectorAll('.snake-tabs__item')].map(el => ({
        text: el.textContent.trim().slice(0, 12),
        item: rect(el),
        badge: rect(el.querySelector('.snake-badge__content')),
        badgeVisibleSize: (() => {
            const b = el.querySelector('.snake-badge__content');
            if (!b || !svInner) return null;
            const br = b.getBoundingClientRect();
            const sr = svInner.getBoundingClientRect();
            const cs = getComputedStyle(svInner);
            const overlapX = Math.max(0, Math.min(br.right, sr.right) - Math.max(br.left, sr.left));
            const overlapY = Math.max(0, Math.min(br.bottom, sr.bottom) - Math.max(br.top, sr.top));
            return {
                overflowStyle: cs.overflowX + ' ' + cs.overflowY,
                visibleRatio: br.width && br.height
                    ? +((overlapX * overlapY) / (br.width * br.height)).toFixed(3) : null
            };
        })()
    }));
    return {
        scrollView: rect(svInner),
        items: items,
        dotExists: !!document.querySelector('.snake-badge__content--dot')
    };
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector(".snake-tabs__item", timeout=20000)
    page.wait_for_timeout(1500)
    data = page.evaluate(JS)
    print(json.dumps(data, ensure_ascii=False, indent=1))
    browser.close()
