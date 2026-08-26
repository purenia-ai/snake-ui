import { setSnakeThemeColor, snakeColor } from '../config/theme';

export function useSnakeColor() {
    return { color: snakeColor, setColor: setSnakeThemeColor };
}
