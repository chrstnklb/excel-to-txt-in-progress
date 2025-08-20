const DRAG_OVER_COLOR = '#14908E';
const DRAG_LEAVE_COLOR = 'yellow';

document.addEventListener('DOMContentLoaded', function () {
    initPage();
});

function initPage() {
    clientLog("client loaded");

    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', function (event) { dragOverHandler(event); });
    dropZone.addEventListener('drop', function (event) { dropHandler(event); });
    dropZone.addEventListener('dragleave', function (event) { dragLeaveHandler(event); });

    const stepperButtonSelect = document.getElementById('stepper-button-select');

    const stepperButtonConvert = document.getElementById('stepper-button-convert');
    const stepperFormConvert = document.getElementById('stepper-form-convert');

    const stepperButtonSave = document.getElementById('stepper-button-save');

    const stepperButtonRestart = document.getElementById('stepper-button-restart');
    const stepperFormRestart = document.getElementById('stepper-form-restart');

    let path = '';
    let file = undefined;

    stepperButtonSelect.addEventListener('change', function () {
        if (this.files.length > 0) {
            path = this.files[0].name;
            file = this.files[0];
            console.log(path);
        }
        stepperFormConvert.hidden = false;
        // stepperButtonSelect.setAttribute("style", "background-color: #14908E");
        stepperButtonSelect.style.cssText += 'background-color: #198754; color: white';
    });

    stepperButtonConvert.addEventListener('click', function () {
        const formData = new FormData();
        formData.append('upload', file);
        fetchUploadStepper(formData);
    });

    stepperButtonSave.addEventListener('click', function (event) {
        stepperFormRestart.hidden = false;
        stepperButtonSave.setAttribute("class", "btn btn-danger");
    });


    stepperButtonRestart.addEventListener('click', function (event) {
        location.reload();
    });
}

function dragOverHandler(ev) {
    clientLog("file in drop zone", DRAG_OVER_COLOR);
    preventFileToOpen(ev);
    setBackGroundColor(ev, DRAG_OVER_COLOR);
    setBackGroundColorOpacity(ev, 1);
    setDropAreaText('Verarbeitet!');
}

function dropHandler(ev) {
    clientLog("file dropped");

    preventFileToOpen(ev);

    const files = ev.dataTransfer.files;
    const formData = new FormData();
    formData.append('upload', files[0]);

    // use fetchUpload from fetch.js
    fetchUpload(formData);
}

function deactivateUpluadArea() {
    const dropArea = document.getElementById('drop-zone');
    dropArea.style.pointerEvents = 'none';
    dropArea.style.opacity = 0.5;
}


function setDropAreaText(text) {
    const dropZoneText = document.getElementById('drop-zone-text');
    dropZoneText.innerHTML = text;
}

function dragLeaveHandler(ev) {
    clientLog("file left drop zone", DRAG_LEAVE_COLOR);
    preventFileToOpen(ev);
    setBackGroundColor(ev, DRAG_LEAVE_COLOR);
    setBackGroundColorOpacity(ev, 0.5);
    setDropAreaText('Ziehe die Datei hier hinein!');
}

function setBackGroundColorOpacity(ev, opacity) {
    ev.target.style.opacity = opacity;
}

function prepareDownload(filename) {
    setDownloadElementsAction('downloadForm', filename);
}

/**************************/
/*  HELPER FUNCTIONS      */
/**************************/

function preventFileToOpen(ev) {
    ev.preventDefault();
}

function setDownloadElementsAction(id, transformedFilename) {
    const form = document.getElementById(id);
    // TODO: make it get request
    form.setAttribute('action', "/download" + '?fileName=' + transformedFilename);
}

function displayDownloadButton() {
    const downloadButton = document.getElementById('downloadForm');
    downloadButton.hidden = false;
}

function displayRestartButton() {
    const restartButton = document.getElementById('restartForm');
    restartButton.hidden = false;
}

function setBackGroundColor(ev, color) {
    ev.target.style.backgroundColor = color;
}

function jumpTo(target) {
    var kontaktHeader = document.getElementById(target)
    kontaktHeader.scrollIntoView({ behavior: 'smooth' })
}