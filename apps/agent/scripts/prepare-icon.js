/**
 * scripts/prepare-icon.js
 *
 * Copies the gymcentrix-logo.png from the web app's public folder
 * and saves it as assets/icon.ico for the tray application.
 *
 * Note: .ico files support multiple sizes. For best results, convert
 * the PNG to a proper .ico using a tool like ImageMagick:
 *   magick convert ../../apps/web/public/app/gymcentrix-logo.png -resize 256x256 assets/icon.ico
 *
 * This script provides a simple fallback that copies the PNG
 * renamed as .ico (works with node-systray on Windows).
 *
 * Run: node scripts/prepare-icon.js
 */

const fs = require("fs");
const path = require("path");
const pngToIco = require("png-to-ico").default;
const { Jimp } = require("jimp");

const os = require("os");
const SRC = path.resolve(
  __dirname,
  "../../../apps/web/public/app/gymcentrix-logo.png"
);
const DEST = path.resolve(__dirname, "../assets/icon.ico");

async function prepareIcon() {
  fs.mkdirSync(path.dirname(DEST), { recursive: true });

  if (!fs.existsSync(SRC)) {
    console.error(`Source image not found: ${SRC}`);
    process.exit(1);
  }

  try {
    // 1. Resize the image to 64x64 square (windows tray optimal constraint)
    const img = await Jimp.read(SRC);
    img.resize({ w: 64, h: 64 });
    
    // 2. Save square image to a temp file
    const tempPng = path.join(os.tmpdir(), "gymcentrix-temp-icon.png");
    await new Promise((resolve, reject) => {
      img.write(tempPng, (err) => err ? reject(err) : resolve());
    });

    // 3. Convert temp square PNG to ICO
    const buf = await pngToIco(tempPng);
    fs.writeFileSync(DEST, buf);
    
    console.log(`Icon converted successfully: ${SRC} → ${DEST}`);
  } catch (err) {
    console.error("Failed to convert icon:", err);
    process.exit(1);
  }
}

prepareIcon();
