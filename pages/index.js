import React, { Fragment } from "react";
import moment from "moment";
import fetch from "isomorphic-unfetch";

import Logo from "../components/Logo";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changelogs: {}
    };
  }

  async componentDidMount() {
    try {
      const result = await fetch("/api/changelogs");
      if (result.ok) {
        const changelogs = await result.json();
        this.setState({
          changelogs
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  getIssueLabel(labels) {
    return labels.find(label => {
      if (
        label.name === "feature" ||
        label.name === "enhancement" ||
        label.name === "bug" ||
        label.name === "test"
      ) {
        return label;
      }
    });
  }

  getDateRange(issues) {
    const dates = issues.map(issue => {
      return moment(issue.closed_at, "YYYY-MM-DD");
    });

    return {
      from: moment.min(dates),
      to: moment.max(dates)
    };
  }

  getWeeks(changelogs) {
    return Object.keys(changelogs).reverse();
  }

  reformatLabel(label = {}) {
    switch (label.name) {
      case "bug":
        label.name = "fixed";
        label.color = "0066d6";
        break;
      case "enhancement":
        label.name = "improved";
        label.color = "e1663f";
        break;
      case "feature":
        label.color = "28a745";
    }
    return label;
  }

  renderAssignees(assignees) {
    if (assignees.length >= 1) {
      return (
        <Fragment>
          Thanks{" "}
          {assignees.map(assignee => (
            <a
              key={assignee.login}
              href={assignee.html_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              @{assignee.login}
            </a>
          ))}
        </Fragment>
      );
    }
  }

  renderWeekIssues(week) {
    const { changelogs } = this.state;
    const issues = changelogs[week];
    const { from, to } = this.getDateRange(issues);

    return (
      <Fragment key={week}>
        <style jsx>
          {`
            .changeHeader {
              display: flex;
              align-items: baseline;
            }
            .weeklabel {
              padding: 5px;
              background: #6f41c0;
              color: #fff;
              border-radius: 4px;
            }
            .dateRange {
              font-size: 20px;
              margin-left: 10px;
            }
            .issueList {
              margin-left: 50px;
            }
            .issueList li {
              list-style: none;
              display: flex;
              align-items: baseline;
              font-size: 14px;
            }
            .issueLabel {
              padding: 2px 5px;
              font-size: 10px;
              width: 100px;
              text-transform: uppercase;
              text-align: center;
              color: #fff;
              border-radius: 3px;
              box-sizing: border-box;
              margin-right: 11px;
            }
          `}
        </style>
        <section>
          <header className="changeHeader">
            <span className="weeklabel">{`${from.format("Wo")} Week`}</span>
            <p className="dateRange">
              {`${from.format("MMMM")} ${from.format("Do")} - ${to.format(
                "Do"
              )} ${to.format("YYYY")}`}
            </p>
          </header>
          {issues.map(issue => {
            let label = this.getIssueLabel(issue.labels);
            label = this.reformatLabel(label);
            return (
              <ul className="issueList" key={issue.id}>
                <li>
                  <div
                    className="issueLabel"
                    style={{ backgroundColor: `#${label.color}` }}
                  >
                    {label.name}
                  </div>
                  <div className="title">
                    {issue.title} -{" "}
                    <a
                      href={issue.html_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >{`#${issue.number}`}</a>
                    . {this.renderAssignees(issue.assignees)}
                  </div>
                </li>
              </ul>
            );
          })}
        </section>
      </Fragment>
    );
  }

  render() {
    const { changelogs } = this.state;
    const weeks = this.getWeeks(changelogs);

    return (
      <Fragment>
        <style jsx global>
          {`
            body {
              color: #414141;
            }
            a,
            a:visited {
              color: #4f53f4;
            }
            a:hover {
              text-decoration: underline;
            }
          `}
        </style>
        <style jsx>
          {`
            .header {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin-top: 30px;
            }
            .topLinks {
              display: flex;
            }
            .topLinks li {
              list-style: none;
              margin: 5px 10px;
            }
            .topLinks li a {
              text-decoration: none;
              font-size: 14px;
            }
            .active {
              color: #000;
            }
            .changelogWrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: auto;
            }
            h1 {
              color: #000;
              margin: 0;
            }
            .changelogWrapper {
              margin-top: 20px;
              margin-bottom: 20px;
            }
            .descrpition {
              padding: 20px;
              border-bottom: 1px #e1e4e8 solid;
              margin-bottom: 20px;
            }
            .descrpition h1 {
              font-weight: 500;
            }
          `}
        </style>
        <div>
          <div className="header">
            <Logo />
            <ul className="topLinks">
              <li>
                <a
                  href="https://github.com/opencollective/opencollective"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Overview
                </a>
              </li>
              <li>
                <a href="/" className="active">
                  Release Notes
                </a>
              </li>
              <li>
                <a
                  href="https://docs.opencollective.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>
          <div className="changelogWrapper">
            <div>
              <div className="descrpition">
                <h1>Release notes for Opencollective</h1>
              </div>
              {weeks.map(week => {
                return this.renderWeekIssues(week);
              })}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
