const fs = require('fs');
const path = require('path');
const config = require('../config');

const folderPath = config.METRIC_FOLDER;
const transformations = [];

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        console.log('File data:', fileData);
        try {
            let transformation = {
                timeStamp: JSON.parse(fileData).timestamp,
                colCount: JSON.parse(fileData).colCount,
                rowCount: JSON.parse(fileData).rowCount,
                cells: JSON.parse(fileData).rowCount * JSON.parse(fileData).colCount,
                calculationTimeInMs: JSON.parse(fileData).calculationTimeInMs,
                timePerCell: JSON.parse(fileData).calculationTimeInMs / (JSON.parse(fileData).rowCount * JSON.parse(fileData).colCount)
            };
            transformations.push(transformation);
            // console.log('Transformation:', transformation);
        } catch (error) {
            console.error('Error parsing JSON file:', filePath, error);
        }
    });
    console.log('Transformations:', transformations);

    console.log('Total transformations:', transformations.length);

    console.log('Min cols:',transformations.map(t => t.colCount).reduce((a, b) => Math.min(a, b)));
    console.log('Max cols:', transformations.map(t => t.colCount).reduce((a, b) => Math.max(a, b)));
    console.log('Avg cols:', transformations.map(t => t.colCount).reduce((a, b) => a + b, 0) / transformations.map(t => t.colCount).length);
    console.log('Median cols:', transformations.map(t => t.colCount).sort()[Math.floor(transformations.map(t => t.colCount).length / 2)]);

    console.log('Min rows:', transformations.map(t => t.rowCount).reduce((a, b) => Math.min(a, b)));
    console.log('Max rows:', transformations.map(t => t.rowCount).reduce((a, b) => Math.max(a, b)));
    console.log('Avg rows:', transformations.map(t => t.rowCount).reduce((a, b) => a + b, 0) / transformations.map(t => t.rowCount).length);
    console.log('Median rows:', transformations.map(t => t.rowCount).sort()[Math.floor(transformations.map(t => t.rowCount).length / 2)]);

    console.log('Min cells:', transformations.map(t => t.cells).reduce((a, b) => Math.min(a, b)));
    console.log('Max cells:', transformations.map(t => t.cells).reduce((a, b) => Math.max(a, b)));
    console.log('Avg cells:', transformations.map(t => t.cells).reduce((a, b) => a + b, 0) / transformations.map(t => t.cells).length);
    console.log('Median cells:', transformations.map(t => t.cells).sort()[Math.floor(transformations.map(t => t.cells).length / 2)]);
    
    console.log('Total cells:', transformations.map(t => t.cells).reduce((a, b) => a + b, 0));

    console.log('Min calculationTimeInMs:', transformations.map(t => t.calculationTimeInMs).reduce((a, b) => Math.min(a, b)));
    console.log('Max calculationTimeInMs:', transformations.map(t => t.calculationTimeInMs).reduce((a, b) => Math.max(a, b)));
    console.log('Avg calculationTimeInMs:', transformations.map(t => t.calculationTimeInMs).reduce((a, b) => a + b, 0) / transformations.map(t => t.calculationTimeInMs).length);
    console.log('Median calculationTimeInMs:', transformations.map(t => t.calculationTimeInMs).sort()[Math.floor(transformations.map(t => t.calculationTimeInMs).length / 2)]);
    console.log('Total calculationTimeInMs:', transformations.map(t => t.calculationTimeInMs).reduce((a, b) => a + b, 0));

    console.log('Min timePerCell:', transformations.map(t => t.timePerCell).reduce((a, b) => Math.min(a, b)));
    console.log('Max timePerCell:', transformations.map(t => t.timePerCell).reduce((a, b) => Math.max(a, b)));
    console.log('Avg timePerCell:', transformations.map(t => t.timePerCell).reduce((a, b) => a + b, 0) / transformations.map(t => t.timePerCell).length);
    console.log('Median timePerCell:', transformations.map(t => t.timePerCell).sort()[Math.floor(transformations.map(t => t.timePerCell).length / 2)]);
    console.log('Total timePerCell:', transformations.map(t => t.timePerCell).reduce((a, b) => a + b, 0));

});
