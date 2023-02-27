var express = require('express');  
const puppeteer = require("puppeteer")
var app = express();  
var bodyParser = require('body-parser');  
var puppeteer_class = require('./puppeteer_class');  
// Create application/x-www-form-urlencoded parser  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
app.use(express.static('public'));  
app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})  
app.post('/process_post', urlencodedParser, function (req, res) {  
   // Prepare output in JSON format  
//    response = {  
//        search_text:req.body.search_text,  
      
//    };  

    start(req.body.search_text).then((output)=>{
        res.end(JSON.stringify(output));  
    });
 })  
var server = app.listen(8000, function () {  
  var host = 'localhost'  
  var port = server.address().port  
  console.log("Example app listening at http://%s:%s", host, port)  
})  

async function start(search_string) {
    
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  //await page.goto("https://www.amazon.in/s?k=bluetooth+headset&ref=nb_sb_noss");
  await page.goto("https://www.amazon.in/s?k="+search_string);
  var  filteredArray = [];
  try{

    const ascin = await page.evaluate(() => {
      let text_link =  Array.from(document.querySelectorAll(".a-link-normal")).map((x)=>{
        let ascin =  x.getAttribute('href').split('/')[3];
        return ( ascin!=null &&  ascin.startsWith('B0'))?ascin:null;
      })
      return text_link;
    });
  
    if(typeof  ascin ==='object' && Object.keys(ascin).length>0){
      var filteredArray = ascin.filter(function (el) {
        return el != null;
      });  
    }
    let  output = [{'ascin':filteredArray}];
    await browser.close();
    //console.log(JSON.stringify([{'ascin':filteredArray}]));
    return  output;
    
  }
  catch(err){
    console.log(err);
  }
}
