const { format } = require('../../../src/fastify/FastifyResponseFormatter');

describe('FastifyResponseFormatter', () => {
  it.each`
    expectedFormat | accept                | expectedContent
    ${'json'}      | ${'application/json'} | ${{ json: true }}
    ${'html'}      | ${'text/html'}        | ${'<html></html>'}
  `('should format response as $expectedFormat when accept header is $accept', ({ accept, expectedContent }) => {
    // Act
    const result = format({ request: { headers: { accept } } }, {
      json: () => ({ json: true }),
      html: () => '<html></html>',
      text: () => 'text',
    });

    // Assert
    expect(result).toStrictEqual(expectedContent);
  });

  it('should return text formatted result when accept header is not application/json or text/html', () => {
    // Act
    const result = format({ request: { headers: { accept: 'application/xml' } } }, {
      json: () => ({ json: true }),
      html: () => '<html></html>',
      text: () => 'text',
    });


    // Assert
    expect(result).toBe('text');
  });

  it('should throw error when format method not defined in format-mapping', () => {
    // Assert
    expect(() => {
      format({ request: { headers: { accept: 'text/plain' } } }, {
        json: () => ({ json: true }),
        html: () => '<html></html>',
      });
    }).toThrow("Format method not found: 'text'");
  });
});
