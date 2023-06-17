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
    const undesirableColors: string[] = ["#734A12", "#6F4E37", "#7B5B1E"];
    const undesirableRange: number = 0x080808; // Define the range of undesirable colors (dark gray)

    // Define a range of colors around the undesirable colors
    const undesirableColorsWithRange: string[] = undesirableColors.flatMap((color) => {
        const colorValue: number = parseInt(color.substr(1), 16);
        const minRange: number = Math.max(minColor, colorValue - undesirableRange);
        const maxRange: number = Math.min(maxColor, colorValue + undesirableRange);
        return [...Array(maxRange - minRange + 1)].map(
            (_, i) => "#" + (minRange + i).toString(16).toUpperCase().padStart(6, "0")
        );
    });

    // Use the seed value to generate a random color
    let hash: number = seed.split("").reduce((acc, char) => acc * char.charCodeAt(0), 1);
    let colorValue: number = Math.floor((hash % (maxColor - minColor + 1)) + minColor);
    let color: string = "#" + colorValue.toString(16).toUpperCase();

    // Loop until the generated color is not in the list of undesirable colors
    let suffix: number = 0;
    while (undesirableColorsWithRange.includes(color)) {
        // Generate a new color value based on the seed and suffix
        hash = seed.split("").reduce((acc, char) => acc * char.charCodeAt(0), suffix + 1);
        colorValue = Math.floor((hash % (maxColor - minColor + 1)) + minColor);
        color = "#" + colorValue.toString(16).toUpperCase();
        suffix++;
    }

    return color;
}
