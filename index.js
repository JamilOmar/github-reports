#!/usr/bin/env node
const { Command } = require("commander");
const { parse } = require("json2csv");
const GithubService = require("./github.service");
const fs = require("fs");
const program = new Command();

program
  .name("github-report")
  .description("CLI to perform reports againts GitHub")
  .version("0.0.1");

program
  .command("repos")
  .description("Show all the repositories")
  .argument("<org>", "org name")
  .option("-a, --all", "includes all the members for each repo")
  .option("-f, --file <string>", "file to export the list of members")
  .action(async (org, options) => {
    const authToken = process.env.GH_TOKEN;
    const ghService = new GithubService(authToken);
    let result;
    let fields;
    if (options.all) {
      result = await ghService.getReposWithCollaborators(org);
      fields = ["username", "url", "type", "siteAdmin", "isOutside", "role", "repo", "org"];
    } else {
      result = await ghService.getRepos(org);
      fields = ["name"];
    }

    if (options.file) {
      try {
        const csv = parse(result, { fields });
        fs.writeFileSync(options.file, csv);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(result);
  });

program
  .command("outside-collaborators")
  .description("Show all the outside collaborators")
  .argument("<org>", "org name")
  .option("-f, --file <string>", "file to export the list of members")
  .action(async (org, options) => {
    const authToken = process.env.GH_TOKEN;
    const ghService = new GithubService(authToken);
    let result;
    let fields;

    result = await ghService.getOutsideCollaborators(org);
    fields = ["username", "url", "type", "siteAdmin", "isOutside", "role", "repo", "org"];

    if (options.file) {
      try {
        const csv = parse(result, { fields });
        fs.writeFileSync(options.file, csv);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(result);
  });

program
  .command(`members`)
  .description(`Show all the repository's members`)
  .argument("<org>", "org name")
  .argument("<repo>", "repo name")
  .option("-f, --file <string>", "file to export the list of members")
  .action(async (org, repo, options) => {
    const authToken = process.env.GH_TOKEN;
    const ghService = new GithubService(authToken);
    const result = await ghService.getSingleRepoWithCollaborators(org, repo);
    if (options.file) {
      try {
        const fields = [
          "username",
          "url",
          "type",
          "siteAdmin",
          "isOutside",
          "role",
          "repo",
          "org",
        ];
        const csv = parse(result, { fields });
        fs.writeFileSync(options.file, csv);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(result);
  });

program
  .command(`branch-protection`)
  .description(`List repos and branch protection status`)
  .argument("<org>", "org name")
  .option("-f, --file <string>", "json file to export the list of members")
  .option("-v, --verbose", "verbose output")
  .action(async (org, options) => {
    const authToken = process.env.GH_TOKEN;
    const ghService = new GithubService(authToken);
    const result = await ghService.getReposBranchProtection(org, options.verbose);
    if (options.file) {
      try {
        const json = JSON.stringify(result);
        fs.writeFileSync(options.file, json);
      } catch (err) {
        console.error(err);
      }
    }
  });

program.parse();
