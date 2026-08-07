import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';

const build = spawnSync(process.execPath, ['scripts/build-static.mjs'], {
  stdio: 'inherit',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const root = resolve('out');
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';

const contentTypes = new Map([
  ['.html', 'text/html; charset=UTF-8'],
  ['.css', 'text/css; charset=UTF-8'],
  ['.js', 'text/javascript; charset=UTF-8'],
  ['.json', 'application/json; charset=UTF-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.mp4', 'video/mp4'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.php', 'application/x-httpd-php'],
]);

function resolveStaticPath(requestUrl = '/') {
  const parsed = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = resolve(join(root, safePath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  } else if (!existsSync(filePath) && !extname(filePath)) {
    const htmlPath = `${filePath}.html`;
    const indexPath = join(filePath, 'index.html');
    if (existsSync(indexPath)) {
      filePath = indexPath;
    } else if (existsSync(htmlPath)) {
      filePath = htmlPath;
    }
  }

  return filePath;
}

const server = createServer((request, response) => {
  const filePath = resolveStaticPath(request.url);

  if (!filePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Static export test server: http://${host}:${port}`);
});
