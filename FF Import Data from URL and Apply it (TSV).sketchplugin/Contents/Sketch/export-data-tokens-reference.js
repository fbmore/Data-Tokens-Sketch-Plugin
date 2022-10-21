var onRun = function(context) {
  var sketch = require("sketch");
  let document = sketch.getSelectedDocument()
  var Page = require('sketch/dom').Page
  var Text = require('sketch/dom').Text
  var Artboard = require('sketch/dom').Artboard
  var Group = require('sketch/dom').Group
  // var selectedPage = document.selectedPage;
  var Settings = require('sketch/settings')
  var page = document.selectedPage;

  // var firstCreatedTextLayer = ""; 





  var ui = require('sketch/ui');

  var staticData = {"label": "Hello Francesco! 😀"}
  // var chosenOption = "Value"
  // var keyLabel = "Key"

          
//////// from REMOTE CSV/TSV TO JSON  

// Fetch the values for a given tab within a Google Sheet (or other endpoint)
// Return the parsed data


    // Read Doc Settings for defined data sources
    // Example data source URL  
    var queryURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6dDSho3VerjuZRpm2dKaVvQ0q02IZUFcBGw6E1R5gtzUgtjAtoXDaGxuvUn-n-jnFyZ9rI6bKhC54/pub?output=tsv'
    var queryURL = Settings.documentSettingForKey(document, 'defaultData') || queryURL

    //console.log(Settings.documentSettingForKey(document, 'defaultData'));
  


        /// Future update: support local document as source 
        
        // input to paste the URL

        var result = queryURL

        var alertTitle = "Export Data Tokens Reference Sheet";
        var instructionalTextForInput = "👉 Paste URL to TSV below:";
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
              console.log(value);
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

            console.log(result);

            var goodQuotes = result.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      
            result = goodQuotes;
            //var array = result.split("\n")

            staticData = csvToJson(goodQuotes)
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

  // console.log(response)


  var dataString = NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding).toString()
  
    //// convert TSV/CSV to JSON
    var goodQuotes = dataString.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    //var goodQuotes = dataString

      
    staticData = csvToJson(goodQuotes)

    // console.log("static JSON Data - All keys")
    // console.log(staticData)

      console.log("All keys")
      var allKeys = Object.keys(staticData[0])
      console.log(allKeys)

      allKeys.shift(); // So the headers can be used as options in the dropdown
      

      /// adds ability to choose the option i.e. "English" or "Product Name"
      var language = "";
      // console.log("language: " + language)

      var instructionalTextForInput = "A Data Tokens reference sheet will be created in a new page.\n\nPlease choose a data source option:"

      var result;

      ui.getInputFromUser(
        "Export Data Tokens Reference Sheet",
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
            console.log(value)
            // Create new page
            result = value;
            language = value;
          }
        }
      )

     
      
     if (language != "") {

     console.log("choosen language: " + language)   


    
    ///// var Object with one language only
    var objLanguage = "{";

    //console.log(staticData)
    for (d = 0; d < staticData.length ; d++){ 

      var obj2 = staticData[d];
      console.log(obj2["Key"])
      console.log(obj2[language])

      objLanguage = objLanguage + ' "' + obj2["Key"] + '" : "' + obj2[language] +'",'

    }


    objLanguage = objLanguage.substring(0, objLanguage.length - 1) +  " }"; 
    console.log(objLanguage)

    var JSONobjLanguage = JSON.parse(objLanguage)

    console.log("JSONobjLanguage")


    ////// new page
    var newPage = new Page({
      name: 'Tokens References',
    })
    
    newPage.parent = document
    

    newPage.selected = true;
    
    
    console.log(page.name);
    
    var artboard = new Artboard({
      name: 'Tokens References',
    })
    
    artboard.parent = newPage

    artboard.frame.x = 0
    artboard.frame.y = 0
    artboard.frame.width = 2256
    artboard.frame.height = 1152
  




    // Create artboard with name Data Tokens Reference Sheet
    
    var valuex = 96;
    var valuexCol2 = 480;
    var valuey = 0;
    var textWidth = 200;
    var textHeight = 40;
    var prevGroupBottomEdge = 200; // used as starting point for the Y as well
    var spaceBetweenRows = 24;
    var headersOffset = 64;
    // var valueyMinRowHeight = 100;

    
    // general keys

    var chosenOption = result || "Value" 
    var keyLabel = "Key"

    /// Create Key Text Layer (in this order so they appear in the correct place in the Layer List)
    createText(valuex,prevGroupBottomEdge-headersOffset,textWidth,textHeight,keyLabel,artboard)

    /// Create Value Text Layer
    createText(valuex + valuexCol2,prevGroupBottomEdge-headersOffset,textWidth,textHeight,chosenOption,artboard)
    

    // var headersObj = JSON.parse("{" + keyLabel + ":'"+chosenOption+"'}");
    
    // headersObj[keyLabel] = chosenOption;

    // var JSONobjHeadersKeysAndValues = headersObj.concat(JSONobjLanguage);
    
    //JSONobjLanguage[keyLabel] = chosenOption;

    for (const [key, value] of Object.entries(JSONobjLanguage)) {
      console.log(`${key}: ${value}`);

      exportDataTokensToReferenceSheet(key,value)
      //valuey = valuey;
    }
    

    ////// apply value from json key to matching layers

function exportDataTokensToReferenceSheet(key,value) {

    
//console.log("exportDataTokensToReferenceSheet: " + key + " -- " + value)

  
/// Adjust to fit if parent is a group

var textValue = key

var group = new Group({
  name: textValue
})

group.parent = artboard

group.frame.y = prevGroupBottomEdge;

group.index = 0;


/// Create Key Text Layer 
var textValue = key
createText(valuex,valuey,textWidth,textHeight,textValue,group)

/// Create Value Text Layer 
var textValue = value
createText(valuexCol2,valuey,textWidth*2,textHeight,textValue,group)



group.adjustToFit();

console.log("prevGroupBottomEdge")
console.log(prevGroupBottomEdge)
console.log(group.frame.height)

prevGroupBottomEdge = group.frame.y + group.frame.height + spaceBetweenRows

}


sketch.UI.message("💽: Exported data tokens (" + language + ")! 🥳")



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




/// Create text layer

function createText(textX,textY,width,height,textValue,newPage,fontSize) {

  var Text = require('sketch/dom').Text
  // textX = 10;
  // textY = 10;
  textParent = newPage;

  var textFontSize = fontSize || 12;

//  var backgroundColor = layer.style.fills[0].color.slice(0,7)
  // console.log("Fill:" + layer.style.fills[0].color.slice(0,7))
var highContrastColor = "#999"

  // console.log(highContrastColor)

  var textColor = highContrastColor

  var textLineHeight = textFontSize*1.5;
  var textAlignment = "left";
  var textFontFamily = 'Open Sans';
  var textFontWeight = 5;

  var text = new Text({
    text: textValue
  })
  
  text.frame.x = textX
  text.frame.y = textY
  text.fixedWidth = true;
  text.frame.width = width
  text.frame.height = height
  text.parent = textParent;
  text.style.fontSize = textFontSize;
  text.style.textColor = textColor;
  text.style.lineHeight = textLineHeight;
  text.style.alignment = textAlignment;
  text.style.fontFamily = textFontFamily;
  text.style.fontWeight = textFontWeight;
  text.name = textValue;

  valueyMinRowHeight = text.frame.height

  // Makes sure the layers stack correctly in the Layer List
  text.index = 0;
  

}
