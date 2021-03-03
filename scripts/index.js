/* eslint-disable no-process-exit */
import moment from "moment";
import "./env";
import config from "./config.json";

import { fetchWithOctokit } from "./lib/github";
import { filterIssuesByLabels, getData } from "./lib/util";
import {
  saveMultipleLogs,
  setLastChangeLogUpdateDate,
} from "./lib/jsonManager";

async function run() {
  let issues = [];
  const params = {
    repo: "opencollective",
    owner: "opencollective",
    state: "closed",
    since: config.updatedSince,
    page: 1,
    per_page: 100,
  };

  while (true) {
    const fetchedIssues = await fetchWithOctokit("issues.listForRepo", params);
    issues = [...issues, ...fetchedIssues];

    if (fetchedIssues.length < params.page) {
      break;
    }
    params.page++;
  }
  issues = filterIssuesByLabels(issues);
  issues = getData(issues);
  return saveMultipleLogs(issues);
}

run()
  .then(() => {
    console.log(">>> Completed!");
    setLastChangeLogUpdateDate(moment().format("YYYY-MM-DD"));
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit();
  });
