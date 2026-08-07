class TransientHttpError extends Error {
  constructor(message) {
    super(message);
    this.name = "TransientHttpError";
  }
}

const defaultSleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function asMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function isTransientStatus(status) {
  return status === 429 || status >= 500;
}

export async function retry(operation, { attempts = 3, sleep = defaultSleep } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (!(error instanceof TransientHttpError) || attempt === attempts) {
        throw error;
      }
      await sleep(250 * 2 ** (attempt - 1));
    }
  }

  throw lastError;
}

export async function submitIndexNow({ siteUrl, key, urls, fetchImpl = fetch, sleep = defaultSleep }) {
  if (!urls.length) {
    return { service: "IndexNow", status: "skipped", reason: "No changed live URLs" };
  }
  if (!key) {
    return { service: "IndexNow", status: "skipped", reason: "INDEXNOW_KEY is missing" };
  }

  const parsedSiteUrl = new URL(siteUrl);
  const payload = {
    host: parsedSiteUrl.host,
    key,
    keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
    urlList: urls.slice(0, 10_000),
  };

  await retry(
    async () => {
      const response = await fetchImpl("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });

      if (response.status === 200 || response.status === 202) {
        return;
      }

      const body = await response.text();
      const message = `IndexNow HTTP ${response.status}: ${body.slice(0, 300)}`;
      if (isTransientStatus(response.status)) {
        throw new TransientHttpError(message);
      }
      throw new Error(message);
    },
    { sleep },
  );

  return { service: "IndexNow", status: "success", submitted: payload.urlList.length };
}

export async function verifyLiveUrl({ url, siteUrl, fetchImpl = fetch }) {
  if (new URL(url).origin !== new URL(siteUrl).origin) {
    throw new Error(`Foreign URL rejected: ${url}`);
  }

  const response = await fetchImpl(url, {
    redirect: "follow",
    headers: { "user-agent": "BodyRestore-SEO-Notifier/1.0" },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  return { service: `Verify ${url}`, status: "success" };
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

async function googleAccessToken(credentialsJson, fetchImpl) {
  const credentials = JSON.parse(credentialsJson);
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/webmasters",
      aud: credentials.token_uri ?? "https://oauth2.googleapis.com/token",
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );
  const { createSign } = await import("node:crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  signer.end();
  const assertion = `${header}.${claim}.${signer.sign(credentials.private_key, "base64url")}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetchImpl(credentials.token_uri ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(`Google OAuth HTTP ${response.status}: ${payload.error ?? "missing access token"}`);
  }
  return payload.access_token;
}

export async function submitGoogleSitemap({ google, sitemapUrl, fetchImpl = fetch }) {
  if (!google.siteUrl || !google.credentialsJson) {
    return { service: "Google Search Console", status: "skipped", reason: "Google credentials are missing" };
  }

  const token = await googleAccessToken(google.credentialsJson, fetchImpl);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(google.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetchImpl(endpoint, {
    method: "PUT",
    headers: { authorization: `Bearer ${token}`, "content-length": "0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Google Search Console HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return { service: "Google Search Console", status: "success", sitemap: sitemapUrl };
}

export async function notifyWebSub({ enabled, hubUrl, feedUrl, fetchImpl = fetch }) {
  if (!enabled) {
    return { service: "WebSub", status: "skipped", reason: "Disabled" };
  }
  const response = await fetchImpl(hubUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ "hub.mode": "publish", "hub.url": feedUrl }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`WebSub HTTP ${response.status}`);
  }
  return { service: "WebSub", status: "success" };
}

export function failedResult(service, error) {
  return { service, status: "failed", error: asMessage(error) };
}
