import octokitRest from "@octokit/rest";
import debug from "debug";
import { get } from "lodash";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokitDebug = debug("octokitDebug");

function getOctokit() {
  if (!GITHUB_TOKEN) {
    throw new Error("Script requires GITHUB_TOKEN");
  }

  return octokitRest({ auth: `token ${GITHUB_TOKEN}` });
}

function getData(res) {
  octokitDebug(`RateLimit Remaining: ${res.headers["x-ratelimit-remaining"]}`);
  return res.data;
}

export function fetchWithOctokit(path, params) {
  octokitDebug(`Fetch with octokit`);
  const octokit = getOctokit();
  const func = get(octokit, path);
  return func(params).then(getData);
}
