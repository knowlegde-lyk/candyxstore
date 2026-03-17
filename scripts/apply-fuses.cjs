// ═══════════════════════════════════════════════════════════
// Electron Fuses — Disable debug/inspect in production builds
// Run after electron-builder: node scripts/apply-fuses.js
// ═══════════════════════════════════════════════════════════
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

async function applyFuses() {
    // Find the built electron executable
    const distDir = path.join(__dirname, '..', 'dist');
    const possiblePaths = [
        path.join(distDir, 'win-unpacked', 'CANDYXOPTIMIZER.exe'),
        path.join(distDir, 'win-ia32-unpacked', 'CANDYXOPTIMIZER.exe'),
    ];

    let electronPath = null;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            electronPath = p;
            break;
        }
    }

    if (!electronPath) {
        console.log('[Fuses] No unpacked exe found, skipping fuses. Paths checked:');
        possiblePaths.forEach(p => console.log('  -', p));
        return;
    }

    console.log('[Fuses] Applying to:', electronPath);

    await flipFuses(electronPath, {
        version: FuseVersion.V1,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,    // Block --inspect
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false, // Block NODE_OPTIONS
        [FuseV1Options.OnlyLoadAppFromAsar]: true,              // Force ASAR only
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true, // ASAR integrity check
    });

    console.log('[Fuses] Applied successfully!');
}

applyFuses().catch(err => {
    console.error('[Fuses] Error:', err.message);
    process.exit(1);
});
