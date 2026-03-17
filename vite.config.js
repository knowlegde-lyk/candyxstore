import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Only obfuscate when PROTECTED=1 env is set (dist:protected build)
const isProtected = (process.env.PROTECTED || '').trim() === '1';

function obfuscatePlugin() {
  return {
    name: 'vite-obfuscate-chunks',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      if (!isProtected) return; // Skip for normal builds
      console.log('[Obfuscate] Protecting frontend chunks...');
      for (const key of Object.keys(bundle)) {
        const chunk = bundle[key];
        if (chunk.type === 'chunk' && chunk.code) {
          const result = JavaScriptObfuscator.obfuscate(chunk.code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.4,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 1.0,
            stringArrayWrappersCount: 2,
            splitStrings: true,
            splitStringsChunkLength: 5,
            deadCodeInjection: false,
            debugProtection: true,
            debugProtectionInterval: 2000,
            disableConsoleOutput: false,
            renameGlobals: false,
            selfDefending: false,
            target: 'browser',
          });
          chunk.code = result.getObfuscatedCode();
          console.log(`  ✓ ${key}`);
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    obfuscatePlugin(),
  ],
})
