import { createCanvas, Canvas } from 'canvas';
import { createWriteStream } from 'fs';
import { join } from 'path';
import convert from 'color-convert';

const OUTPUT_FOLDER: string = join(process.cwd(), 'assets', 'palette');

const colors: { [key: string]: { [key: string]: string } } = {
    accent: {
        rosewater: "#f2d3d3",
        flamingo: "#f4a2a2",
        pink: "#d58ac5",
        mauve: "#ac7bd9",
        red: "#e57474",
        maroon: "#c15d5d",
        peach: "#d68a60",
        yellow: "#e5c76b",
        green: "#8ccf7e",
        teal: "#6cbf99",
        sky: "#78c5d6",
        sapphire: "#5aa0d8",
        blue: "#67b0e8",
        lavender: "#9a81d5",
    },
    text: {
        text: "#dadada",
        subtext1: "#b3b9b8",
        subtext0: "#a1a7a6",
    },
    overlay: {
        overlay2: "#5c6268",
        overlay1: "#4b5157",
        overlay0: "#3a4045",
    },
    surface: {
        surface2: "#31363a",
        surface1: "#292e32",
        surface0: "#232a2d",
    },
    base: {
        base: "#141b1e",
        mantle: "#0f1518",
        crust: "#0a0f11"
    }
};

const main = async () => {
    console.log('Creating PNG files for each color...');
    for (const [colorType, colorTypeColors] of Object.entries(colors)) {
        for (const [colorName, colorHex] of Object.entries(colorTypeColors)) {
            const canvas: Canvas = createCanvas(45, 45);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = colorHex;
            ctx.fillRect(0, 0, 45, 45);
            const out = createWriteStream(join(OUTPUT_FOLDER, `${colorType}-${colorName}.png`));
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => console.log(`The PNG file for ${colorName} was created.`));
            await new Promise(resolve => out.on('close', resolve));
            console.log(`The PNG file for ${colorName} (${colorHex}) was created.`)
        }
    }

    console.log('Creating palette.md file...');
    const mdFile = createWriteStream(join(OUTPUT_FOLDER, 'palette.md'));
    mdFile.write('## 🎨 Palette\n')

    for (const [colorType, colorTypeColors] of Object.entries(colors)) {
        mdFile.write(`<details>\n`);
        mdFile.write(`<summary>${colorType}</summary>\n`);
        mdFile.write('<table align="center">\n');
        mdFile.write('<tr>\n');
        mdFile.write('<th>Preview</th>\n');
        mdFile.write('<th>Variable</th>\n');
        mdFile.write('<th>Hex</th>\n');
        mdFile.write('<th>RGB</th>\n');
        mdFile.write('<th>HSL</th>\n');
        mdFile.write('</tr>\n');

        for (const [colorName, colorHex] of Object.entries(colorTypeColors)) {
            const colorRgb = convert.hex.rgb(colorHex);
            const colorHsl = convert.hex.hsl(colorHex);
            mdFile.write(`<tr>\n`);
            mdFile.write(`<td><img src="assets/palette/${colorType}-${colorName}.png" alt="${colorName}"></td>\n`);
            mdFile.write(`<td><code>${colorName}</code></td>\n`);
            mdFile.write(`<td><code>${colorHex}</code></td>\n`);
            mdFile.write(`<td><code>${colorRgb}</code></td>\n`);
            mdFile.write(`<td><code>${colorHsl}</code></td>\n`);
            mdFile.write(`</tr>\n`);
            console.log(`Added ${colorName} of type ${colorType} to palette.md`);
        }
        mdFile.write('</table>');
        mdFile.write('</details>\n');
        console.log(`Added ${colorType} to palette.md`);
    }
    mdFile.end();
    
    console.log('All done!');
}

main();