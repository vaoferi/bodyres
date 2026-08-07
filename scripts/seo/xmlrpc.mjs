function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function stringParameter(value) {
  return `<param><value><string>${escapeXml(value)}</string></value></param>`;
}

export function xmlRpcBody(method, parameters) {
  return `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>${method}</methodName><params>${parameters.map(stringParameter).join("")}</params></methodCall>`;
}

export async function sendXmlRpc({ endpoint, method, parameters, fetchImpl = fetch }) {
  const response = await fetchImpl(endpoint, {
    method: "POST",
    redirect: "follow",
    headers: {
      "content-type": "text/xml; charset=utf-8",
      "user-agent": "BodyRestore-UpdateServices/1.0",
    },
    body: xmlRpcBody(method, parameters),
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.text();

  if (!response.ok || body.includes("<fault") || body.includes("<faultCode>")) {
    throw new Error(`XML-RPC ${method} HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  return { method, status: response.status, body: body.slice(0, 500) };
}

export async function pingXmlRpcService({ endpoint, siteName, siteUrl, feedUrl, fetchImpl = fetch }) {
  try {
    return await sendXmlRpc({
      endpoint,
      method: "weblogUpdates.extendedPing",
      parameters: [siteName, siteUrl, feedUrl],
      fetchImpl,
    });
  } catch (extendedError) {
    try {
      return await sendXmlRpc({
        endpoint,
        method: "weblogUpdates.ping",
        parameters: [siteName, siteUrl],
        fetchImpl,
      });
    } catch (basicError) {
      throw new Error(`Extended ping: ${extendedError.message} | Basic ping: ${basicError.message}`);
    }
  }
}

export async function healthCheckXmlRpcService({ endpoint, fetchImpl = fetch }) {
  return sendXmlRpc({
    endpoint,
    method: "system.listMethods",
    parameters: [],
    fetchImpl,
  });
}
