var init = require('./index');

var rnd = init();

console.log(rnd({
  basic: {
    intWithMin: "$int(10, 20)",
    intWithoutMin: "$int(10)",
    intConst: "10",
    bool: "$bool",
    boolConst: "true",
    stringConst: "'Test String'",
  },
  advanced: {
    computationExample: {
      a: '1',
      b: '3',
      formula: '"($.a + $.b) - $.a / $.b"',
      result: '<$.formula>',
    }
  },
  geo: {
    country: "$country",
    city: "$city"
  },
  date: {
    dateWithoutArg: "$date",
    dateGreaterThan: "$dateGreaterThan($.dateWithoutArg)",
    dateLessThan: "$dateLessThan($.dateWithoutArg)",
    dateInRange: "$dateInRange($.dateLessThan, $.dateGreaterThan)",
  },
  person_data: {
    firstName: "$firstName",
    surName: "$surName",
    fullName: "$.firstName_$.surName"
  },
  business: {
    company: "$company",
    domainZone: "$domainZone",
    domain: "$domain($.company) + $.domainZone",
    emailFromDataWithFullUserName: "$emailFromData($parent.person_data.fullName, $.company, $.domainZone)",
    randomEmail: "$email",
    code: "$code('###-###-###')",
    phone: "$code('+7 (499) ###-##-##')",
  },
  content: {
    title: "$title",
    translit: "$trans('Тестовая строка')",
    description: "$description",
    fullTextFromThreeParagraph: "$description(3)",
    tag: "$tag",
    arrayOfRangomTags: "$tags($int(1, 5))",
    andFocusWithJoin: "$tags($int(1, 5)).join(', ')",
  }
}));