Package.describe({
  name: 'frpz:ip',
  version: '0.1.2',
  // Brief, one-line summary of the package.
  summary: 'Some simple tools to manipulate IPv4 addresses',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/frpz/ip.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.addFiles('ip.js');
  api.export('IP');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('frpz:ip');
  api.addFiles('ip-tests.js');
});
