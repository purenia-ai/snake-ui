import { defaultSnakeTheme, type SnakeTheme } from './uni_modules/snake-ui';

/**
 * snake-ui 主题预设(色板基于 PURESNAKE 品牌体系推导)。
 * 每套主题只需覆盖 primary 家族 7 档,其余功能色/文字/背景与默认色板深度合并
 * (见 libs/config/theme.ts 的 normalizeTheme)。对比度规则:
 * - deep 白字 >= 4.5:1,deeper(渐变深端)>= 5.5:1
 * - ink 为实心主色上的文字,取与 base 对比更高的一侧;暗色统一墨蓝 #26273A
 */
export const snakeThemePresets: SnakeTheme[] = [
    defaultSnakeTheme,
    {
        name: 'pupple',
        label: '潮玩紫',
        description: '潮玩 / 活动 / 专家鉴别',
        color: {
            primary: '#7A3BFF',
            primaryDark: '#6B34E0',
            primaryDeep: '#5C2CBF',
            primaryDeeper: '#43208C',
            primaryDisabled: '#C9BAE6',
            primaryLight: '#F3F0FA',
            primaryInk: '#FFFFFF'
        },
        darkColor: {
            primary: '#D0BAFF',
            primaryDark: '#D6C2FF',
            primaryDeep: '#311866',
            primaryDeeper: '#25124D',
            primaryDisabled: '#2F2446',
            primaryLight: '#151020',
            primaryInk: '#26273A'
        }
    },
    {
        name: 'blue',
        label: '鉴别蓝',
        description: '次要链接 / Info / 机器鉴别',
        color: {
            primary: '#2D57E7',
            primaryDark: '#284DCB',
            primaryDeep: '#2241AD',
            primaryDeeper: '#19307F',
            primaryDisabled: '#B2BBDB',
            primaryLight: '#EEF0F7',
            primaryInk: '#FFFFFF'
        },
        darkColor: {
            primary: '#B5C4F7',
            primaryDark: '#BECBF8',
            primaryDeep: '#12235C',
            primaryDeeper: '#0E1A45',
            primaryDisabled: '#1D243E',
            primaryLight: '#0D111C',
            primaryInk: '#26273A'
        }
    },
    {
        name: 'red',
        label: '品牌红',
        description: 'KV / 节日 / 价格红',
        color: {
            primary: '#FF3367',
            primaryDark: '#E02D5B',
            primaryDeep: '#BF264D',
            primaryDeeper: '#8C1C39',
            primaryDisabled: '#E4B7C2',
            primaryLight: '#F9EFF2',
            primaryInk: '#4D0F1F'
        },
        darkColor: {
            primary: '#FFA3BB',
            primaryDark: '#FFAEC3',
            primaryDeep: '#661429',
            primaryDeeper: '#4D0F1F',
            primaryDisabled: '#45212A',
            primaryLight: '#1F0F13',
            primaryInk: '#26273A'
        }
    },
    {
        name: 'orange',
        label: '警示橙',
        description: '待处理 / 待鉴别',
        color: {
            primary: '#FF6A0C',
            primaryDark: '#E05D0B',
            primaryDeep: '#BF5009',
            primaryDeeper: '#8C3A07',
            primaryDisabled: '#E2C0AB',
            primaryLight: '#F9F1EC',
            primaryInk: '#4D2004'
        },
        darkColor: {
            primary: '#FFAD79',
            primaryDark: '#FFB789',
            primaryDeep: '#662A05',
            primaryDeeper: '#4D2004',
            primaryDisabled: '#432818',
            primaryLight: '#1E120B',
            primaryInk: '#26273A'
        }
    }
];

export default snakeThemePresets;
