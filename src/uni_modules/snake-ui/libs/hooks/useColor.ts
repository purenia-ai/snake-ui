import { setSnakeThemeColor, snakeColor } from '../config/theme';

export function useColor() {
    return { color: snakeColor, setColor: setSnakeThemeColor };
}
