import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

rmSync('out', { recursive: true, force: true });

function runNodeScript(script) {
  const result = spawnSync(process.execPath, [script], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error || result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNodeScript('scripts/seo/prepare-build.mjs');

const result = spawnSync(process.execPath, [join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next'), 'build', '--webpack'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_OUTPUT: 'export',
  },
});

if (result.error) {
  console.error(result.error);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

runNodeScript('scripts/seo/generate-artifacts.mjs');
