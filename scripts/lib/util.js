import moment from "moment";
import { pick, groupBy } from "lodash";

function getLabelData(labels) {
  return labels.map((label) => pick(label, ["name", "color"]));
}

function getAssignees(assignees) {
  return assignees.map((assignee) => pick(assignee, ["login", "html_url"]));
}

/** Issue must have one of these labels to be included in the changelog */
const EXPECTED_LABELS = ["bug", "enhancement", "feature"];
const EXCLUDED_LABELS = ["duplicate", "invalid", "question"];

export function filterIssuesByLabels(issues) {
  return issues.filter((issue) => {
    const hasExpectedLabel = issue.labels?.some(({ name }) =>
      EXPECTED_LABELS.includes(name)
    );

    if (hasExpectedLabel) {
      return !issue.labels?.some(({ name }) => EXCLUDED_LABELS.includes(name));
    }

    return false;
  });
}

export function getData(issues) {
  const extractedData = issues.map((issue) => {
    const data = pick(issue, [
      "id",
      "html_url",
      "title",
      "number",
      "closed_at",
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
