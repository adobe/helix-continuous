# helix-post-deploy orb

Goal of this orb - provide the CircleCI steps for common post-deploy actions when deploying a new version of a Helix service. This is required to validate that the changes made do not break the helix-cli and our consumer websites. The orb runs the following steps:

* Set Up Monitoring: configure monitoring and alerting in New Relic, and link to Statuspage for public visibility
* ... (TBD)

## Use

### CircleCI config

To integrate this orb to a CircleCI config, include the following line to `.circleci/config.yml` of a Helix repo:

```yml
orbs:
  helix-post-deploy: adobe/helix-post-deploy@0.0.1

workflows:
  # ...
  # should contain repo build steps
  
  post-deploy:
    jobs:
    - helix-post-deploy/monitoring:
        name: My Service
```
The following parameters can be specified (all optional, or configurable in your project's package.json):
- `statuspage_name`: The name to be used for the Statuspage component
- `statuspage_group`: The name of the component group in Statuspage to add the new component to 
- `newrelic_name`: The name to be used for the New Relic monitor, alert policy and notification channel
- `newrelic_group_policy`: A collective alert policy in New Relic to add the monitor to

### Dependencies

Add `@adobe/helix-status@5.0.1` to `devDependecies` in your project's package.json. It contains the tooling for the `monitoring` command.

### Environment variables

In CircleCI, add the following environment variables to the project consuming the orb (e.g. https://circleci.com/gh/myorg/myservice/edit#env-vars):
  - `NEWRELIC_AUTH`: The admin's API key for your New Relic account (not the user API key!)
  - `STATUSPAGE_AUTH`: The API user key for your Statuspage account (this is the user API key)
  - `STATUS_PAGE_PAGE_ID`: The ID of the page to add components to in Statuspage

## Debug

TODO

