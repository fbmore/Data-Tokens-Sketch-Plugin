var onRun = function(context) {
  var sketch = require("sketch");
  let document = sketch.getSelectedDocument()
  var selectedPage = document.selectedPage;
  var Settings = require('sketch/settings')

  var ui = require('sketch/ui');

  var staticData = {"label": "Hello Francesco! 😀"}

          
//////// from REMOTE CSV/TSV TO JSON  

// Fetch the values for a given tab within a Google Sheet (or other endpoint)
// Return the parsed data


    // Read Doc Settings for defined data sources
    // Example data source URL  
    var queryURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6dDSho3VerjuZRpm2dKaVvQ0q02IZUFcBGw6E1R5gtzUgtjAtoXDaGxuvUn-n-jnFyZ9rI6bKhC54/pub?output=tsv'
    queryURL = Settings.documentSettingForKey(document, 'defaultData') || queryURL

    //// console.log(Settings.documentSettingForKey(document, 'defaultData'));
  


        /// Future update: support local document as source 
        
        // input to paste the URL

        var result = queryURL

        var alertTitle = "Import Data Tokens from URL\nand Apply Them";
        var instructionalTextForInput = "👉 Paste URL to CSV or TSV below:";
        var initialValue = queryURL;
      
        if (result === undefined){
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
              // console.log(value);
              result = value;
              Settings.setDocumentSettingForKey(document, 'defaultData', result)
            }
          }
        );

        }
        



        if (result.slice(0,4) == "http"){
            staticData = fetchValuesFromRemoteFile(result);
    
        } else {

            /// TSV was pasted?

            // console.log(result);

            var goodQuotes = result.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      
            result = goodQuotes;
            //var array = result.split("\n")

            staticData = csvToJson(goodQuotes)
            console.log("staticData")
            console.log(staticData)
        }
    
      


        ///

        let json = JSON.stringify(staticData, null, 2);
        /// 
        // let json = JSON.stringify([data], null, 2);

        if (json.length === 0) {
            sketch.UI.message("No data found.");
            return;
        }


  function applyImageToOverride(override,imageurl) {

    /// Applies image from remote URL or local path to image overrides

    /// If remote image just apply path to value

    // var imageurl =  "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80";

    var imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
    var nsimage = NSImage.alloc().initWithContentsOfURL(imageurl_nsurl);                  
    override.value = nsimage;

  }
      



/**
 * Takes a raw CSV string and converts it to a JavaScript object.
 * @param {string} text The raw CSV string.
 * @param {string[]} headers An optional array of headers to use. If none are
 * given, they are pulled from the first line of `text`.
 * @param {string} quoteChar A character to use as the encapsulating character.
 * @param {string} delimiter A character to use between columns.
 * @returns {object[]} An array of JavaScript objects containing headers as keys
 * and row entries as values.
 */




/// This below uses COMMAS as delimiters
//  function csvToJson(text, headers, quoteChar = '"', delimiter = ',') {

/// This below uses TABS as delimiters
 function csvToJson(text, headers, quoteChar = '"', delimiter = '	') {

    console.log("queryURL")
    console.log(queryURL)

    if (queryURL.includes("csv")){
      delimiter = ','
      console.log("Includes csv")
    } else {
      console.log("Does not include csv")
    }


    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');
  
    const match = line => {
      const matches = [...line.matchAll(regex)].map(m => m[2]);
      matches.pop(); // cut off blank match at the end
      return matches;
    }
  
    const lines = text.split('\n');
    const heads = headers ?? match(lines.shift());
  
    return lines.map(line => {
      return match(line).reduce((acc, cur, i) => {
        // Attempt to parse as a number; replace blank matches with `null`
        const val = cur.length <= 0 ? null : Number(cur) || cur;
        const key = heads[i] ?? `extra_${i}`;
        //return { ...acc, [key]: val };
        return { ...acc, [key]: val.toString() };
      }, {});
    });
  }



//////// from REMOTE CSV TO JSON  

