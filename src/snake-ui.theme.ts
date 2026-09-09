import { defaultSnakeTheme, type SnakeTheme } from './uni_modules/snake-ui';

const THEME_STORAGE_KEY = 'snake-ui-theme';

export const legacySnakeThemePresetNames: Readonly<Record<string, string>> = {
    pupple: 'purple',
    blue: 'dark',
    red: 'rose'
};

/** Migrate theme ids used by earlier demo presets without exposing duplicate themes. */
export function migrateSnakeThemePresetStorage(): string | undefined {
    try {
        const savedTheme = uni.getStorageSync(THEME_STORAGE_KEY);
        if (typeof savedTheme !== 'string') return undefined;
        const nextTheme = legacySnakeThemePresetNames[savedTheme];
        if (!nextTheme) return undefined;
        uni.setStorageSync(THEME_STORAGE_KEY, nextTheme);
        return nextTheme;
    } catch {
        return undefined;
    }
}

/**
 * Demo theme presets aligned with uView Pro. Its default blue is replaced by the
 * Snake brand green, while the overlapping green preset is replaced by rose.
 * Dark values mirror uView Pro's generated palette and include Snake-only tokens.
 */
export const snakeThemePresets: SnakeTheme[] = [
    defaultSnakeTheme,
    {
        name: 'purple',
        label: '霞光紫',
        color: {
            primary: '#7C3AED',
            primaryDark: '#6D28D9',
            primaryDeep: '#5B21B6',
            primaryDeeper: '#4C1D95',
            primaryDisabled: '#C4B5FD',
            primaryLight: '#F3E8FF',
            primaryInk: '#FFFFFF',
            success: '#10B981',
            successDark: '#059669',
            successDisabled: '#A7F3D0',
            successLight: '#D1FAE5',
            warning: '#F59E0B',
            warningDark: '#D97706',
            warningDisabled: '#FDE68A',
            warningLight: '#FEF3C7',
            error: '#F43F5E',
            errorDark: '#E11D48',
            errorDisabled: '#FBCFE8',
            errorLight: '#FFE4E6',
            info: '#6B7280',
            infoDark: '#4B5563',
            infoDisabled: '#D1D5DB',
            infoLight: '#F3F4F6',
            notice: '#F59E0B',
            noticeBackground: '#FEF3C7'
        },
        darkColor: {
            primary: '#8483F8',
            primaryDark: '#6565F0',
            primaryDeep: '#3730A3',
            primaryDeeper: '#312E81',
            primaryDisabled: '#7378AB',
            primaryLight: '#73748C',
            primaryInk: '#26273A',
            success: '#33CF80',
            successDark: '#159A5E',
            successDisabled: '#5F8F78',
            successLight: '#5D7D6E',
            warning: '#F9B21A',
            warningDark: '#CF8502',
            warningDisabled: '#927F45',
            warningLight: '#7F7453',
            error: '#FB5966',
            errorDark: '#DC2E40',
            errorDisabled: '#946872',
            errorLight: '#816768',
            info: '#8B92A2',
            infoDark: '#687180',
            infoDisabled: '#777B85',
            infoLight: '#73757B',
            notice: '#F9B21A',
            noticeBackground: '#7F7453'
        }
    },
    {
        name: 'rose',
        label: '绯樱红',
        color: {
            primary: '#E11D48',
            primaryDark: '#BE123C',
            primaryDeep: '#9F1239',
            primaryDeeper: '#881337',
            primaryDisabled: '#FDA4AF',
            primaryLight: '#FFF1F2',
            primaryInk: '#FFFFFF',
            success: '#10B981',
            successDark: '#059669',
            successDisabled: '#A7F3D0',
            successLight: '#D1FAE5',
            warning: '#F59E0B',
            warningDark: '#D97706',
            warningDisabled: '#FDE68A',
            warningLight: '#FEF3C7',
            error: '#DC2626',
            errorDark: '#B91C1C',
            errorDisabled: '#FCA5A5',
            errorLight: '#FEE2E2',
            info: '#6B7280',
            infoDark: '#4B5563',
            infoDisabled: '#D1D5DB',
            infoLight: '#F3F4F6',
            notice: '#F59E0B',
            noticeBackground: '#FEF3C7'
        },
        darkColor: {
            primary: '#AD78B6',
            primaryDark: '#855CB1',
            primaryDeep: '#881337',
            primaryDeeper: '#4C0519',
            primaryDisabled: '#8A718C',
            primaryLight: '#777887',
            primaryInk: '#26273A',
            success: '#33CF80',
            successDark: '#159A5E',
            successDisabled: '#5F8F78',
            successLight: '#5D7D6E',
            warning: '#F9B21A',
            warningDark: '#CF8502',
            warningDisabled: '#927F45',
            warningLight: '#7F7453',
            error: '#F14F4F',
            errorDark: '#CC2E2E',
            errorDisabled: '#945757',
            errorLight: '#816666',
            info: '#8B92A2',
            infoDark: '#687180',
            infoDisabled: '#777B85',
            infoLight: '#73757B',
            notice: '#F9B21A',
            noticeBackground: '#7F7453'
        }
    },
    {
        name: 'orange',
        label: '暖阳橙',
        color: {
            primary: '#FF6B35',
            primaryDark: '#EA580C',
            primaryDeep: '#C2410C',
            primaryDeeper: '#9A3412',
            primaryDisabled: '#FED7AA',
            primaryLight: '#FED7AA',
            primaryInk: '#4D2004',
            success: '#059669',
            successDark: '#047857',
            successDisabled: '#6EE7B7',
            successLight: '#DCFCE7',
            warning: '#F59E0B',
            warningDark: '#D97706',
            warningDisabled: '#FCD34D',
            warningLight: '#FEF3C7',
            error: '#DC2626',
            errorDark: '#B91C1C',
            errorDisabled: '#FCA5A5',
            errorLight: '#FEE2E2',
            info: '#2563EB',
            infoDark: '#1D4ED8',
            infoDisabled: '#93C5FD',
            infoLight: '#DBEAFE',
            notice: '#F59E0B',
            noticeBackground: '#FEF3C7'
        },
        darkColor: {
            primary: '#B997AE',
            primaryDark: '#97789E',
            primaryDeep: '#7C2D12',
            primaryDeeper: '#431407',
            primaryDisabled: '#8A858A',
            primaryLight: '#776D6A',
            primaryInk: '#26273A',
            success: '#2EC177',
            successDark: '#148E57',
            successDisabled: '#488B6E',
            successLight: '#627D6F',
            warning: '#F9B21A',
            warningDark: '#CF8502',
            warningDisabled: '#91782D',
            warningLight: '#7F7453',
            error: '#F14F4F',
            errorDark: '#CC2E2E',
            errorDisabled: '#945757',
            errorLight: '#816666',
            info: '#6F8CCC',
            infoDark: '#566EAF',
            infoDisabled: '#5E7593',
            infoLight: '#69717E',
            notice: '#F9B21A',
            noticeBackground: '#7F7453'
        }
    },
    {
        name: 'dark',
        label: '深邃蓝',
        color: {
            primary: '#1E3A8A',
            primaryDark: '#1E40AF',
            primaryDeep: '#172554',
            primaryDeeper: '#0F172A',
            primaryDisabled: '#93C5FD',
            primaryLight: '#DBEAFE',
            primaryInk: '#FFFFFF',
            success: '#059669',
            successDark: '#047857',
            successDisabled: '#6EE7B7',
            successLight: '#DCFCE7',
            warning: '#D97706',
            warningDark: '#B45309',
            warningDisabled: '#FCD34D',
            warningLight: '#FEF3C7',
            error: '#DC2626',
            errorDark: '#B91C1C',
            errorDisabled: '#FCA5A5',
            errorLight: '#FEE2E2',
            info: '#2563EB',
            infoDark: '#1D4ED8',
            infoDisabled: '#93C5FD',
            infoLight: '#DBEAFE',
            notice: '#D97706',
            noticeBackground: '#FEF3C7'
        },
        darkColor: {
            primary: '#5F83D0',
            primaryDark: '#456EDF',
            primaryDeep: '#1E3A8A',
            primaryDeeper: '#172554',
            primaryDisabled: '#5F7EAB',
            primaryLight: '#69758B',
            primaryInk: '#0F172A',
            success: '#2EC177',
            successDark: '#148E57',
            successDisabled: '#488B6E',
            successLight: '#627D6F',
            warning: '#EDA218',
            warningDark: '#C07704',
            warningDisabled: '#91782D',
            warningLight: '#7F7453',
            error: '#F14F4F',
            errorDark: '#CC2E2E',
            errorDisabled: '#945757',
            errorLight: '#816666',
            info: '#6F8CCC',
            infoDark: '#566EAF',
            infoDisabled: '#5E7593',
            infoLight: '#69717E',
            notice: '#EDA218',
            noticeBackground: '#7F7453'
        }
    }
];

export default snakeThemePresets;
