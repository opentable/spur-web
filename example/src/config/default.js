module.exports = function () {
  return this.properties({
    Type: 'default',
    Port: 9000,

    // Follow this steps if you want to use HTTPS
    // Create a self-signed SSL Certificate - http://www.akadia.com/services/ssh_test_certificate.html
    // Create folder "certificates/local/"
    // Move your 'key' and 'certificate' file in to "certificates/local/"
    // Uncomment Https

    Https: {
      Port: 9009,
      PrivateKeyFilePath: 'test/fixtures/certificates/server.key',
      CertificateFilePath: 'test/fixtures/certificates/server.crt'
    }
  });
};
