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

  async getCollaborators(org, repo, outsideCollaborators) {
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
       const username =collaborator.login; 
        const isOutside = (outsideCollaborators !=undefined)? outsideCollaborators.find((x=>x.username == username))!= undefined :undefined
        result.push({
          username,
          url: collaborator.url,
          type: collaborator.type,
          isOutside,
          siteAdmin: collaborator.site_admin,
          role: collaborator.role_name,
          repo,
          org
        });
      }
    }
    return result;
  }

  async getOutsideCollaborators(org) {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.orgs.listOutsideCollaborators,
      {
        org,
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
          isOutside: true,
          siteAdmin: collaborator.site_admin,
          role: collaborator.role_name,
          repo:"",
          org
        });
      }
    }
    return result;
  }

  async getReposWithCollaborators(org) {
    const respositories = await this.getRepos(org);
    const outsideCollaborators = await this.getOutsideCollaborators(org);
    const result = [];
    for (const repo of respositories) {
        let collaborators = await this.getCollaborators(org,repo.name,outsideCollaborators);
        for(let collaborator of collaborators){
            result.push(collaborator)
        }
    }
    return result;
  }
  async getSingleRepoWithCollaborators(org,repo) {
    const outsideCollaborators = await this.getOutsideCollaborators(org);
    return await this.getCollaborators(org,repo,outsideCollaborators);
  }
}

module.exports = GithubService;
