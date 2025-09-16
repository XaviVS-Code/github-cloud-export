import yargs from 'yargs';
export function parseArgs(){
  return yargs.usage('Usage: $0 [options]')
    .option('repo',{alias:'r',type:'string',describe:'owner/repo'})
    .option('readme',{alias:'m',type:'boolean',describe:'Only README.md'})
    .option('provider',{alias:'p',choices:['google','onedrive','dropbox'],describe:'Cloud provider'})
    .help().argv;
}
