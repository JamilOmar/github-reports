#!/usr/bin/env node
const { Command } = require("commander");
const { parse } = require("json2csv");
const GithubService = require("./github.service");
const fs = require('fs');
const program = new Command();

program
  .name("github-report")
  .description("CLI to perform reports againts GitHub")
  .version("0.0.1");

program
  .command("repos")
  .description("Show all the repositories")
  .argument("<org>", "org name")
  .option("--first", "display just the first substring")
  .option("-a, --all", "includes all the members for each repo")
  .option("-f, --file <string>", "file to export the list of members")
  .action(async (org, options) => {
    const authToken = process.env.GH_TOKEN;
    const ghService = new GithubService(authToken);
  let result;
  let fields;
    if(options.all){
        result =  await ghService.getReposWithCollaborators(org);
        fields = ["username", "url", "type","siteAdmin" , "role","repo","org"];
    }else{
        result = await ghService.getRepos(org);
        fields = ["name"]
    }
  
    if (options.file) {
        try {
          const csv = parse(result,{ fields });
          fs.writeFileSync(options.file,csv);
         
        } catch (err) {
          console.error(err);
        }
      }
      console.log(result)
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
    const result = await ghService.getCollaborators(org, repo);
    if (options.file) {
      try {
        const fields = ["username", "url", "type","siteAdmin" , "role","repo","org"];
        const csv = parse(result,{ fields });
        fs.writeFileSync(options.file,csv);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(result)
  
  });

program.parse();
