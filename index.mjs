#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import inquirer from 'inquirer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 -p <path> -proj <project> [options]')
  .option('path', {
    alias: 'p',
    describe: 'Path to the folder or file to upload',
    type: 'string',
    nargs: 1
  })
  .option('project', {
    alias: 'proj',
    describe: 'Project name for the upload destination',
    type: 'string',
    nargs: 1
  })
  .option('bucket', {
    alias: 'b',
    describe: 'Bucket name',
    default: 'phageaus',
    type: 'string',
    nargs: 1
  })
  .option('rcloneResource', {
    alias: 'r',
    describe: 'Rclone resource name',
    default: 'r2phaus',
    type: 'string',
    nargs: 1
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const areArgsProvided = argv.path && argv.project;


const promptForArgs = async () => {
  return await inquirer.prompt([
    {
      name: 'path',
      type: 'input',
      message: 'Enter the path to the folder or file you want to upload:',
      default: argv.path,
      when: !argv.path
    },
    {
      name: 'project',
      type: 'input',
      message: 'Enter the project name for the upload destination:',
      default: argv.project,
      when: !argv.project
    },
    {
      name: 'bucket',
      type: 'input',
      message: 'Enter the bucket name:',
      default: argv.bucket || 'phageaus'
    },
    {
      name: 'rcloneResource',
      type: 'input',
      message: 'Enter the rclone resource name:',
      default: argv.rcloneResource || 'r2phaus'
    }
  ]);
};

const uploadCommand = async (args) => {
  const { path: userPath, project, bucket, rcloneResource } = args;

  const sourcePath = path.resolve(userPath); // Changed 'path' to 'userPath'
  const projectName = project;
  const bucketName = bucket;
  const rcloneResourceName = rcloneResource;
  const date = new Date().toISOString().split('T')[0];
  const folderName = path.basename(sourcePath);
  const destinationPath = `${bucketName}/${projectName}/${folderName}/${date}/`;


  const rcloneCommand = `rclone copy ${sourcePath} ${rcloneResourceName}:${destinationPath}`;
  const rcloneListCommand = `rclone tree ${rcloneResourceName}:${destinationPath}`;

  console.log(`Uploading to: ${rcloneResourceName}:${destinationPath}`);
  exec(rcloneCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Upload completed!`);
    exec(rcloneListCommand, (error, stdout, stderr) => {
      console.log('Bucket:', bucketName);
      console.log('Rclone Resource:', rcloneResourceName);
      console.log('Project/Folder:', `${projectName}/${folderName}`);
      console.log('Date:', date);
      console.log(`${stdout}`);
    });
  });
};

const main = async () => {
  const args = areArgsProvided ? argv : await promptForArgs();
  uploadCommand(args);
};

main();
