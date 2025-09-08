const form = document.getElementById('signForm');
const preview = document.getElementById('preview');
const codeEl = document.getElementById('code');

function escapeHtml(s = ""){
    return s.replace(
        /[&<>"']/g,
        (c) =>
        ({ "&": "&amp", "<" : "&lt", ">" : "&gt", '"' : "&quot;",  "'" : "&#39;"}[
            c
        ])
    );
}

function buildSignature(data){ 
    const c = data.couleur || "#C41D1D";
    const fullName = [data.prenom, data.nom].filter(Boolean).join(" ");

    // icone en text pour maximiser la compatibilité

    const icPhone = "☎️";
    const icPin = "📍";
    const icMail = "✉️";
    const icWeb = "🌐";

    // STRUCTURE DU RESULTAT
    return(
        `<!--Signature générée --> \n`+
        `<table cellpadding ="0" cellspacing="0"
        style="font-family: Arial, Helvetica, sans-serif;
        font-size:14px; color:#0f172a;
        line-height:1.4">`+
        `<tr>`+
        `<td style="padding:12px 16px 12px 10px; border-left:6px solid ${c}">`+
        `<div style="font-weight:bold; font-size:16px;">${escapeHtml(fullName)}</div>`+
        (data.fonction
            ? `<div style="color:#475569; font-size:12px;">${escapeHtml(data.fonction

            )}${data.entreprise ? ` . ${escapeHtml(data.entreprise)}` : ""}</div>`
        : "" ) +
        `<div style="height:8px></div>"` + 
        `<table cellpadding="0" cellspacing="0" style="font-size: 13px; color: #0f172a">`+ 
        (data.tel
            ? `<tr><td style="padding:2px 10px 2px 0">${icPhone}</td><td>${escapeHtml(data.tel
            )} </td></tr>`
         : "" ) +
        (data.adresse
            ? `<tr><td style="padding 2px 10px 2px 0">${icPin}</td><td>${escapeHtml(
                data.adresse
            )} </td></tr>`
        : "" ) +
        (data.email
            ? `<tr><td style="padding: 2px 10px 2px 0">${icMail}</td><td><a href="mailto:${escapeHtml(data.email

            )}" style="color:${c}; text-decoration: none;">${escapeHtml(data.email

            )}</a></td></tr>`
            : "") +

        (data.site
            ? `<tr><td style="padding:2px 10px 2px 0">${icWeb}</td><td><a href="${escapeHtml(
                data.site.startsWith("http") ? data.site : "https://" + data.site
            )}" style="color:${c}; text-decoration: none;">${escapeHtml(
                data.site
            )}</a></td></tr>`
        : "" ) + 
        `</table>` + 
        (data.mentions
            ? `<div style="margin-top:10px; color: #64748b; font-size: 11px; max-width: 520px;">${escapeHtml(
                data.mentions
            )}</div>`
       : "" ) +
       `</td>`  +
       `<td style="padding: 12px 0 12px 16px; vertical-align:top"` + 
       (data.logo
        ? `img src="${escapeHtml(
            data.logo
        )}" alt="logo" style="display:block; width: 10px; height: auto; border:0"/>`
       : "") + 
       `</td>`+ 
       `</tr>`+        
       `</table>`
    );
}

function getData(){

    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());
    return obj;
}

function generate(){

    const sig = buildSignature(getData());

    //Générer la preview
    preview.innerHTML = sig;

    //Générer le block de code à copier/coller
    codeEl.textContent = sig;
}

async function copyHtml(){

    try{
        await navigator.clipboard.writeText(codeEl.textContent);
        toast("Code HTML copié ✔ ");
    }catch(e){
        alert("Impossible de copier automatiquement. Copiez manuellemement le code");
    }
}

async function copyRich(){

    const html = preview.innerHTML;
    try{
        if(navigator.clipboard && window.ClipboardItem){
            const data = new ClipboardItem({
                "text/html" : new Blob([html], {type : "text/html"}), 
                "text/plain": new Blob([html.replace(/<[^>]+>/g, "")], {type : "text/plain"}),
            });
        await navigator.clipboard.write([data]);
        }else{
            // fallback: ouvrir une petite fenêtre pour sélectionner ce qui doit être copier
            const w = window.open("","","width=600, height=400");
            if(w){
                w.document.write(html);
                w.document.close();
                w.getSelection().selectAllChildren(w.document.body);
            } 
        }
        toast("Signature copiée (riche)");
    } catch(e){
        alert("Copie riche non supportée par ce navigateur.")
    }
}

function toast(msg){
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText =
    "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 14px; border-radius:12px; z-index:9999; box-shadow:0 6px 22px rgba(0,0,0,.25); font-weight:600";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1700);
}

document.getElementById("genBtn").addEventListener("click", generate);
document.getElementById("copyHtml").addEventListener("click", copyHtml);
document.getElementById("copyRich").addEventListener("click", copyRich);

(function seed(){
    document.getElementById("prenom").value = "PRÉNOM";
    document.getElementById("nom").value = "NOM";
    document.getElementById("fonction").value = "Fonction";
    document.getElementById("tel").value= "+33 6 00 00 00 00";
    document.getElementById("adresse").value = "Votre adresse - Code postal Ville";
    document.getElementById("email").value = "prenom.nom@domaine.fr";
    document.getElementById("site").value = "www.monsite.fr";
    document.getElementById("logo").value = "";
    document.getElementById("couleur").value = "#0ea5e9";
    generate();
})();