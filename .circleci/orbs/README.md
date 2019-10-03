# Helix Orbs

This folder contains the [CircleCI orbs](https://circleci.com/docs/2.0/creating-orbs/) used by the Helix project.

Current organisation: `adobe` (to publish, you need to be a member of Adobe CircleCI org)
Current namespace: `adobe` (namespace is what appears in the first part of the orb name)

List of available orbs:

* [adobe/helix-smoke-tests](helix-smoke-tests/orb.yml)
* [adobe/helix-post-deploy](helix-post-deploy/orb.yml)

## Usage

List of `adobe` orbs: `circleci orb list adobe`

Modify an existing org and publish a new version:

* first validate the yml file: `circleci orb validate helix-smoke-tests/orb.yml`
* publish increment a new version (semver: patch / minor / major): `circleci orb publish increment helix-smoke-tests/orb.yml adobe/helix-smoke-tests patch`
* Update the version in the orb [readme](helix-smoke-tests/README.md)

Setup for publishing:

* run `circleci setup`
* the CircleCI token is your [personal CircleCI API token](https://circleci.com/account/api)