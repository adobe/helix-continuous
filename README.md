# helix-continuous

## Status
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/helix-continuous/master.svg)](https://circleci.com/gh/adobe/helix-continuous/tree/master)
[![GitHub license](https://img.shields.io/github/license/adobe/helix-continuous.svg)](https://github.com/adobe/helix-continuous/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/helix-continuous.svg)](https://github.com/adobe/helix-continuous/issues)
[![Greenkeeper badge](https://badges.greenkeeper.io/adobe/helix-continuous.svg)](https://greenkeeper.io/)
[![LGTM Code Quality Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/adobe/helix-continuous.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/adobe/helix-continuous)

This repo hosts everything needed for Project Helix CI/CD. In its current initial version, the repo contains:

* the [CircleCI config](.circleci/config.yml) that executes some smoke tests
* a [CircleCI orb](.circleci/orbs/helix-smoke-tests/README.md) which can be used by Helix repositories to launch the smoke tests, wait for execution and track output.
* a little [Node util](scripts/gdm/README.md) which transforms all @adobe dependencies of an npm module into github dependencies (instead of fixed version dependencies). This is used by the smoke tests to build an helix-cli from master branches + a branch to validate smoke tests against a Pull Request.

