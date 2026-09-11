import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

// This inventory is deliberately local: Snake UI must not need uView at test
// time, while changes to either the mapping or the published audit remain visible.
const mapped = {
    'u-button': 'snake-button',
    'u-calendar': 'snake-calendar',
    'u-cell-group': 'snake-cell-group',
    'u-cell-item': 'snake-cell-item',
    'u-checkbox': 'snake-checkbox',
    'u-checkbox-group': 'snake-checkbox-group',
    'u-config-provider': 'snake-config-provider',
    'u-count-down': 'snake-count-down',
    'u-empty': 'snake-empty',
    'u-form': 'snake-form',
    'u-form-item': 'snake-form-item',
    'u-icon': 'snake-icon',
    'u-image': 'snake-image',
    'u-index-anchor': 'snake-index-anchor',
    'u-index-list': 'snake-index-list',
    'u-input': 'snake-input',
    'u-line': 'snake-line',
    'u-line-progress': 'snake-line-progress',
    'u-link': 'snake-link',
    'u-loadmore': 'snake-loadmore',
    'u-modal': 'snake-modal',
    'u-navbar': 'snake-navbar',
    'u-no-network': 'snake-no-network',
    'u-notice-bar': 'snake-notice-bar',
    'u-popup': 'snake-popup',
    'u-radio': 'snake-radio',
    'u-radio-group': 'snake-radio-group',
    'u-read-more': 'snake-read-more',
    'u-search': 'snake-search',
    'u-select': 'snake-select',
    'u-skeleton': 'snake-skeleton',
    'u-slider': 'snake-slider',
    'u-sticky': 'snake-sticky',
    'u-subsection': 'snake-subsection',
    'u-swiper': 'snake-swiper',
    'u-switch': 'snake-switch',
    'u-tabbar': 'snake-tabbar',
    'u-tabs': 'snake-tabs',
    'u-text': 'snake-text',
    'u-textarea': 'snake-textarea',
    'u-toast': 'snake-toast',
    'u-transition': 'snake-transition',
    'u-upload': 'snake-upload'
};

const uviewOnly = [
    'u-action-sheet',
    'u-action-sheet-item',
    'u-alert-tips',
    'u-avatar',
    'u-avatar-cropper',
    'u-back-top',
    'u-badge',
    'u-card',
    'u-car-keyboard',
    'u-circle-progress',
    'u-city-select',
    'u-col',
    'u-collapse',
    'u-collapse-item',
    'u-column-notice',
    'u-count-to',
    'u-divider',
    'u-dropdown',
    'u-dropdown-item',
    'u-fab',
    'u-field',
    'u-full-screen',
    'u-gap',
    'u-grid',
    'u-grid-item',
    'u-keyboard',
    'u-lazy-load',
    'u-loading',
    'u-loading-popup',
    'u-mask',
    'u-message-input',
    'u-number-box',
    'u-number-keyboard',
    'u-pagination',
    'u-picker',
    'u-rate',
    'u-root-portal',
    'u-row',
    'u-row-notice',
    'u-safe-bottom',
    'u-section',
    'u-status-bar',
    'u-step',
    'u-steps',
    'u-swipe-action',
    'u-table',
    'u-tabs-swiper',
    'u-tag',
    'u-td',
    'u-th',
    'u-time-line',
    'u-time-line-item',
    'u-top-tips',
    'u-tr',
    'u-verification-code',
    'u-waterfall'
];

test('uView compatibility audit covers every mapped and missing component', async () => {
    const [audit, entries] = await Promise.all([
        readFile(resolve(root, 'docs/components/uview-compatibility-audit.md'), 'utf8'),
        readdir(resolve(root, 'src/uni_modules/snake-ui/components'), { withFileTypes: true })
    ]);

    for (const [uview, snake] of Object.entries(mapped)) {
        assert.ok(
            audit.split('\n').some(line => line.includes(`\`${uview}\``) && line.includes(`\`${snake}\``)),
            `${uview} mapping is documented`
        );
        assert.ok(
            entries.some(entry => entry.isDirectory() && entry.name === snake),
            `${snake} must exist`
        );
    }
    for (const component of uviewOnly) assert.ok(audit.includes(`\`${component}\``), `${component} is documented`);
    assert.equal(Object.keys(mapped).length + uviewOnly.length, 99);
});
