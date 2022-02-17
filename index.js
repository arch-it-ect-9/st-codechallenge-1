var path = require('path');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var express = require('express');
var app = new express();

app.disable('x-powered-by');

app.set('view engine', 'ejs');

app.use('/css', express.static(path.resolve('./public/css')));

app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1GB
    // limits: { fileSize: 1024 }, // 1GB
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
        req.file_size_exceeded = true;
        return res.send(`File size exceeded. The maximum size of file uploads is 1GB. <a href="/">back</a>`);
        // next();
    }
}));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res, next) => {
    res.render('index', {title: "Code challenge", error_message: null });
});

app.post('/', (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(`No file to upload. <a href="/">back</a>`);
    }
    var input_file = req.files['input-file'];
    var word_count = !isNaN(req.body['word-count']) && Number(req.body['word-count']) ? Number(req.body['word-count']) : 0;
    var upload_path = path.join(path.resolve('./uploads'),input_file.name);
    var processor = require('./processor');
    input_file.mv(upload_path, function(err) {
        if(err) {
            return res.status(500).send(`Failed to upload file. <a href="/">try again</a>`);
        }
        if(!word_count) {
            return res.status(400).send(`Invalid word count entered. A word count of 1 or greater is required. <a href="/">back</a>`);
        }
        if(!req.file_size_exceeded) {
            try {
                
                var fileAnalysis = new processor(upload_path, { word_count });
                fileAnalysis.mostUsedWords()
                    .then(result => console.log(result))
                    .then(() => res.send('Process complete.'))
                    .catch(e => {
                        console.log(e);
                    });

            } catch(e) {
                console.log(e);
                res.status(500).send(`An unexpected error occurred while attempting to process the file upload. <a href="/">back</a>.`);
            }
        }
    });
});

app.use('*', (err, req, res, next) => {
    console.log(err);
    res.status(500).send('An unexpected server error has occurred.')
});

app.listen(1080);