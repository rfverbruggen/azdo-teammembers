# Azure DevOps Team Members

[![CI](https://github.com/rfverbruggen/azdo-teammembers/actions/workflows/ci.yml/badge.svg)](https://github.com/rfverbruggen/azdo-teammembers/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rfverbruggen_azdo-teammembers&metric=coverage)](https://sonarcloud.io/summary/new_code?id=rfverbruggen_azdo-teammembers)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rfverbruggen_azdo-teammembers&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rfverbruggen_azdo-teammembers)


## Features

Add your team members to the VS Code settings.
![Extension settings](https://github.com/rfverbruggen/azdo-teammembers/raw/main/images/extension_settings.png)

The names will be added as CodeLenses above the line where a guid reference is used.

An autocomplete will trigger on the `@` sign with the team member names, the guid reference will be inserted.
![CodeLenses and CompletionItems](https://github.com/rfverbruggen/azdo-teammembers/raw/main/images/codelenses_and_completionitems.png)

## Extension Settings

This extension contributes the following settings:

* `azdo-teammembers.teammembers`: add a list of team members to the extension
