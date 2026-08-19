import { defaultSnakeTheme, type SnakeTheme } from './uni_modules/snake-ui';

/**
 * snake-ui 主题预设(对齐 uView 生态的多主题机制)。
 * 每套主题只需覆盖 primary 家族 7 档,其余功能色/文字/背景与默认色板深度合并
 * (见 libs/config/theme.ts 的 normalizeTheme)。对比度规则:
 * - deep 白字 >= 4.5:1,deeper(渐变深端)>= 5.5:1
 * - ink 为实心主色上的文字,取与 base 对比更高的一侧;紫色基色偏暗,亮色取白字、暗色取深字
 */
export const snakeThemePresets: SnakeTheme[] = [
    defaultSnakeTheme,
    {
        name: 'purple',
        label: '紫',
        description: '雾紫主题',
        color: {
            primary: '#7C3AED',
            primaryDark: '#6D33D1',
            primaryDeep: '#5D2CB2',
            primaryDeeper: '#442082',
            primaryDisabled: '#C7B7E3',
            primaryLight: '#F3EFF9',
            primaryInk: '#FFFFFF'
        },
        darkColor: {
            primary: '#CBB0F8',
            primaryDark: '#D7C4FA',
            primaryDeep: '#31196B',
            primaryDeeper: '#23124E',
            primaryDisabled: '#3A2A5E',
            primaryLight: '#150F1F',
            primaryInk: '#2A1050'
        }
    },
    {
        name: 'orange',
        label: '橙',
        description: '活力橙主题',
        color: {
            primary: '#FF6B35',
            primaryDark: '#E05E2F',
            primaryDeep: '#BF5028',
            primaryDeeper: '#8C3B1D',
            primaryDisabled: '#E8C3B5',
            primaryLight: '#FAF2EF',
            primaryInk: '#4F2110'
        },
        darkColor: {
            primary: '#FFA686',
            primaryDark: '#FFBB9F',
            primaryDeep: '#57200F',
            primaryDeeper: '#3D160A',
            primaryDisabled: '#5E301F',
            primaryLight: '#20130F',
            primaryInk: '#4F2110'
        }
    },
    {
        name: 'blue',
        label: '蓝',
        description: '经典蓝主题',
        color: {
            primary: '#2979FF',
            primaryDark: '#246AE0',
            primaryDeep: '#1F5BBF',
            primaryDeeper: '#17438C',
            primaryDisabled: '#B3C6E8',
            primaryLight: '#EEF2FA',
            primaryInk: '#061226'
        },
        darkColor: {
            primary: '#94BCFF',
            primaryDark: '#AFCEFF',
            primaryDeep: '#0D2C5C',
            primaryDeeper: '#091F42',
            primaryDisabled: '#1D3560',
            primaryLight: '#0E1520',
            primaryInk: '#061226'
        }
    },
    {
        name: 'rose',
        label: '玫红',
        description: '玫红主题',
        color: {
            primary: '#F43F5E',
            primaryDark: '#D73753',
            primaryDeep: '#B72F47',
            primaryDeeper: '#862334',
            primaryDisabled: '#E4B7BF',
            primaryLight: '#F9EFF1',
            primaryInk: '#380E16'
        },
        darkColor: {
            primary: '#FA9FAF',
            primaryDark: '#FBB7C3',
            primaryDeep: '#4F101D',
            primaryDeeper: '#380A14',
            primaryDisabled: '#5E2630',
            primaryLight: '#1F0F12',
            primaryInk: '#380E16'
        }
    }
];

export default snakeThemePresets;
