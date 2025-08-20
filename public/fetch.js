function fetchUpload(formData) {

    transformedFilename = '';

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(result => {
            transformedFilename = result.fileName;
            console.log('Upload date:', result);
            if (result.errorList.length > 0) {
                let alertMessage = 'Es sind Fehler aufgetreten: \n\n';
                result.errorList.forEach(error => {
                    alertMessage += error.description + "\n\n";
                });
                alert(alertMessage);
                console.log(alertMessage);
                console.log(result.calculationTimeInMs);
            } else {
                prepareDownload(transformedFilename);
                displayDownloadButton()
                displayRestartButton();
            }
        })
        .catch(error => { console.error('Error:', error); });
}

function fetchUploadStepper(formData) {

    transformedFilename = '';

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(result => {
            transformedFilename = result.fileName;
            console.log('Upload date:', result);
            if (result.errorList.length > 0) {
                let alertMessage = 'Es sind Fehler aufgetreten: \n\n';
                result.errorList.forEach(error => {
                    alertMessage += error.description + "\n\n";
                });
                alert(alertMessage);
                console.log(alertMessage);
                console.log(result.calculationTimeInMs);
            } else {
                const form = document.getElementById("stepper-form-save");
                // TODO: make it get request
                form.setAttribute('action', "/download" + '?fileName=' + transformedFilename);
                const stepperFormSave = document.getElementById('stepper-form-save');
                stepperFormSave.hidden = false;

                const stepperButtonConvert = document.getElementById('stepper-button-convert');
                stepperButtonConvert.setAttribute("class", "btn btn-warning");

            }
        })
        .catch(error => { console.error('Error:', error); });
}

// auto download?!

// function uploadFile() {
//     const fileUpload = document.getElementById('fileUpload');
//     const formData = new FormData();
//     formData.append('upload', fileUpload.files[0]);

//     fetch('/upload', { method: 'POST', body: formData })
//         .then(response => response.json())
//         .then(result => {
//             console.log('Success:', result);
//             setDropAreaText(
//                 'Hochgeladene Datei ' + result.uploadedFileName +
//                 ' wurde transformiert zu ' + result.downloadFileName);
//         })
//         .then(() => { setDropAreaText('🎉 Prima 🎉'); })
//         .then(() => { displayDownloadButton(); })
//         .then(() => { displayRestartButton(); })
//         .catch(error => { console.error('Error:', error); });
// }