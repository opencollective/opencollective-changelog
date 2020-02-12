import editJsonFile from "edit-json-file"
import fs from "fs";
import path from "path";
import { uniqBy } from "lodash";

const configFile = path.resolve(__dirname, "../config.json");
const config = editJsonFile(configFile);

function getLogPath(year) {
  return path.resolve(__dirname, `../../changelogs/${year}.json`);
}

function logs(year) {
  return editJsonFile(getLogPath(year));
}

export function saveWeekLogs(year, week, issues) {
  const weekPath = `week-${week}`;
  const yearLog = logs(year);
  const weekIssues = yearLog.get(weekPath);
  if (weekIssues) {
    yearLog.set(weekPath, uniqBy([...weekIssues, ...issues], "id"));
  } else {
    yearLog.set(weekPath, issues);
  }
  yearLog.save();
}

export function getWeekLogs(year, week) {
  return logs(year).get(`week-${week}`);
}

export function getYearLogs(year) {
  return logs(year).get();
}

export function saveMultipleLogs(year, issues) {
  for (const week in issues) {
    saveWeekLogs(year, week, issues[week]);
  }
}

export function setLastChangeLogUpdateDate(date) {
  config.set("updatedSince", date);
  config.save();
}

export function createNewLog(year) {
  return fs.writeFileSync(getLogPath(year), JSON.stringify({}), "utf-8");
}
