import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/worker-bundled.js',
  external: ['fs', 'path', 'deasync', 'graceful-fs/promises']
}).catch(() => process.exit(1));