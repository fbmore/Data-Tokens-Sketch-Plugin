var onRun = function(context) {

  var sketch = require('sketch')
  var	document = sketch.getSelectedDocument();

  var ui = require('sketch/ui')

  var Settings = require('sketch/settings')


  //// Data from Sample GSheet / Doc / 

  var defaultData = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6dDSho3VerjuZRpm2dKaVvQ0q02IZUFcBGw6E1R5gtzUgtjAtoXDaGxuvUn-n-jnFyZ9rI6bKhC54/pub?output=tsv'


  defaultData = Settings.documentSettingForKey(document, 'defaultData') || defaultData

  var dataSourcesArray = defaultData;


  var instructionalTextForInput = "Define Data Tokens for this Doc";
  var description = "👉 Paste URL to CSV or TSV below:";
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

};

