// ═══════════════════════════════════════════════════════════
// CandyX Build — Protected production build
// 1. Obfuscate main.js (strings + control flow)
// 2. Build with electron-builder
// 3. Restore original main.js
// ═══════════════════════════════════════════════════════════
const fs = require('fs');
const { execSync } = require('child_process');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('[Build] Starting protected build...\n');

// Step 1: Backup main.js
console.log('[1/4] Backing up main.js...');
fs.copyFileSync('main.js', 'main.js.bak');

// Step 2: Obfuscate main.js
console.log('[2/4] Obfuscating main.js...');
const source = fs.readFileSync('main.js', 'utf8');
const result = JavaScriptObfuscator.obfuscate(source, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    stringArrayWrappersCount: 2,
    splitStrings: true,
    splitStringsChunkLength: 8,
    deadCodeInjection: false,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: false, // Keep console for script output
    renameGlobals: false,
    selfDefending: false,
    target: 'node',
});
fs.writeFileSync('main.js', result.getObfuscatedCode());
console.log('    Original:', source.length, 'bytes');
console.log('    Obfuscated:', result.getObfuscatedCode().length, 'bytes');

// Step 3: Run electron-builder
console.log('[3/4] Building with electron-builder...');
try {
    execSync('npx electron-builder --publish always', { stdio: 'inherit' });
} catch (err) {
    console.error('[Build] electron-builder failed');
    fs.copyFileSync('main.js.bak', 'main.js');
    fs.unlinkSync('main.js.bak');
    process.exit(1);
}

// Step 4: Restore original main.js
console.log('[4/4] Restoring original main.js...');
fs.copyFileSync('main.js.bak', 'main.js');
fs.unlinkSync('main.js.bak');

console.log('\n[Build] Protected build complete!');
