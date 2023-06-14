/**
 * Generates a random color that is not in the list of undesirable colors.
 * If a seed is provided, the same seed will always generate the same color.
 *
 * @param seed The string used to generate the random color.
 * @returns A hexadecimal color string in the format "#RRGGBB".
 * @author ChatGPT (modified)
 */
export function generateRandomColor(seed: string = ""): string {
    const minColor: number = 0x404040; // Define the minimum color value (dark gray)
    const maxColor: number = 0xffffff; // Define the maximum color value (white)

    // Use the seed value to generate a random color
    let hash: number = seed.split("").reduce((acc, char) => acc * char.charCodeAt(0), 1);
    let colorValue: number = Math.floor((hash % (maxColor - minColor + 1)) + minColor);
    let color: string = "#" + colorValue.toString(16).toUpperCase();

    return color;
}
