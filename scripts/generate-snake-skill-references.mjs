import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const sourceDirectory = resolve(rootDirectory, 'docs');
const skillDirectory = resolve(rootDirectory, 'skills', 'snake-ui');
const referenceDirectory = resolve(skillDirectory, 'references');
const categories = ['components', 'cms', 'guide', 'tools'];

function removeFrontmatter(content) {
    return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '');
}

function getTitle(content, fallback) {
    const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return title || fallback;
}

function getTriggers(category, name, title) {
    const componentName = category === 'components' ? `snake-${name}` : name;
    const titleWords = title
        .replace(/[`<>{}()[\]|]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && word.length <= 24)
        .slice(0, 2);

    return [...new Set([name, componentName, ...titleWords])];
}

function createFrontmatter(category, name, title) {
    const description = `Snake UI ${title}参考。处理 ${name}、${category} 或相关 uni-app 使用问题时按需读取。`;
    const triggers = getTriggers(category, name, title).map(value => JSON.stringify(value)).join(', ');

    return [
        '---',
        `name: ${JSON.stringify(name)}`,
        `description: ${JSON.stringify(description)}`,
        `triggers: [${triggers}]`,
        '---',
        ''
    ].join('\n');
}

async function generateCategory(category) {
    const inputDirectory = resolve(sourceDirectory, category);
    const outputDirectory = resolve(referenceDirectory, category);
    const files = await findMarkdownFiles(inputDirectory);

    await rm(outputDirectory, { recursive: true, force: true });
    await mkdir(outputDirectory, { recursive: true });

    const entries = [];
    for (const sourcePath of files) {
        const fileName = relative(inputDirectory, sourcePath).replaceAll('\\', '/');
        const name = fileName.slice(0, -3);
        const targetPath = resolve(outputDirectory, fileName);
        const source = await readFile(sourcePath, 'utf8');
        const content = removeFrontmatter(source);
        const title = getTitle(content, name);

        await mkdir(dirname(targetPath), { recursive: true });
        await writeFile(targetPath, `${createFrontmatter(category, name, title)}${content}`, 'utf8');
        entries.push({ name, title, path: `${category}/${fileName}` });
    }

    return entries;
}

async function findMarkdownFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(entry => {
            const path = resolve(directory, entry.name);
            if (entry.isDirectory()) return findMarkdownFiles(path);
            return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
        })
    );

    return files
        .flat()
        .sort((left, right) => left.localeCompare(right, 'en'));
}

async function generateLlmsFull() {
    const sections = [
        '# Snake UI 完整 LLM 上下文',
        '',
        '此文件由 `pnpm skill:sync` 根据 `docs/` 自动生成，请不要直接编辑。',
        ''
    ];

    for (const category of categories) {
        const inputDirectory = resolve(sourceDirectory, category);
        const files = await findMarkdownFiles(inputDirectory);

        sections.push(`## ${category}`);
        sections.push('');

        for (const sourcePath of files) {
            const relativePath = relative(rootDirectory, sourcePath).replaceAll('\\', '/');
            const content = removeFrontmatter(await readFile(sourcePath, 'utf8')).trim();
            sections.push(`<!-- Source: ${relativePath} -->`);
            sections.push('');
            sections.push(content);
            sections.push('');
        }
    }

    await writeFile(resolve(rootDirectory, 'llms-full.txt'), `${sections.join('\n')}\n`, 'utf8');
}

const generated = new Map();
for (const category of categories) {
    generated.set(category, await generateCategory(category));
}

const index = [
    '# Snake UI References',
    '',
    '此目录由 `pnpm skill:sync` 根据 `docs/` 自动生成，请不要直接编辑。',
    ''
];

for (const category of categories) {
    index.push(`## ${category}`);
    index.push('');
    for (const entry of generated.get(category)) {
        index.push(`- [${entry.title}](${entry.path})`);
    }
    index.push('');
}

await writeFile(resolve(referenceDirectory, 'INDEX.md'), `${index.join('\n')}\n`, 'utf8');
await generateLlmsFull();
