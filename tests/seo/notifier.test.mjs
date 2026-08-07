import assert from "node:assert/strict";
import test from "node:test";

import { submitIndexNow } from "../../scripts/seo/notifier.mjs";

test("retries a temporary IndexNow failure and submits only the supplied URLs", async () => {
  let attempts = 0;
  let submittedPayload;

  const result = await submitIndexNow({
    siteUrl: "https://body-re.store",
    key: "test-key",
    urls: ["https://body-re.store/about"],
    sleep: async () => {},
    fetchImpl: async (_url, options) => {
      attempts += 1;
      submittedPayload = JSON.parse(options.body);

      if (attempts === 1) {
        return new Response("temporary", { status: 503 });
      }

      return new Response("", { status: 202 });
    },
  });

  assert.equal(attempts, 2);
  assert.equal(result.status, "success");
  assert.equal(result.submitted, 1);
  assert.deepEqual(submittedPayload.urlList, ["https://body-re.store/about"]);
  assert.equal(submittedPayload.keyLocation, "https://body-re.store/test-key.txt");
});
