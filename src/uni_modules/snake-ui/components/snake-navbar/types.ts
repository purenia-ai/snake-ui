import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

export interface SnakeNavbarProps {
    title?: string;
    height?: UnitValue;
    backIconColor?: string;
    backIconName?: string;
    backIconSize?: UnitValue;
    backText?: string;
    backTextStyle?: SnakeStyleValue;
    titleWidth?: UnitValue;
    titleColor?: string;
    titleSize?: UnitValue;
    titleBold?: boolean;
    isBack?: boolean;
    background?: SnakeStyleValue;
    fixed?: boolean;
    immersive?: boolean;
    safeAreaInsetTop?: boolean;
    borderBottom?: boolean;
    zIndex?: UnitValue;
    customBack?: (() => void) | null;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeNavbarEmits {
    back: [event: unknown];
}
