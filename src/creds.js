import { readFileSync } from 'fs';

export const getCreds = () => {
  let creds;
  try {
    creds = readFileSync(`${process.env.HOME}/.aws/credentials`, 'utf-8')
      .split('\n')
      .filter((a) => {
        if (/aws_/.test(a)) return false;
        if (/^\[[a-zA-Z]+\]$/.test(a)) return true;
        return false;
      })
      .map((a) => a.replace(/[\[\]]/g, ''));
  } catch (e) {
    throw new Error('you need to setup your AWS cli with profiles');
  }

  return creds;
};
