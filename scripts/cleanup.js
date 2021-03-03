/**
 * A script to cleanup invalid entries from old files.
 */

import editJsonFile from "edit-json-file";
import { getLogsPaths } from "./lib/jsonManager";
import { filterIssuesByLabels } from "./lib/util";

getLogsPaths().forEach((filePath) => {
  const file = editJsonFile(filePath);
  const jsonData = file.toObject();
  Object.keys(jsonData).forEach((week) => {
    const issues = jsonData[week];
    const filteredIssues = filterIssuesByLabels(issues);
    file.set(week, filteredIssues);
  });

  file.save();
});
