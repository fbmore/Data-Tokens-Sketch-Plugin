var onRun = function(context) {
  var sketch = require("sketch");
  let document = sketch.getSelectedDocument()
  var selectedPage = document.selectedPage;
  var Settings = require('sketch/settings')

  var ui = require('sketch/ui');

  var layers = document.selectedLayers.layers;
  var textLayersExportedArray = []
  var textLayersExported = ""

  /// TABS or Commas?
  var divider = '	'
  // var divider = ','


          
//////// Given selection, export text layers and overrides (and their values)

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
              result = value;
            }
          }
        );


        sketch.UI.message("💽: See you later! 👋")


  function extractDataTokensFromLayers(layers) {

    
      // layers to export
      
      var textLayers = sketch.find('Text', selectedPage)

      var optionName = "Option 1"

      
      if (layers.length >> 0 && layers[0].type === "Artboard") {
        optionName = layers[0].name
        var selectedLayersID = layers.map(layer => layer.id)
      } 
      else {
        optionName = selectedPage.name
        var selectedLayersID = selectedPage.layers.map(layer => layer.id)
      }      

      textLayersExported = "Data Token" + '	' + optionName; 

      
      var invertedLayers = textLayers.reverse()
      
      for (t = 0; t < invertedLayers.length; t++){


        if (invertedLayers[t].getParentArtboard() != undefined ) {
          if (selectedLayersID.includes(invertedLayers[t].getParentArtboard().id)) {
            var value = stringWithLineBreaks(textLayers[t].text)
            textLayersExportedArray.push(textLayers[t].name + '	' + value)
          }  
        } 
        else {
          var value = stringWithLineBreaks(textLayers[t].text)
          textLayersExportedArray.push(textLayers[t].name + '	' + value)
        }

      }
      
      var symbolInstances = [];

      if (layers.length == 0){
        symbolInstances = sketch.find("SymbolInstance", selectedPage)
      } else {
        var artboards = layers;
        artboards.forEach((artboard) => {
          symbolInstances = symbolInstances.concat(sketch.find("SymbolInstance", artboard));
        })
      }
      
      

      for (t = 0; t < symbolInstances.length; t++){
          var overrides = symbolInstances[t].overrides
          

            overrides.forEach((override) => {

              /// Extract text
              if (override.property === "stringValue") {
              
                  var name = override.affectedLayer.name
                  var value = stringWithLineBreaks(override.value)
                  
                  // console.log(name + " - " + value)

                  textLayersExportedArray.push(name + divider + value)

              }

              /// Extract image
              // if (override.property === "image") {

              //     // console.log(override)
              
              //     var name = override.affectedLayer.name
              //     var imageName = name

              //     var imageName = name.replace(/[^a-z0-9]/gi, '');

              //     var value = "http://url.to.image/"+imageName+".jpg"
              //     // console.log("image: " + name + " - " + value)

              //     textLayersExportedArray.push(name + divider + value)

              // }


              })
      
        // }
      }

      textLayersExported  = textLayersExported + "\n" + textLayersExportedArray.filter(onlyUnique).join("\n");              

   }

   function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


  function stringWithLineBreaks(string) {
    
    // For strings with line breaks replace the line breaks with '\n'

    var separateLines = string.split(/\r?\n|\r|\n/g)                  
    var value = separateLines.join("\\n")  

    return value;
  }
  


  };
