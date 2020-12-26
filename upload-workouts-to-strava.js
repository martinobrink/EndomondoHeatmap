const fs = require('fs');
const strava = require('strava-v3')
const ConfigParser = require('configparser');

const config = new ConfigParser();
config.read('credentials.cfg');
var read_access_token = config.get('Strava', 'READ_ACCESS_TOKEN');
var client_id = config.get('Strava', 'CLIENT_ID');
var client_secret = config.get('Strava', 'CLIENT_SECRET');
var authorization_code = config.get('Strava', 'AUTHORIZATION_CODE');
var write_access_token = config.get('Strava', 'WRITE_ACCESS_TOKEN');

// Use this to get an authorization code:
// https://yizeng.me/2017/01/11/get-a-strava-api-access-token-with-write-permission/
// Uncomment code below to convert authorization code to write access token
/*
(async ()=>{
    try {
        strava.config({
            "access_token"  : read_access_token,
            "client_id"     : client_id,
            "client_secret" : client_secret
        })
        const payload = await strava.oauth.getToken(authorization_code)
        write_access_token = payload.access_token //user-specific time-limited write access token
        console.log("Write access token: " + write_access_token)
        console.log("Add this token to your 'credentials.cfg' file.")
    }
    catch( e ) {
        console.error( "Error: ", e );
    }
})();
*/

//code below uploads files placed in 'upload' folder using write access token
stravaClient = new strava.client(write_access_token);
var uploadDir = "upload";
const filesToUpload = fs.readdirSync( uploadDir );

for( const fileToUpload of filesToUpload ) {
    console.log('Uploading file:' + 'upload/'+fileToUpload)

    const payload = stravaClient.uploads.post({
        data_type: 'gpx',
        file: 'upload/'+fileToUpload,
        name: 'Uploaded activity'
    })

    console.log('Received payload: ' + payload)
}


// (async ()=>{
//     try {        
//         for( const fileToUpload of filesToUpload ) {
//             console.log('Uploading file:' + 'upload/'+fileToUpload)
//             const payload = await stravaClient.uploads.post({
//                 data_type: 'gpx',
//                 file: 'upload/'+fileToUpload,
//                 name: 'Uploaded activity'
//             })
//             console.log('Received payload: ' + payload)
//         }
//     }
//     catch( e ) {
//         console.error( "Error: ", e );
//     }
// })();
