import { GitHub as GitHubClient } from "@actions/github/lib/github";
import GitHub from "@actions/github";
import Core from "@actions/core";

function run() {
  const context = GitHub.context;
  const token = Core.getInput("repo-token");
  const client = new GitHubClient(token);
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  let number: number; 

if(context.payload.pull_request)
    number = context.payload.pull_request.number;
else if(context.payload.issue)
    number = context.payload.issue.number;
else
    number = -1;

  client.pulls.listReviewRequests({
      owner,
      repo,
      pull_number: number
  }).then(l => {
      let assignees = l.data.users.map(u => u.login);
      client.issues.addAssignees(
          {
            owner,
            repo,
            issue_number: number,
            assignees
          }
      );
  })
}

//Entrypoint for github
run();
