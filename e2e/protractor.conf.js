var HtmlReporter = require('protractor-beautiful-reporter');
const fsExtra = require('fs-extra')

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  allScriptsTimeout: 91000,

  // specs: [
  //   './src/tests/searchPage-spec.ts','./src/tests/customerCardChange-spec.ts'
  // ],

  multiCapabilities: [
    {
      'browserName': 'firefox'
    },
  ],

  suites: {
    //beneficiaire: './src/tests/beneficiaire',
    //entreprise: './src/tests/entreprise-full.spec.ts',

    beneficiaire: ['./src/tests/beneficiaire/**/*spec.ts',
    ],
    titulaire: ['./src/tests/titulaire/**/*spec.ts',
    ]
  },

  //directConnect: true,
  baseUrl: 'http://localhost:4200/',

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 90000,
    print: function () { }
  },

  onPrepare() {
    //fsExtra.emptyDirSync('../../../../../report_protractor')
    fsExtra.emptyDirSync('./src/testReport')
    browser.driver.manage().window().maximize()

    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new HtmlReporter({
      //baseDirectory: '../../../../../report_protractor',
      baseDirectory: './src/testReport',
      docTitle: 'rapport-e2e-athena'
    }).getJasmine2Reporter());

  }
};