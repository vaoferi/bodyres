import assert from "node:assert/strict";
import test from "node:test";

import { pingXmlRpcService } from "../../scripts/seo/xmlrpc.mjs";

test("falls back to weblogUpdates.ping when extendedPing returns an XML-RPC fault", async () => {
  const methods = [];

  const result = await pingXmlRpcService({
    endpoint: "https://ping.example.test/RPC2",
    siteName: "Body Restore",
    siteUrl: "https://body-re.store",
    feedUrl: "https://body-re.store/feed.xml",
    fetchImpl: async (_url, options) => {
      methods.push(options.body.match(/<methodName>([^<]+)<\/methodName>/)[1]);
      if (methods.length === 1) {
        return new Response("<methodResponse><fault/></methodResponse>", { status: 200 });
      }
      return new Response("<methodResponse><params/></methodResponse>", { status: 200 });
    },
  });

  assert.deepEqual(methods, ["weblogUpdates.extendedPing", "weblogUpdates.ping"]);
  assert.equal(result.method, "weblogUpdates.ping");
});
