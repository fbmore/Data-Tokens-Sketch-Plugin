var onRun = function(context) {

  var sketch = require('sketch')
  var ui = require('sketch/ui')
  var Settings = require('sketch/settings')
  var	document = sketch.getSelectedDocument();

  var defaultLocalData = 'Paste comma or tab separated text here...'


  defaultLocalData = Settings.documentSettingForKey(document, 'defaultLocalData') || defaultLocalData

  var instructionalTextForInput = "Define Data Tokens for this Doc";
  var description = "👉 Paste CSV or TSV text below:";
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

};
            


