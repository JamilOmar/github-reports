## Github Repo

# Requirements
- have nodejs installed.
- have read access to all the repos and collaborators.
- create a [GH PAT Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
  Artem: new PAT token does not seem to work, create classic token but be carefull with permissions
- set the env GH_TOKEN with the PAT Token's value
- run `npm install` in the root of this project
```sh
export GH_TOKEN=[your token value]
```

## Commands
- Get all Repos
```sh
node . repos [repo name] --file [optional path to save to file] --all [optional includes all the repo members]

node . repos axleresearch --file "all-org.csv" --all
node . repos axleresearch --file "org.csv"
```

- Get all Members
```sh
node . members [org name] [repo name] --file [optional path to save to file]

node . members axleresearch qhts --file "all-repo.csv"
```

- Get all Outside collaborators
```sh
node . outside-collaborators [org name] --file [optional path to save to file]

node . outside-collaborators axleresearch  --file "outside.csv"
```

- Get branch protection for all Repos
```sh
node . branch-protection [org name] --file [optional path to save to file] --verbose [optional verbose output, also -v]

node . branch-protection labshare --file "report.json"
```