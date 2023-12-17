const htmlFileInput = document.getElementById("htmlfile");
const textContentInput = document.getElementById("textContent");
const downloadBtn = document.getElementById("downloadTextFile");
const downloadFilename = document.getElementById("filename");
const downloadFileExtension = document.getElementById("extension");
const progressbar = document.getElementById("progressbar")
let textContent = ""

function setDownloadAsText() {
    document.getElementById("downloadAs").innerText = downloadFilename.value.trimEnd() + downloadFileExtension.value.replace(" ", "")
}

downloadBtn.addEventListener("click", function(){
    const blob = new Blob([textContent], {type :'text/plain'});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = downloadFilename.value.trimEnd() + downloadFileExtension.value.replace(" ", "")
    link.click();

});

htmlFileInput.addEventListener("change", function(ev){
    const file = ev.target.files[0];
    progressbar.innerText = 0;
    progressbar.style.width = 0;
    
    if (! file) {
        window.alert("No file selected");
        progressbar.innerText = "No file selected";
        progressbar.style.width = 0;
        return;
    }
    const reader = new FileReader();
    downloadFilename.value = file.name.split(".")[0]
    reader.onload = function (e) {
        const htmlContent = e.target.result;
        textContent = parseAndExtractText(htmlContent);
        textContentInput.value = textContent;
    }

    reader.onloadstart = function (e) {
         progressbar.innerText = 0
    }

    reader.onprogress = function (e){
        if (e.lengthComputable)
        {
            const percentComplete = (e.loaded / e.total) * 100;
            progressbar.innerText = percentComplete;
            progressbar.style.width = `${percentComplete}%`;
        }
    }

    reader.readAsText(file);
})

function parseAndExtractText(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const content = doc.body.textContent;
    return content;
}