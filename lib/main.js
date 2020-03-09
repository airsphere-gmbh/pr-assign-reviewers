"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github/lib/github");
const github_2 = __importDefault(require("@actions/github"));
const core_1 = __importDefault(require("@actions/core"));
function run() {
    const context = github_2.context;
    const token = core_1.getInput("repo-token");
    const client = new github_1.GitHub(token);
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    let number;
    if (context.payload.pull_request)
        number = context.payload.pull_request.number;
    else if (context.payload.issue)
        number = context.payload.issue.number;
    else
        number = -1;
    client.pulls.listReviewRequests({
        owner,
        repo,
        pull_number: number
    }).then(l => {
        let assignees = l.data.users.map(u => u.login);
        client.issues.addAssignees({
            owner,
            repo,
            issue_number: number,
            assignees
        });
    });
}
//Entrypoint for github
run();
