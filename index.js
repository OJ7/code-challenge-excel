const mysql = require('mysql');
const ExcelJS = require('exceljs');

const connection = mysql.createConnection({
    // replace connection details as needed
    host: 'localhost',
    user: 'root',
    password: 'Whitebox12345!',
    database: 'whitebox',
});

let sheetsCreated = 0;
let workbook;

connection.connect(
    (error) => {
        if (error) {
            throw error;
        }
        console.log('Connected to database!');

        workbook = new ExcelJS.Workbook();

        console.log('Querying database...');
        for (let sheetName in sheetsFilter) {
            let queryFilters = constructQueryFiltersForSheet(sheetName);
            let query = `SELECT zone
                    FROM rates
                    ${queryFilters}
                    GROUP BY zone`;

            performSQLQuery(query, queryZonesCallback.bind({ sheetName }));
        }
    }
);

function constructQueryFiltersForSheet(sheetName) {
    const filters = sheetsFilter[sheetName];
    let queryFilters = `WHERE client_id='1240'`;
    for (let filter of filters) {
        queryFilters += ` AND ${filter.field}='${filter.value}'`
    }
    return queryFilters;
}

function constructQueryZonePivotSelectors(zones) {
    let querySumSelectors = '';
    for (let zone of zones) {
        querySumSelectors += `,\nsum(IF(zone='${zone}', rate, NULL)) AS zone_${zone}`
    }
    return querySumSelectors;
}

function performSQLQuery(query, callbackFn) {
    connection.query(query, callbackFn);
}

function queryZonesCallback(error, zones, fields) {
    if (error) {
        console.error(error);
    } else {
        zones = zones.map(zone => zone.zone);
        let queryFilters = constructQueryFiltersForSheet(this.sheetName);
        let querySumSelectors = constructQueryZonePivotSelectors(zones);
        const query = `SELECT
                        start_weight,
                        end_weight
                        ${querySumSelectors}
                    FROM rates
                    ${queryFilters}
                    GROUP BY start_weight, end_weight`;

        performSQLQuery(query, queryPivotCallback.bind({ zones, sheetName: this.sheetName }));
    }
}

function queryPivotCallback(error, rates, fields) {
    if (error) {
        console.error(error);
    } else {
        createSheet(rates, this.zones, this.sheetName);
    }
}

function createSheet(rates, zones, sheetName) {
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = [
        { header: 'Start Weight', key: 'start_weight', width: 12 },
        { header: 'End Weight', key: 'end_weight', width: 12 },
        ...zones.map(zone => { return { header: `Zone ${zone}`, key: `zone_${zone}` } }),
    ];
    worksheet.addRows(rates);
    checkCompletion();
}

function checkCompletion() {
    sheetsCreated++;
    if (sheetsCreated === 5) {
        workbook.xlsx.writeFile("output.xlsx")
            .then(() => { console.log("File saved! View at ./output.xlsx"); });

        connection.end((error) => {
            if (error) {
                return console.error(error);
            }
            console.log('Closed the database connection.');
        });
    }
}

const sheetsFilter = {
    'Domestic Standard Rates': [
        { field: 'shipping_speed', value: 'standard' },
        { field: 'locale', value: 'domestic' }
    ],
    'Domestic Expedited Rates': [
        { field: 'shipping_speed', value: 'expedited' },
        { field: 'locale', value: 'domestic' }
    ],
    'Domestic Next Day Rates': [
        { field: 'shipping_speed', value: 'nextDay' },
        { field: 'locale', value: 'domestic' }
    ],
    'International Economy Rates': [
        { field: 'shipping_speed', value: 'intlEconomy' },
        { field: 'locale', value: 'international' }
    ],
    'International Expedited Rates': [
        { field: 'shipping_speed', value: 'intlExpedited' },
        { field: 'locale', value: 'international' }
    ],
};