function fetchValuesFromRemoteFile(queryURL,staticData) {

  // TSV is available and better for parsing - This URL is from Francesco's fbmore@gmail.com GDrive   

  var request = NSMutableURLRequest.new()
  request.setHTTPMethod('GET')
  request.setURL(NSURL.URLWithString(queryURL))


  var error = NSError.new()
  var responseCode = null
  var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, responseCode, error)

  // // console.log(response)


  var dataString = NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding).toString()
  
    //// convert TSV/CSV to JSON
    var goodQuotes = dataString.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    //var goodQuotes = dataString

      
    staticData = csvToJson(goodQuotes)

    console.log("staticData via URL")
    console.log(staticData)



    // // console.log("static JSON Data - All keys")
    // // console.log(staticData)

      console.log("All keys")
      var allKeys = Object.keys(staticData[0])
      console.log(allKeys)

      var DataTokensColumnName = allKeys[0]


      allKeys.shift();

      console.log("allKeys - Shift")
      console.log(allKeys)


      /// adds ability to choose the option i.e. "English" or "Product Name"
      var language = "";
      // // console.log("language: " + language)

      var instructionalTextForInput = "Text Layers and Overrides where the names match keys from the imported data tokens,\nwill be updated with the corresponding value.\n\nPlease choose an option to use in your designs:"

      var result;

      ui.getInputFromUser(
        "Import & Apply Data Tokens from URL",
        {
          description: instructionalTextForInput,
          type: ui.INPUT_TYPE.selection,
          possibleValues: allKeys,
        },
        (err, value) => {
          if (err) {
            // most likely the user canceled the input
            return
          } else {
            // // console.log(value)
            language = value;
          }
        }
      )

      console.log("language chosen: " + language)
     
      
     if (language != "") {

      console.log("language chosen 2: " + language)
      ///// var Object with one language only
      var objLanguage = "{";

      console.log("staticData before FOR")
      console.log(staticData)
      console.log("staticData.length")
      console.log(staticData.length)

      console.log("staticData 1")
      console.log(staticData[1])

      for (d = 0; d < staticData.length ; d++){ 

        var obj2 = staticData[d];
        console.log(obj2[DataTokensColumnName])
        console.log(obj2[language])

        objLanguage = objLanguage + ' "' + obj2[DataTokensColumnName] + '" : "' + obj2[language] +'",'

      }


    objLanguage = objLanguage.substring(0, objLanguage.length - 1) +  " }"; 
    console.log(objLanguage)

    var JSONobjLanguage = JSON.parse(objLanguage)

    console.log("JSONobjLanguage")

    // general keys
    for (const [key, value] of Object.entries(JSONobjLanguage)) {
      console.log(`${key}: ${value}`);
      applyContentVariableValueToLayers(key,value)
    }
    

    ////// apply value from json key to matching layers

function applyContentVariableValueToLayers(key,value) {

    
    // var headline = staticData[0][key]
    var textValue = value;
// layers to update

// var textLayers = sketch.find('Text', document.pages[0])
var textLayers = sketch.find('Text', selectedPage)

for (t = 0; t < textLayers.length; t++){
  // // console.log(textLayers[t].name)
  if (textLayers[t].name == key){
    //// // console.log("it's a headline!")
    if (textLayers[t].getParentArtboard().type != "SymbolMaster"){
        var layerName = textLayers[t].name;
        textLayers[t].text = textValue;
        textLayers[t].name = layerName;
    }
  }
}

var symbolInstances = sketch.find('SymbolInstance', selectedPage)

for (t = 0; t < symbolInstances.length; t++){
    // // console.log(symbolInstances[t].overrides)
    var overrides = symbolInstances[t].overrides
    
    if (symbolInstances[t].getParentArtboard().type != "SymbolMaster"){
      
      for (o = 0; o < overrides.length; o++){

      var override = overrides[o];  
      
      // if(typeof overrides[o].affectedLayer === 'object') {
      if (override.property === "stringValue") {
        // rename parent artboard
        symbolInstances[t].getParentArtboard().name = symbolInstances[t].getParentArtboard().name.split(" -- ")[0] + " -- " + language
        symbolInstances[t].getParentArtboard().name = symbolInstances[t].getParentArtboard().name.replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, '')

        // apply generic value to everything

        //applyContentVariableValueToLayers(key.split(".")[1],value,key.split(".")[0])
        var localKey = key.split(".")[1];
        var localTextValue = textValue;
        var localInstanceName = key.split(".")[0];

        // apply specific value to matches
        if (overrides[o].affectedLayer.type == "Text" && overrides[o].affectedLayer.name == key) { 
            overrides[o].value = textValue;
        }
        
        if (overrides[o].affectedLayer.type == "Text" && overrides[o].affectedLayer.name == localKey && symbolInstances[t].name == localInstanceName) { 
            overrides[o].value = localTextValue;
        } 

      }
      
      if (override.property === "image") {
        // rename parent artboard
        symbolInstances[t].getParentArtboard().name = symbolInstances[t].getParentArtboard().name.split(" -- ")[0] + " -- " + language
        symbolInstances[t].getParentArtboard().name = symbolInstances[t].getParentArtboard().name.replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, '')

        // apply generic value to everything

        //applyContentVariableValueToLayers(key.split(".")[1],value,key.split(".")[0])
        var localKey = key.split(".")[1];
        var localTextValue = textValue;
        // console.log(localTextValue)
        var localInstanceName = key.split(".")[0];

        // console.log("localKey")
        // console.log(localKey)

        // console.log("localTextValue")
        // console.log(localTextValue)

        // console.log("localInstanceName")
        // console.log(localInstanceName)


        /// APPLIES to ALL
        // applyImageToOverride(override,"https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80")

        // apply specific value to matches
        if (overrides[o].affectedLayer.name == key) { 
            // overrides[o].value = textValue;
            applyImageToOverride(override,textValue)
            // applyImageToOverride(override,"https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80")
        }
        
        if (overrides[o].affectedLayer.name == localKey && symbolInstances[t].name == localInstanceName) { 
            // overrides[o].value = textValue;
            applyImageToOverride(override,localTextValue)
            // applyImageToOverride(override,"https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80")
        }
        
        // if (overrides[o].affectedLayer.name == localKey &&  symbolInstances[t].name == localInstanceName) { 
        //     overrides[o].value = localTextValue;
        //     applyImageToOverride(override,localTextValue)
        // } 

        // // apply specific value to matches
        // if (override.affectedLayer.name == key) { 
        //   // applyImageToOverride(override,"https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80")
        //   applyImageToOverride(override,localTextValue)

        //   // // console.log('override.affectedLayer.type == "image" --- 1')
        //   //   var imageurl = textValue;
        //   //   var imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
        //   //   var nsimage = NSImage.alloc().initWithContentsOfURL(imageurl_nsurl);                  
        //   //   override.value = nsimage;        
        // }
        
        // if (override.type == "image" && override.affectedLayer.name == localKey &&  symbolInstances[t].name == localInstanceName) { 
        //     // console.log('override.affectedLayer.type == "image" --- 2')
        //     var imageurl = localTextValue;
        //     var imageurl_nsurl = NSURL.alloc().initWithString(imageurl);
        //     var nsimage = NSImage.alloc().initWithContentsOfURL(imageurl_nsurl);                  
        //     override.value = nsimage;

        // } 

      }
    }

  }
}

for (t = 0; t < symbolInstances.length; t++){
      symbolInstances[t].resizeWithSmartLayout();
      
}

////// END apply value from json key to matching layers
}

sketch.UI.message("💽: Applied data tokens (" + language + ")! 🥳")



let json = JSON.stringify(staticData, null, 2);


const obj = JSON.parse(json);


    if (json.length === 0) {
        sketch.UI.message("No data found.");
        return;
    }    


  try {

    var data = JSON.parse(JSON.stringify(obj))

    return data

  } catch(e) {
    sketch.UI.message("Failed to import file")
    return null
  }
    } else {
      sketch.UI.message("💽: See you later! 👋")
    }
}

};
