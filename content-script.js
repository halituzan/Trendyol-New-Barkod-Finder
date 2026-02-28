let komut = document.querySelectorAll("script");
let komutArr = Array.from(komut);

function parseJsonFromScript(scriptContent, prefix) {
    const idx = scriptContent.indexOf(prefix);
    if (idx === -1) return null;
    let start = idx + prefix.length;
    let depth = 0;
    let inString = false;
    let escape = false;
    let end = start;
    for (let i = start; i < scriptContent.length; i++) {
        const c = scriptContent[i];
        if (escape) { escape = false; continue; }
        if (c === '\\' && inString) { escape = true; continue; }
        if (c === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }
    return JSON.parse(scriptContent.slice(start, end));
}

let obj = [];
const newPrefix = 'window["__envoy_flash-sales-banner__PROPS"]=';
const oldPrefix = 'window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ';

for (let i = 0; i < komutArr.length; i++) {
    const content = komutArr[i].innerText;
    if (content.includes("__envoy_flash-sales-banner__PROPS")) {
        const data = parseJsonFromScript(komutArr[i].innerHTML, newPrefix);
        if (data?.product?.variants) {
            obj = data.product.variants.filter(v => v.barcode);
            break;
        }
    }
}

if (!obj && komutArr.length > 0) {
    for (let i = 0; i < komutArr.length; i++) {
        if (komutArr[i].innerText.includes("__PRODUCT_DETAIL_APP_INITIAL_STATE__")) {
            const veri = komutArr[i].innerHTML.replace(oldPrefix, "").split("window.TYPageName")[0].replace(";", "");
            const parsed = JSON.parse(veri);
            obj = parsed.product?.allVariants?.some(env => env.barcode)
                ? parsed.product.allVariants
                : parsed.product?.variants;
            break;
        }
    }
}

if (!obj || obj.length === 0) {
    console.warn("Trendyol Barkod Finder: Barkod verisi bulunamadı.");
} else {
    // section.main içindeki product-key-info (kargo bilgisi) bloğunun hemen altına ekle
    let anchor = document.querySelector('section.main [fragment-partial="product-key-info"]') ||
                 document.querySelector('section.main .product-key-info');
    if (!anchor) {
        console.warn("Trendyol Barkod Finder: Barkod ekleme alanı bulunamadı.");
    } else {
    anchor.insertAdjacentHTML("afterend", `<div class="trendyol-barkod-finder" style="margin-top:1rem;"><h3 style="font-size:2rem;">Barkodlar</h3><span class="tikla" style="font-size:1.2rem;color:black">Kopyalamak istediğiniz barkodun üzerine tıklayın.</span> <div id="barkodlar" style="display:flex;flex-direction:column;"></div></div>`);
    let barcodes = ``;
    for (let i = 0; i < obj.length; i++) {
        barcodes += `
    <span class="barkodlar" style="padding:10px;font-size:1.2rem;background: #f27a1a;
    color: white;
    font-weight: bold;">
    <span style="margin-right:10px">${obj[i].value ?? "Barkod"} :</span> <span class="barkods">${obj[i].barcode}</span></span>
`
    }
    const barkodlars = document.getElementById("barkodlar");
    barkodlars.innerHTML = barcodes;
    let barkods = document.querySelectorAll(".barkods");
    let tikla = document.querySelector(".tikla");
    barkods = Array.from(barkods);
    for (const elem of barkods) {
        elem.addEventListener("click", e => {
            navigator.clipboard.writeText(e.target.innerText).catch(err => console.log(err));
            tikla.innerHTML = `${e.target.innerText} Kopyalandı.`;
            tikla.style.color = "red";
        });
        elem.style.cursor = "pointer";
    }
    }
}