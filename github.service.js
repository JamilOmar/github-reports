const { Octokit, core } = require("octokit");
const PAGE_SIZE = 50;


class GithubService {
  constructor(authToken) {
    this.octokit = new Octokit({
      auth: authToken,
    });
  }

  async getRepos(org) {
    const iterator = this.octokit.paginate.iterator(
        this.octokit.rest.repos.listForOrg, {
      org: org,
      per_page: PAGE_SIZE,
    });
    const result = [];
    for await (const { data: repos } of iterator) {
      for (const repo of repos) {
        result.push({ name: repo.name });
      }
    }
    return result;
  }

  async getCollaborators(org, repo) {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.repos.listCollaborators,
      {
        owner: org,
        repo: repo,
        per_page: PAGE_SIZE,
      }
    );

    const result = [];
    for await (const { data: collaborators } of iterator) {
      for (const collaborator of collaborators) {
        result.push({
          username: collaborator.login,
          url: collaborator.url,
          type: collaborator.type,
          siteAdmin: collaborator.site_admin,
          role: collaborator.role_name,
          repo,
          org
        });
      }
    }
    return result;
  }

  async getReposWithCollaborators(org) {
    const respositories = await this.getRepos(org);
    const result = [];
    for (const repo of respositories) {
        let collaborators = await this.getCollaborators(org,repo.name);
        for(let collaborator of collaborators){
            result.push(collaborator)

        }
    }
    return result;
  }
}

module.exports = GithubService;
