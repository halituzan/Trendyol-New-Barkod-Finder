let komut = document.querySelectorAll("script[type='application/javascript']");
let komutArr = Array.from(komut);
let indexApp = 0;
for (i = 0; i < komutArr.length; i++) {
    if (komutArr[i].innerText.includes("__PRODUCT_DETAIL_APP_INITIAL_STATE__")) {
        indexApp = i;
    }
}
let veri = komutArr[indexApp].innerHTML.replace("window.__PRODUCT_DETAIL_APP_INITIAL_STATE__=", "").replace("};window.TYPageName=\"product_detail\";window.dispatchDREvent&&window.dispatchDREvent({type:'wait',key:'reco'});window.dispatchDREvent&&window.dispatchDREvent({type:'wait',key:'cross'});window.dispatchDREvent&&window.dispatchDREvent({type:'wait',key:'reviews'});window.dispatchDREvent&&window.dispatchDREvent({type:'wait',key:'product_desc'});window.dispatchDREvent&&window.dispatchDREvent({type:'done',key:'pdp'})", "}");
let obj = JSON.parse(veri).product.allVariants;
let aside = document.querySelector("aside");
aside.insertAdjacentHTML("beforebegin", `<h3 style="font-size:2rem;">Barkodlar</h3><span class="tikla" style="font-size:1.2rem;color:black">Kopyalamak istediğiniz barkodun üzerine tıklayın.</span> <div id="barkodlar" style="display:flex;flex-direction:column;"></div>`);
let barcodes = ``;
for (i = 0; i < obj.length; i++) {
    barcodes += `
    <span class="barkodlar" style="padding:10px;font-size:1.2rem;background: #f27a1a;
    color: white;
    font-weight: bold;">
    <span style="margin-right:10px">${obj[i].value} :</span> <span class="barkods">${obj[i].barcode}</span></span>
`
}
const barkodlars = document.getElementById("barkodlar");
barkodlars.innerHTML = barcodes
let barkods = document.querySelectorAll(".barkods");
let tikla = document.querySelector(".tikla");
barkods = Array.from(barkods)
for (const elem of barkods) {
    elem.addEventListener("click", e => {
        navigator.clipboard.writeText(e.target.innerText).catch(err => console.log(object))
        tikla.innerHTML = `${e.target.innerText} Kopyalandı.`
        tikla.style.color = "red";
    })
    elem.style.cursor = "pointer"
}



