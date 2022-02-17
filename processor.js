// @ts-check
/**
 * A file processor with tools for data manipulation.
 * @param {string} file_path The full path to the file to process.
 * @param {object} options Options for the file processor.
 */
var Processor = function(file_path = "", options = {}) {

    this.file_path = file_path;
    this.options = Object.assign({
        word_count: 3
    }, options);
    this.init();
};
Processor.prototype.init = function() {
    var fs = require('fs');
    if(!this.file_path) {
        throw new Error(`Invalid file name. Operation aborted.`);
    }
    if(!fs.existsSync(this.file_path)) {
        throw new Error(`Unable to locate the uploaded file. Operation aborted.`)
    }
    if(isNaN(this.options.word_count)) {
        throw new Error(`Word count is invalid. A valid number is required. Operation aborted.`);
    }
};
Processor.prototype.extractContents = function() {
    var self = this;
    return new Promise((resolve, reject) => {
        var fs = require('fs');
        var contents = "";
        var rs = fs.createReadStream(self.file_path, 'utf8');
        rs.on('data', (chunk) => {
            contents+=chunk;
        });
        rs.on('close', () => {
            resolve(contents);
        });
        rs.on('error', (err) => {
            reject(err);
        });
    });
};
Processor.prototype.wordsArray = function(text = "") {
    return new Promise((resolve, reject) => {
        var slugify = require('slugify');
        var slugified_text = slugify(String(text).toLowerCase(), {remove: /[*+~.()'"!:@,]/g});
        var raw_words_array = slugified_text.split('-');
        resolve(raw_words_array);
    });
};
Processor.prototype.uniqueWords = function(raw_words_array = []) {
    return new Promise((resolve, reject) => {
        var unique_words_array = [...new Set(raw_words_array)];
        resolve(unique_words_array);
    });
};
Processor.prototype.wordFrequencies = function(raw_words_array = [], unique_words_array = []) {
    var self = this;
    return new Promise((resolve, reject) => {
        var async = require('async');
        var word_frequencies = {};

        unique_words_array.forEach(word => {
            word_frequencies[word]=0;
        });
        
        var result = [];

        async.eachOfSeries(raw_words_array, (word, word_ix, nextWord) => {
            if(unique_words_array.indexOf(word)>=0) {
                word_frequencies[word]++;
            }
            nextWord();
        }, (err) => {
            if(err) {
                reject(err);
            } else {
                result = Object.keys(word_frequencies).map(word => {
                    return {
                        word: word,
                        count: word_frequencies[word]
                    };
                });
                result = result.sort((a, b) => {
                    if(a.count<b.count) {
                        return 1;
                    }
                    if(a.count>b.count) {
                        return -1;
                    }
                    if(a.count==b.count) {
                        return 0;
                    }
                });
                result = result.slice(0, self.options.word_count);
                resolve(result);
            }
        });
    });
};
Processor.prototype.mostUsedWords = function() {
    var self = this;
    return new Promise((resolve, reject) => {
        var raw_words_array = [], unique_words_array = [], word_frequencies = {};
        self.extractContents()
            .then(result => self.wordsArray(result))
            .then(result => raw_words_array=result)
            .then(() => self.uniqueWords(raw_words_array))
            .then(result => unique_words_array=result)
            .then(() => self.wordFrequencies(raw_words_array, unique_words_array))
            .then(result => resolve(result))
            .catch(e => reject(e));
    });
};
module.exports = Processor;