var onRun = function(context) {

  var sketch = require('sketch')
  var ui = require('sketch/ui')
  var Settings = require('sketch/settings')
  var	document = sketch.getSelectedDocument();

  var defaultLocalData = 'Paste tab separated text here...'


  defaultLocalData = Settings.documentSettingForKey(document, 'defaultLocalData') || defaultLocalData



  var instructionalTextForInput = "Define Data Tokens for this Doc";
  var description = "👉 Paste TSV text below:";
  var initialValue = defaultLocalData;


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
        Settings.setDocumentSettingForKey(document, 'defaultLocalData', result);


        ui.message("💽: Yay! Defined Local Data Source! 👏 🚀");


      }
    }
  )

  // console.log(Settings.documentSettingForKey(document, 'defaultLocalData'));


  
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


  // NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding).toString()

  // var contentsOfFile = NSString.stringWithContentsOfFile(filePath, NSUTF8StringEncoding).toString()
  // [stringWithContentsOfFile = filePath, encoding = NSUTF8StringEncoding, error = nil];

  // var contentsOfFile = [stringWithContentsOfFile = filePath, encoding = NSUTF8StringEncoding, error = nil];
  
  // console.log(contentsOfFile);
  
  };
            

// var onRun = function(context) {

//   var sketch = require('sketch')
//   var	document = sketch.getSelectedDocument();

//   var ui = require('sketch/ui')

//   var Settings = require('sketch/settings')

//   console.log(Settings.documentSettingForKey(document, 'defaultLocalData'));


//   //// Data from Sample GSheet / Doc

//   //var defaultLocalData = ''
//   var defaultLocalData = 'path/to/file.tsv'

  
//   let filePath = getPath()
  
//   console.log(filePath);
  
//   // var contentsOfFile = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
  
//   // console.log(contentsOfFile);

//   defaultLocalData = filePath;

//   Settings.setDocumentSettingForKey(document, 'defaultLocalData', defaultLocalData);


//   ui.message("💽: Yay! Defined a local Data Source! 👏 🚀");


//   console.log(Settings.documentSettingForKey(document, 'defaultLocalData'));


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

