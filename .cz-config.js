module.exports = {
    types: [
        { value: 'feat', name: 'feat:     新功能' },
        { value: 'fix', name: 'fix:      修复 bug' },
        { value: 'docs', name: 'docs:     文档更新' },
        { value: 'style', name: 'style:    代码格式调整' },
        { value: 'refactor', name: 'refactor: 代码重构' },
        { value: 'perf', name: 'perf:     性能优化' },
        { value: 'test', name: 'test:     测试相关' },
        { value: 'build', name: 'build:    构建相关' },
        { value: 'ci', name: 'ci:        CI/CD 相关' },
        { value: 'chore', name: 'chore:    其他修改' },
        { value: 'revert', name: 'revert:   回退代码' }
    ],
    messages: {
        type: '选择更改类型:',
        scope: '修改范围（可选）:',
        subject: '简短描述:',
        body: '详细描述（可选）:',
        breaking: '破坏性变更（可选）:',
        footer: '关联 issue（可选）:',
        confirmCommit: '确认提交?'
    },
    skipQuestions: ['body', 'footer'],
    scopes: [
        { name: 'components', description: '组件相关' },
        { name: 'pages', description: '页面相关' },
        { name: 'utils', description: '工具函数' },
        { name: 'styles', description: '样式相关' },
        { name: 'docs', description: '文档相关' },
        { name: 'config', description: '配置相关' },
        { name: 'deps', description: '依赖相关' }
    ],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    allowCustomSubject: true,
    allowEmptySubject: false,
    subjectLimit: 100,
    scopeLimit: 100,
    breakingPrefix: 'BREAKING CHANGE:',
    footerPrefix: 'Closes'
};
