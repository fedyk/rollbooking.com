#!/usr/bin/env node
const { execSync } = require("child_process");
const command = `cd ${__dirname}/../../packages/calendar && npm run build`;

console.log(command);
execSync(command);
