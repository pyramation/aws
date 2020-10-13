#!/usr/bin/env node

import { prompt } from '@pyramation/prompt';
import { getCreds } from './creds';
import { listKops } from './list-kops';
import AWS from 'aws-sdk';

const argv = process.argv.slice(2);

const creds = getCreds();

(async () => {
  const getAcount = [
    {
      type: 'list',
      name: 'profile',
      message: 'enter a profile',
      choices: creds,
      required: true
    }
  ];
  const { profile } = await prompt(getAcount, argv);

  if (!creds.includes(profile)) throw new Error('bad profile!');

  //   const getAction = [
  //     {
  //       type: 'list',
  //       name: 'action',
  //       message: 'enter an action',
  //       choices: ['list-buckets', 'list-instance-ips', 'list-instances'],
  //       required: true
  //     }
  //   ];
  //   const { action } = await prompt(getAction, argv);

  const getRegion = [
    {
      type: 'list',
      name: 'region',
      message: 'enter a region',
      choices: ['us-east-1', 'us-west-2'],
      required: true
    }
  ];
  const { region } = await prompt(getRegion, argv);

  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;

  const values = await listKops({ region });
  console.log(JSON.stringify(values, null, 2));
})();
