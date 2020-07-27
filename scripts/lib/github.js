import octokitRest from "@octokit/rest";
import debug from "debug";
import { get } from "lodash";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokitDebug = debug("octokitDebug");

function getOctokit() {
  const options = {};

  if (GITHUB_TOKEN) {
    options.auth = `token ${GITHUB_TOKEN}`;
  }

  return octokitRest(options);
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
