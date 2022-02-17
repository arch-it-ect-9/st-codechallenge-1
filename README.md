## st-codechallenge-1
# API Solution
### author: Saul Tapia

## Instructions
1. Git clone into a local folder.
1. Run ```npm install``` to install Node dependencies.
1. Run ```npm test``` to make sure everything is installed correctly.
1. Run ```node index``` to start the server.
1. Navigate to localhost:1080
1. Choose a file to upload under **Choose a file**
1. Enter any number greater than 1 in **Number of words to return**
1. Click the **Submit** button.

## Requests
Requests are accepted using POST and take one file ```input-file``` and one integer ```word-count```. The file size limit is 1GB. An error will return if the size of the file exceeds 1GB.

## Responses
Responses for this application are in JSON with mime type application/json. The returned data will contain an object with a single property ```frequencies```. The ```frequencies``` property contains an array of key/value pairs ```words``` and ```count```. 