import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { createServer } from 'vite';

const storage = new Map();

globalThis.uni = {
    getStorageSync: key => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    getSystemInfoSync: () => ({ theme: 'light' }),
    onThemeChange: () => {}
};

const server = await createServer({
    appType: 'custom',
    configFile: false,
    logLevel: 'silent',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true }
});

after(async () => {
    await server.close();
    delete globalThis.uni;
});

const themePresets = await server.ssrLoadModule('/src/snake-ui.theme.ts');

test('demo themes use the approved names and uView Pro palettes', () => {
    assert.deepEqual(
        themePresets.snakeThemePresets.map(theme => [theme.name, theme.label, theme.color.primary]),
        [
            ['snake', 'Snake 绿', '#06D290'],
            ['purple', '霞光紫', '#7C3AED'],
            ['rose', '绯樱红', '#E11D48'],
            ['orange', '暖阳橙', '#FF6B35'],
            ['dark', '深邃蓝', '#1E3A8A']
        ]
    );

    const purple = themePresets.snakeThemePresets[1];
    assert.equal(purple.color.success, '#10B981');
    assert.equal(purple.color.warningLight, '#FEF3C7');
    assert.equal(purple.darkColor.primary, '#8483F8');
    assert.equal(purple.darkColor.infoLight, '#73757B');
});

test('legacy demo theme ids migrate once to their closest replacement', () => {
    for (const [legacy, replacement] of Object.entries({ pupple: 'purple', blue: 'dark', red: 'rose' })) {
        storage.set('snake-ui-theme', legacy);
        assert.equal(themePresets.migrateThemePresetStorage(), replacement);
        assert.equal(storage.get('snake-ui-theme'), replacement);
    }

    storage.set('snake-ui-theme', 'orange');
    assert.equal(themePresets.migrateThemePresetStorage(), undefined);
    assert.equal(storage.get('snake-ui-theme'), 'orange');
});
