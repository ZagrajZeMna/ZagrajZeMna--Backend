//hosting
module.exports = {
  HOST: "pg-zagrajzemna-123.c.aivencloud.com",
  USER: "avnadmin",
  PASSWORD: "AVNS_xC2JvrBRqM3258Y3kq2",
  DB: "defaultdb",
  port: 28985,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      ca: `-----BEGIN CERTIFICATE-----
          MIIEQTCCAqmgAwIBAgIUS0cYmXqYWgtiwZ2M2qThbqQSplIwDQYJKoZIhvcNAQEM
          BQAwOjE4MDYGA1UEAwwvYzdkNDkyOTMtNmZkNS00YzhmLTlmOTUtNmRiNThmOGEx
          NzQzIFByb2plY3QgQ0EwHhcNMjQwNTEzMjAyMjA5WhcNMzQwNTExMjAyMjA5WjA6
          MTgwNgYDVQQDDC9jN2Q0OTI5My02ZmQ1LTRjOGYtOWY5NS02ZGI1OGY4YTE3NDMg
          UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMcHLyPl
          SEvgq3W4leE64WQDoWt7yxh54Ca7ADJIV1s4tYuqifkqEmiNYPQbOaIvFEbBm95c
          Fc7A8tgruwyHf0nu3sUU+L//TSJQSenxW8kjaBV5kCb6Km2itwTAI1FQIaY8NbRl
          He4/h0VwzyC44THQvEvKkA5enW2gqdKxT3Obm651vw1vU24cc86ZGgnuwKgQlsRi
          MuMDheo8ManQZdOfsbMWibJ5+fOYoT4j2Yj0RSqEOqctvXWRMR8BWZsrXdNhrm/+
          tSACPyweu1CI56gwyIP7kklZsLbQvyNe1IkeOiKuA8hlFqoOGc4Lt45gfDdl40aN
          GGszf9IK+VHlMwhOlr4Tswm+F94Zg985LhjkabWJAvOFCq5omRNtuZgZsH6Mgu5j
          qns+3M1Ccyo0zNBADvwrTDeHDv7bk5XzwLHrXsauahy9+9tVYhlnYpuo049gieZP
          PHYZu7pxkL4M3Cq9nn3zXoTnxPF2q+uXp650JEfcRxkTkoHIPMuv9URMHQIDAQAB
          oz8wPTAdBgNVHQ4EFgQUq06mgwle2kekGu2aWkVA7/rfHuUwDwYDVR0TBAgwBgEB
          /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAHKSuoIHzO7wuDDU
          jc2YLLflXHEYvNsMbd61ROix6y6LjeMtqVaeYSP2DGYn2cbZMjvRcx4BC+ANpf1a
          aWbkLv41lEuEibWhVvzyO2fTVyTCHsl/HkqhkQcAhplZxI6gCcRS+RljCYkJfq2g
          KdniIR+tLFicqzxQOO4uz7tUkZZXbqP9bkOmNihThZy1PCip/8IeSdSvi6YIigy7
          lQrj3eCTHT3zbC4FN7IIoXr3p/ijObi5Xvrm0wRk8BCMKtXK9FhNMV58AUBUOEl2
          +NSUjXiSxtEn7g9eKvJ82HGv88wG3ocYFMzIqDdeVSKHizNbXI4vjwdXAkhtLBR7
          IFVn+bSHX8wRoU7bBFqaKw6myRSHYrDjd/CYcswoeIERD4iWjdYshBzPoZW5mRGt
          0+CUq/0w9xDHYKTi0A9Iraey/VHORai/jyv4px1+0vRBdrvssZWuZWbV3Gw353ko
          SNEq5+32UCQXQmL+8Zx0PjfgPkIMdaRtEXLAGiaTAmfsHf4NBQ==
          -----END CERTIFICATE-----`
    }
  }
};

// //docker setup
// module.exports = {
//   HOST: "db",
//   USER: "postgres",
//   PASSWORD: "postgres",
//   DB: "postgres_db",
//   port: 5432,
//   dialect: "postgres",
//   pool: {
//     max: 100,
//     min: 0,
//     acquire: 10000,
//     idle: 20000
//   },
//   logging: false
// };


// // local computer
// module.exports = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "123",
//   DB: "testdb",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };