/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */

'use strict';

const fse = require('fs-extra');
const $ = require('shelljs');

const NODE_MODULES_LOCATION = 'node_modules';
const ADOBE_MODULES = '@adobe';
const ADOBE_ORG = 'adobe';

function install(mod) {
  console.log(`Installing module ${mod.name}`);

  const out = $.exec('npm install --no-audit --prefer-offline', {
    silent: false,
    async: false,
    cwd: mod.path,
  });

  if (out.stderr && out.stderr !== '') {
    console.error('Installing stderr:', out.stderr);
  }
}

function installDependency(depName, cwd) {
  console.log(`Installing dependency ${depName} in ${cwd}`);

  const out = $.exec(`npm install ${depName} --no-audit --prefer-offline`, {
    silent: false,
    async: false,
    cwd,
  });

  if (out.stderr && out.stderr !== '') {
    console.error('Installing stderr:', out.stderr);
  }
}

function listModules(path) {
  const modules = [];

  if (!fse.existsSync(path)) return modules;

  const files = fse.readdirSync(path);

  files.forEach((file) => {
    const modPath = `${path}/${file}`;
    const stat = fse.statSync(modPath);
    if (stat.isDirectory()) {
      modules.push({
        path: modPath,
        name: file,
      });
    }
  });

  return modules;
}

function installAsGitDependency(name, branch, cwd) {
  const dep = `github:${ADOBE_ORG}/${name}#${branch}`;
  installDependency(dep, cwd);
}

function setProgressOff() {
  console.log('Setting npm progress off');

  const out = $.exec('npm set progress=false', {
    silent: false,
    async: false,
  });

  if (out.stderr && out.stderr !== '') {
    console.error('npm set progress off stderr:', out.stderr);
  }
}

function npmls(list) {
  console.log(`npm ls ${list}`);
  const out = $.exec(`npm ls ${list}`, {
    silent: false,
    async: false,
  });

  console.log(out.stdout);

  if (out.stderr && out.stderr !== '') {
    console.error('npm ls stderr:', out.stderr);
  }
}

async function start() {
  const startTime = new Date().getTime();

  setProgressOff();

  // (should be current folder otherwise specified by GDM_MODULE_PATH env variable)
  const modulePath = process.env.GDM_MODULE_PATH || process.cwd();
  console.log(`GDM will transform module located in ${modulePath}`);

  let branches = {};
  try {
    branches = JSON.parse(process.env.GDM_MODULE_BRANCHES || '{}');
    console.log('GDM will use those branches: ', branches);
  } catch (err) {
    console.error('Cannot read GDM_MODULE_BRANCHES variable', err);
    throw err;
  }

  // install the module
  install({
    name: modulePath,
    path: modulePath,
  });

  // will contain the name of all the @adobe modules found during the process
  const allAdobeModuleNames = [];

  // find list of all @adobe modules
  console.log();
  console.log(`Look for all ${ADOBE_MODULES} modules`);

  // contains the list of all @adobe modules from the root module
  const topLevelModules = listModules(`${modulePath}/${NODE_MODULES_LOCATION}/${ADOBE_MODULES}`);

  // save all module names for later use
  topLevelModules.forEach(mod => allAdobeModuleNames.push(mod.name));

  // all @adobe modules that needs to be patched provided via the env variable
  const modulesToPatch = Object.keys(branches);

  if (modulesToPatch.length > 0) {
    modulesToPatch.forEach((modToPatchName) => {
      // if module depends on the module to patch, then install it as a git dependency
      if (topLevelModules.filter(mod => mod.name === modToPatchName).length > 0) {
        // module to patch is a direct dependency, install as a git dependency
        const branch = branches[modToPatchName];
        console.log();
        console.log(`Found module ${modToPatchName} in main module that needs to be installed from git with branch ${branch}`);
        installAsGitDependency(modToPatchName, branch, modulePath);
      }

      // inspect all other modules and their sub dependencies
      topLevelModules.filter(mod => mod.name !== modToPatchName).forEach((mod) => {
        if (mod.name !== modToPatchName) {
          // check sub dependencies of each module
          const subModules = listModules(`${mod.path}/${NODE_MODULES_LOCATION}/${ADOBE_MODULES}`);

          // save the name of modules for later use
          subModules
            .filter(submod => allAdobeModuleNames.indexOf(submod.name) === 0)
            .forEach(submod => allAdobeModuleNames.push(submod.name));

          // if submodules contains the module to patch, then use the git dependency
          subModules.filter(submod => submod.name === modToPatchName).forEach(async (subdep) => {
            console.log();
            console.log(`Found ${modToPatchName} as subdep of ${mod.name}: ${subdep.path}`);

            const pathInParent = `${modulePath}/${NODE_MODULES_LOCATION}/${ADOBE_MODULES}/${modToPatchName}`;
            if (!fse.existsSync(pathInParent)) {
              // does not exist at parent level (should never occur...), install as a git dependency
              console.log(`subdep ${mod.path} does not exist in parent. Installing it locally  ${pathInParent}`);
              installAsGitDependency(modToPatchName, branches[modToPatchName], subdep.path);
            } else {
              // otherwise, use parent's one as dependency
              installDependency(pathInParent, mod.path);
            }
          });
        }
      });
    });
  }

  // for more accurate result, remote package-lock
  await fse.remove(`${modulePath}/package-lock.json`);

  // display npm ls of all the modules to know which versions have been used
  npmls(allAdobeModuleNames.map(name => `${ADOBE_MODULES}/${name}`).join(' '));

  console.log(`Total execution time: ${new Date().getTime() - startTime} ms.`);
  console.log('Done.');
}

start();
