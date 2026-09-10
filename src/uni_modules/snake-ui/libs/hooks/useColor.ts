import { setThemeColor, color } from '../config/theme';

export function useColor() {
    return { color: color, setColor: setThemeColor };
}
