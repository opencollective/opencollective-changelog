import React, { Fragment } from "react";
import moment from "moment";
import fetch from "isomorphic-unfetch";
import styled from "styled-components";
import StyledLink from "@bit/opencollective.design-system.components.styled-link";
import StyledTag from "@bit/opencollective.design-system.components.styled-tag";

import Logo from "../components/Logo";
import {
  H1,
  P,
} from "@bit/opencollective.design-system.components.styled-text";

const StyledIssueLabel = styled(StyledTag)`
  padding: 2px 5px;
  font-size: 10px;
  width: 100px;
  text-transform: uppercase;
  text-align: center;
  border-radius: 3px;
  box-sizing: border-box;
  margin-right: 11px;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changelogs: {},
    };
  }

  async componentDidMount() {
    try {
      const result = await fetch("/api/changelogs");
      if (result.ok) {
        const changelogs = await result.json();
        this.setState({
          changelogs,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  getIssueLabel(labels) {
    return labels.find((label) => {
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
    const dates = issues.map((issue) => {
      return moment(issue.closed_at, "YYYY-MM-DD");
    });

    return {
      from: moment.min(dates),
      to: moment.max(dates),
    };
  }

  getWeeks(changelogs) {
    return Object.keys(changelogs).reverse();
  }

  reformatLabel(label = {}) {
    switch (label.name) {
      case "bug":
        label.name = "fixed";
        label.type = "error";
        break;
      case "enhancement":
        label.name = "improved";
        label.type = "info";
        break;
      case "feature":
        label.type = "success";
    }
    return label;
  }

  renderAssignees(assignees) {
    if (assignees.length >= 1) {
      return (
        <Fragment>
          Thanks{" "}
          {assignees.map((assignee) => (
            <StyledLink
              key={assignee.login}
              href={assignee.html_url}
              openInNewTab={true}
            >
              @{assignee.login}
            </StyledLink>
          ))}
        </Fragment>
      );
    }
  }

  renderWeekIssues(week, year) {
    const { changelogs } = this.state;
    const issues = changelogs[year][week];
    const { from, to } = this.getDateRange(issues);

    return (
      <Fragment key={week}>
        <style jsx>
          {`
            .changeHeader {
              display: flex;
              align-items: center;
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
          `}
        </style>
        <section>
          <header className="changeHeader">
            <StyledTag type="dark">{`${from.format("Wo")} Week`}</StyledTag>
            <P fontSize="20px" marginLeft="10px">
              {`${from.format("MMMM")} ${from.format("Do")} - ${to.format(
                "Do"
              )} ${to.format("YYYY")}`}
            </P>
          </header>
          {issues.map((issue) => {
            let label = this.getIssueLabel(issue.labels);
            label = this.reformatLabel(label);
            return (
              <ul className="issueList" key={issue.id}>
                <li>
                  <StyledIssueLabel type={label.type}>
                    {label.name}
                  </StyledIssueLabel>
                  <div className="title">
                    {issue.title} -{" "}
                    <StyledLink
                      href={issue.html_url}
                      openInNewTab={true}
                    >{`#${issue.number}`}</StyledLink>
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

    return (
      <Fragment>
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
              padding: 0;
            }
            .topLinks li {
              list-style: none;
              margin: 5px 10px;
              font-size: 14px;
            }
            .description {
              padding: 20px;
              border-bottom: 1px #e1e4e8 solid;
              margin-bottom: 20px;
            }
            .changelogWrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: auto;
            }
          `}
        </style>
        <div>
          <div className="header">
            <Logo />
            <ul className="topLinks">
              <li>
                <StyledLink
                  href="https://github.com/opencollective/opencollective"
                  openInNewTab={true}
                >
                  Overview
                </StyledLink>
              </li>
              <li>
                <StyledLink href="/" color="black">
                  Release Notes
                </StyledLink>
              </li>
              <li>
                <StyledLink
                  href="https://docs.opencollective.com"
                  openInNewTab={true}
                >
                  Docs
                </StyledLink>
              </li>
            </ul>
          </div>
          <div className="changelogWrapper">
            <div>
              <div className="description">
                <H1 textAlign="center">Release notes for Open Collective</H1>
              </div>
              {Object.keys(changelogs).map((year) =>
                this.getWeeks(changelogs[year]).map((week) =>
                  this.renderWeekIssues(week, year)
                )
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
