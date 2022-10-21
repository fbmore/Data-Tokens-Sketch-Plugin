var onRun = function(context) {
  var sketch = require("sketch");
  let document = sketch.getSelectedDocument()
  var selectedPage = document.selectedPage;
  var Settings = require('sketch/settings')

  var ui = require('sketch/ui');

  // var staticData = {"label": "Hello Francesco! 😀"}

  var layers = document.selectedLayers.layers;
  var textLayersExportedArray = []
  var textLayersExported = ""

  var divider = '	'


          
//////// Given selection, export text layers and overrides (And their values as CSV)

extractDataTokensFromLayers(layers);

////

        var result = ""

        var alertTitle = "Exported Data Tokens";
        var instructionalTextForInput = "👉 Copy the Tokens below to a Spreasheet:";
        var initialValue = textLayersExported;
      
        //// Get user input
        ui.getInputFromUser(
          alertTitle,
          {
            initialValue: initialValue,
            description: instructionalTextForInput,
            numberOfLines: 10
          },
          (err, value) => {
            if (err) {
              // most likely the user canceled the input
              return;
            } else {
              console.log(value);
              result = value;
              //Settings.setDocumentSettingForKey(document, 'defaultData', result)
            }
          }
        );


        sketch.UI.message("💽: See you later! 👋")


  function extractDataTokensFromLayers(layers) {

    
      // layers to export
      
      var textLayers = sketch.find('Text', selectedPage)

      textLayersExported = "Key" + '	' + (layers[0].name || "Option 1") 

      var selectedLayersID = layers.map(layer => layer.id)
      
      // console.log(selectedLayersID.length)
      // console.log(selectedLayersID)

      var invertedLayers = textLayers.reverse()
      
      for (t = 0; t < invertedLayers.length; t++){

        if (1){
          if (selectedLayersID.includes(textLayers[t].getParentArtboard().id)){
              // console.log(textLayers[t].name + '	' + textLayers[t].text);
              textLayersExportedArray.push(textLayers[t].name + '	' + textLayers[t].text)
          }
        }
      }
      
      var symbolInstances = sketch.find('SymbolInstance', selectedPage)
      
      for (t = 0; t < symbolInstances.length; t++){
          var overrides = symbolInstances[t].overrides
          
          if (selectedLayersID.includes(symbolInstances[t].getParentArtboard().id)){
            
            for (o = 0; o < overrides.length; o++){
            
            if(typeof overrides[o].affectedLayer === 'object') {

              // export key and value pairs to be copied and pasted in a spreadsheet
              if (overrides[o].affectedLayer.type == "Text" && overrides[o].editable == true ) { 
                // console.log(overrides[o].affectedLayer.name + '	' + overrides[o].value);
                // Note the divider below is a TAB                
                textLayersExportedArray.push(overrides[o].affectedLayer.name + divider + overrides[o].value)

                }
              
      
            }
          }
      
        }
      }

      textLayersExported  = textLayersExported + "\n" + textLayersExportedArray.filter(onlyUnique).join("\n");              

   }

   function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  };
