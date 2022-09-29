## Github Repo

# Requirements
- have nodejs installed.
- have read access to all the repos and collaborators.
- create a [GH PAT Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- set the env GH_TOKEN with the PAT Token's value
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