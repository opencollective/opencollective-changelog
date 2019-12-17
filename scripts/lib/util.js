import moment from "moment";
import { intersectionBy, pick, groupBy } from "lodash";

function getLabelData(labels) {
  return labels.map(label => pick(label, ["name", "color"]));
}

function getAssignees(assignees) {
  return assignees.map(assignee => pick(assignee, ["login", "html_url"]));
}

export function filterIssuesBylabels(issues, labels) {
  return issues.filter(issue => {
    const sharedLabels = intersectionBy(issue.labels, labels, "name");
    if (sharedLabels.length > 0) {
      return true;
    }
    return false;
  });
}

export function getData(issues) {
  const extractedData = issues.map(issue => {
    const data = pick(issue, [
      "id",
      "html_url",
      "title",
      "number",
      "closed_at"
    ]);
    data.labels = getLabelData(issue.labels);
    data.assignees = getAssignees(issue.assignees);
    data.closed_week = moment(issue.closed_at).week();
    return data;
  });

  return groupBy(extractedData, "closed_week");
}

export function getNumberOfYears(numberOfWeeks) {
  const numberOfYears = Math.floor(numberOfWeeks / 52);
  const weeksLeft = numberOfWeeks % 52;
  if (weeksLeft >= 1) {
    return numberOfYears + 1;
  }
  return numberOfYears;
}
