var assert = require('assert');
const Processor = require('../processor');
describe('processor.js', function() {
  describe('#mostUsedWords', function() {
    it(`Should return {
      "frequencies": [
          {
              "word": "sed",
              "count": 12
          },
          {
              "word": "id",
              "count": 10
          },
          {
              "word": "sit",
              "count": 8
          }
      ]
  }`, function() {
      var path = require('path');
      var testdoc = path.resolve('./test/test-doc.txt');
      var analyze = new Processor(testdoc, { word_count: 3 });
      analyze.mostUsedWords() 
        .then(result => assert.equal(result, {
          "frequencies": [
              {
                  "word": "sed",
                  "count": 12
              },
              {
                  "word": "id",
                  "count": 10
              },
              {
                  "word": "sit",
                  "count": 8
              }
          ]
      }))
        .catch(e => {
          throw e;
        });
      
    });
  });
});