"use strict";

var google = require('googleapis');
var quickstart = require('./quickstart.js');

console.log("starting program");
console.log(process.env.HOME + "  " +  process.env.HOMEPATH + "  " + process.env.USERPROFILE);


//quickstart.authorizeWithGoogle(listMajors);
//quickstart.authorizeWithGoogle(listFiles);
//quickstart.authorizeWithGoogle(createFolder);
//quickstart.authorizeWithGoogle(findFolder);
quickstart.authorizeWithGoogle(writeToSpreadsheet);

//authorize with google

//read the sheet
/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth) {
    var sheets = google.sheets('v4');

    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        console.log('Name, Major:');
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          // Print columns A and E, which correspond to indices 0 and 4.
          console.log('%s, %s', row[0], row[4]);
        }
      }
    });
  }

  function listFiles(auth) {
    var service = google.drive('v3');
    service.files.list({
      auth: auth,
      pageSize: 100,
      fields: "nextPageToken, files(id, name, mimeType, parents, trashed)"//,
      //q: "'0AGuYm3uzW_F-Uk9PVA' in parents"
      //q: "mimeType = 'application/vnd.google-apps.folder' and '0AGuYm3uzW_F-Uk9PVA' in parents"
      //q: "'0B2uYm3uzW_F-RHQzY2RneUtXRmc' in parents"
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var files = response.files;
      if (files.length == 0) {
        console.log('No files found.');
      } else {
        console.log('Files:');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('%s (%s) %s %s %s', file.name, file.id, file.mimeType, file.parents, file.trashed);
        }
      }
    });
  }


  function createFolder(auth) {
    var service = google.drive('v3');

    var fileMetadata = {
      'name': 'TODO LIST Folder',
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': ['root']
    };
    service.files.create({
      auth: auth,
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Folder Id: ', file.id);
      }
    });
  }
  
    function findFolder(auth) {
      var service = google.drive('v3');
      service.files.list({
        auth: auth,
        pageSize: 100,
        fields: "nextPageToken, files(id, name, mimeType, parents, trashed)",
        //q: "'0AGuYm3uzW_F-Uk9PVA' in parents"
        q: "mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and name = 'TODO LIST Folder' and trashed = false"
        //q: "'0B2uYm3uzW_F-RHQzY2RneUtXRmc' in parents"
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var files = response.files;
        if (files.length > 0){
          console.log(files[0].id);
          createFile(auth, files[0].id);
        }
      }.bind(this));
    }


    function createFile(auth, folderId) {
      var service = google.drive('v3');
  
      var fileMetadata = {
        'name': 'my todo spreadsheet',
        'mimeType': 'application/vnd.google-apps.spreadsheet',
        'parents': [folderId]
      };
      service.files.create({
        auth: auth,
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log('File Id: ', file.id);
        }
      });
    }


    function writeToSpreadsheet(auth) {
      var sheets = google.sheets('v4');
      var request = {
        // The ID of the spreadsheet to update.
        spreadsheetId: '11KWg8We6IYVCxsmqW2ztJdLfpL274IyBUzIg3W_wmlk',  // TODO: Update placeholder value.
        valueInputOption: 'RAW',
        // The A1 notation of the values to update.
        range: 'A1',  // TODO: Update placeholder value.
    
        resource: {
          values: [['put inbetween']]
          // TODO: Add desired properties to the request body. All existing properties
          // will be replaced.
        },
    
        auth: auth,
      };
    
      sheets.spreadsheets.values.update(request, function(err, response) {
        if (err) {
          console.error(err);
          return;
        }
    
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));
      });
    }


  

