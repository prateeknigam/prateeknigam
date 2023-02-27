const puppeteer = require("puppeteer")

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
    return [{'ascin':filteredArray}];
    console.log(JSON.stringify([{'ascin':filteredArray}]));
    await browser.close();
  }
  catch(err){
    console.log(err);
  }
}
//start('bluetooth+headset')