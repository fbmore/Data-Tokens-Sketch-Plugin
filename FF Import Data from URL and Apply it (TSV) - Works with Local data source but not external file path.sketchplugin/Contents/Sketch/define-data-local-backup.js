var onRun = function(context) {

  var sketch = require('sketch')
  var ui = require('sketch/ui')
  var image = require('sketch/dom').Image


  var defaultData = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6dDSho3VerjuZRpm2dKaVvQ0q02IZUFcBGw6E1R5gtzUgtjAtoXDaGxuvUn-n-jnFyZ9rI6bKhC54/pub?output=tsv'


  defaultData = Settings.documentSettingForKey(document, 'defaultData') || defaultData

  var dataSourcesArray = defaultData;


  var instructionalTextForInput = "Define Data Tokens for this Doc";
  var description = "👉 Paste URL to TSV below:";
  var initialValue = defaultData;


  ui.getInputFromUser(
    instructionalTextForInput,
    {
      initialValue: initialValue,
      description: description,
      numberOfLines: 10
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        ui.message("💽: Ooops! Try again later! 😀");

        return
      } else {
        result = value;
        Settings.setDocumentSettingForKey(document, 'defaultData', result);


        ui.message("💽: Yay! Defined " + result.split(",").length + " Data Source(s)! 👏 🚀");


      }
    }
  )

  console.log(Settings.documentSettingForKey(document, 'defaultData'));
  
  // function getPath(initialPath = '~/Documents') {
  //   const panel = NSOpenPanel.openPanel()
  //   panel.setCanChooseFiles(true)
  //   panel.setCanChooseDirectories(true)
  //   panel.setCanCreateDirectories(true)
  //   panel.setAllowsMultipleSelection(false)
  //   panel.setTitle('Select a file or folder')
  //   panel.setPrompt('Select')
  //   panel.setDirectoryURL(NSURL.fileURLWithPath(initialPath))
  //   const result = panel.runModal()
  //   if (result === NSFileHandlingPanelOKButton) {
  //     return panel.URL().path()
  //   } else {
  //     return null
  //   }
    
  // }
  
  
  // let filePath = getPath()
  
  // console.log(filePath);

  // const jsonData = require('./file.json');
  // const jsonData = String.stringWithContentsOfFile(filePath);

  // var contentsOfFile = [stringWithContentsOfFile = filePath, encoding = NSUTF8StringEncoding, error = nil];
  
  // console.log(contentsOfFile);
  // console.log(jsonData);
  
  };
            

// var onRun = function(context) {

//   var sketch = require('sketch')
//   var	document = sketch.getSelectedDocument();

//   var ui = require('sketch/ui')

//   var Settings = require('sketch/settings')

//   console.log(Settings.documentSettingForKey(document, 'defaultData'));


//   //// Data from Sample GSheet / Doc

//   //var defaultData = ''
//   var defaultData = 'path/to/file.tsv'

  
//   let filePath = getPath()
  
//   console.log(filePath);
  
//   // var contentsOfFile = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
  
//   // console.log(contentsOfFile);

//   defaultData = filePath;

//   Settings.setDocumentSettingForKey(document, 'defaultData', defaultData);


//   ui.message("💽: Yay! Defined a local Data Source! 👏 🚀");


//   console.log(Settings.documentSettingForKey(document, 'defaultData'));


//   function getPath(initialPath = '~/Documents') {
//     const panel = NSOpenPanel.openPanel()
//     panel.setCanChooseFiles(true)
//     panel.setCanChooseDirectories(true)
//     panel.setCanCreateDirectories(true)
//     panel.setAllowsMultipleSelection(false)
//     panel.setTitle('Select a .tsv file to use as data source')
//     panel.setPrompt('Select')
//     panel.setDirectoryURL(NSURL.fileURLWithPath(initialPath))
//     const result = panel.runModal()
//     if (result === NSFileHandlingPanelOKButton) {
//       return panel.URL().path()
//     } else {
//       return null
//     }
    
//   }

// };

