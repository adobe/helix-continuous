# helix-post-deploy orb

This orb contains centralized commands for use after deploying a new version of a Helix service.

## Orb

To integrate this orb into a CircleCI config, include the following line in `.circleci/config.yml` of a Helix repo:

```yml
orbs:
  helix-post-deploy: adobe/helix-post-deploy@1.0.2
```

## Commands

### Monitoring

The command `monitoring` configures monitoring and alerting in New Relic, and links to Statuspage for public visibility.

You can use it in your CircleCI config as follows:
```yml
jobs:
  my-job:
    executor: node10
    steps:
      - ...
      - helix-post-deploy/monitoring
```
The following parameters can be specified (all optional, or configurable in your project's package.json):
- `action_name`: The name of the action deployed in I/O Runtime (defaults to your project's package name after `@adobe/helix-`)
- `statuspage_name`: The name to be used for the Statuspage component (defaults to your project's package name)
- `statuspage_group`: The name of the component group in Statuspage to add the new component to (optional, configurable in your project's package.json)
- `newrelic_name`: The name to be used for the New Relic monitor, alert policy and notification channel (defaults to your project's package name)
- `newrelic_group_policy`: A collective alert policy in New Relic to add the monitor to (optional, configurable in your project's package.json)

#### Dependencies

Add `@adobe/helix-status@5.3.0` (or higher) to `devDependecies` in your project's package.json. It contains the tooling for the `monitoring` command.

#### 3rd Party Configurations

In CircleCI, add the following environment variables to the project consuming the orb (e.g. https://circleci.com/gh/myorg/myservice/edit#env-vars):
- `NEWRELIC_AUTH`: The admin's API key for your New Relic account (not the user API key!)
- `STATUSPAGE_AUTH`: The API user key for your Statuspage account (this is the user API key)
- `STATUS_PAGE_PAGE_ID`: The ID of the page to add components to in Statuspage

In New Relic Synthetics, add the following secure credentials:
- `WSK_AUTH_HELIX`: The OpenWhisk auth key for the `helix` namespace
