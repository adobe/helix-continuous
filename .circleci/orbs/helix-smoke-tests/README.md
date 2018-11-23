# helix-smoke-tests orb

Goal of this orb - provide the necessary CircleCI steps to run smoke tests when pushing to a branch of one of the Helix repository. This is required to validate that the changes made do not break the helix-cli and our consumer websites. The orb runs the following steps:

* call CircleCI API to launch the smoke tests stored in this repository passing the current branch as a parameter
* ([smoke tests](../../config.yml) are executed from within this repository)
* the orb wait for smoke tests execution
* the result of the test are returned and appears as part of the Pull Request validation: if the smoke test fails, the PR will be flagged as failing.

## Usage

To integrate this orb to a CircleCI config, include the following line to `.circleci/config.yml` of Helix repo that needs to trigger the smoke when code is changed:

```yml
orbs:
    helix-smoke-tests: adobe/helix-smoke-tests@0.0.4

workflows:
  # ...
  # should contain repo build steps
  
  smoke:
    jobs:
        - helix-smoke-tests/run:
            token: ${SMOKE_TEST_TOKEN}
            remote_repo: adobe/helix-continuous
```

`SMOKE_TEST_TOKEN` is an environment variable that needs to be added to the project that consumes the orb: it corresponds to [CircleCI API token](https://circleci.com/gh/adobe/helix-continuous/edit#api) of the helix-continuous in order to be able to trigger the smoke tests job "remotely".

The `remote_repo` property is the repo where the smoke tests are stored. For now, it is always `adobe/helix-continuous`.

You can validate the new `config.yml` file with command: `circleci config process .circleci/config.yml`