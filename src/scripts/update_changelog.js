/* eslint-disable no-process-exit */
import moment from "moment";
import "../env";
import config from "./config.json";

import { fetchWithOctokit } from "../lib/github";
import { filterIssuesBylabels, getData } from "../lib/util";
import {
  saveMultipleLogs,
  setLastChangeLogUpdateDate
} from "../lib/jsonManager";

const labels = [{ name: "bug" }, { name: "enhancement" }, { name: "feature" }];

async function run() {
  let issues = [];
  const params = {
    repo: "opencollective",
    owner: "opencollective",
    state: "closed",
    since: config.updatedSince,
    page: 1,
    per_page: 100
  };

  while (true) {
    const fetchedIssues = await fetchWithOctokit("issues.listForRepo", params);
    issues = [...issues, ...fetchedIssues];

    if (fetchedIssues.length < params.page) {
      break;
    }
    params.page++;
  }
  issues = filterIssuesBylabels(issues, labels);
  issues = getData(issues);
  return saveMultipleLogs(issues);
}

run()
  .then(() => {
    console.log(">>> Completed!");
    setLastChangeLogUpdateDate(moment().format());
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit();
  });
