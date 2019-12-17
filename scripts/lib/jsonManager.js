import editJsonFile from "edit-json-file";
import path from "path";
import { uniqBy } from "lodash";

const changelogs2019Path = path.resolve(
  __dirname,
  "../../changelogs/2019.json"
);
const configFile = path.resolve(__dirname, "../config.json");

const logs = editJsonFile(changelogs2019Path);
const config = editJsonFile(configFile);

export function saveWeekLogs(week, issues) {
  const weekPath = `week-${week}`;
  const weekIssues = logs.get(weekPath);
  if (weekIssues) {
    logs.set(weekPath, uniqBy([...weekIssues, ...issues], "id"));
  } else {
    logs.set(weekPath, issues);
  }
  logs.save();
}

export function getWeekLogs(week) {
  return logs.get(`week-${week}`);
}

/**
 *  Curent year is 2019 which is the default
 * @todo enable other years
 */
export function getYearLogs() {
  return logs.get();
}

export function saveMultipleLogs(issues) {
  for (const week in issues) {
    saveWeekLogs(week, issues[week]);
  }
}

export function setLastChangeLogUpdateDate(date) {
  config.set("updatedSince", date);
  config.save();
}
