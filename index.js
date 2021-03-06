#!/usr/bin/env node
const chalk = require('chalk');
const wittier = require('./functions');

const file = `wittier.json`;

wittier.initFile(file).then((wt) => {
  if (wt) {
    // Set names for project and webtasks
    const project = wt.project;
    const path = `${wt.entry}`;
    const webtasks = Object.keys(wt.webtasks);

    // Store a repo of webtasks that need to be created or deployed
    const activeWebtasks = [];
    const webtasksToCreate = [];
    const webtasksToDeploy = [];
    const globalSecrets = (wt.secrets) ? wittier.globalSecrets(wt.secrets) : undefined;

    // Determine Active Webtasks
    webtasks.forEach((webtask) => {
      if (wt.webtasks[webtask].active) activeWebtasks.push(webtask);
    });

    activeWebtasks.forEach((webtask) => {
      // Determine Webtasks to be deployed from activeWebtasks
      if (wt.webtasks[webtask].created) webtasksToDeploy.push(webtask);
      // Determine Webtasks to be built from activeWebtasks
      else webtasksToCreate.push(webtask);
    });

    if (activeWebtasks.length > 0) {
      console.log(chalk.blue('ACTIVE WEBTASKS:'));
      activeWebtasks.forEach((w) => {
        console.log(`*  ${project}-${w}`);
      });

      if (webtasksToCreate.length > 0) {
        wittier.create(webtasksToCreate, path, project, wt, globalSecrets, file);
      }

      if (webtasksToDeploy.length > 0) {
        wittier.deploy(webtasksToDeploy, path, project);
      }
    } else console.log(chalk.red('NO ACTIVE WEBTASKS. ABORTING.'));
  } else console.log(chalk.red('NO ACTIVE WEBTASKS. ABORTING.'));
});
