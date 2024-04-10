console.log('js file loaded')
fetch('/data.json')
    .then(response => response.json())
    .then(jsonData => console.log(jsonData))
    .catch(error => console.error('Error reading file:', error));
// Weekly data
var weekly_data = jsonData.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
});
weekly_data = JSON.parse(weekly_data);
m = weekly_data['ba_1month'].length
let date = new Date('1934-12-27');
let dates = [];
for (let i = 0; i < m; i++) {
    date.setDate(date.getDate() + 7);
    dates.push(new Date(date));
};

function processData(data, field) {
    let result = [];
    for (let i = 0; i < m; i++) {
        result.push([dates[i], data[field][i]]);
    }
    return result;
}

let ba_1month = processData(weekly_data, 'ba_1month');
let ba_3month = processData(weekly_data, 'ba_3month');
let prime = processData(weekly_data, 'prime');
let corra = processData(weekly_data, 'corra');
let ca2y = processData(weekly_data, 'ca2y');
let ca5y = processData(weekly_data, 'ca5y');
let ca10y = processData(weekly_data, 'ca10y');
let ca30y = processData(weekly_data, 'ca30y');
let ca10y_2y_spread = processData(weekly_data, 'ca10y_2y_spread');
let gic_5y = processData(weekly_data, 'gic_5y');
let cpi_headline = processData(weekly_data, 'cpi_headline');
let cpi_core = processData(weekly_data, 'cpi_core');

const series1 = [
    { name: 'Canadian Bankers\' Acceptance Rates - 1 month', data: ba_1month, color: '#6CF' },
    { name: 'Canadian Bankers\' Acceptance Rates - 3 month', data: ba_3month, color: '#06C' },
    { name: 'Prime', data: prime, color: '#BFBFBF' },
]

const series2 = [
    { name: 'Headline CPI (YoY%)', data: cpi_headline, color: '#6CF' },
    { name: 'Core CPI (YoY%)', data: cpi_core, color: '#06C' },
    { name: 'Prime', data: prime, color: '#BFBFBF' },
    { name: 'CORRA', data: corra, color: '#ffc000' }
]

const series3 = [
    { name: '2-year bond yields', data: ca2y, color: '#6CF' },
    { name: '5-year bond yields', data: ca5y, color: '#39F' },
    { name: '10-year bond yields', data: ca10y, color: '#06C' },
    { name: '30-year bond yields', data: ca30y, color: '544fc5' },
    { name: 'GIC 5-year', data: gic_5y, color: '#BFBFBF' },
]

const series4 = [
    { name: 'Government bond 10-year and 2-year spread', data: ca10y_2y_spread, color: '#43682B' }
]

Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: 'SF Pro Display',
            fontSize: '12pt',
        }
    },
    legend: {
        itemStyle: {
            fontSize: "10pt",
        }
    },
    navigator: {
        enabled: true
    }
})
function createChart(credits, x, series, container, titleText, subtitleText) {
    Highcharts.stockChart(container, {
        title: {
            text: titleText,
            align: 'left'
        },
        subtitle: {
            text: subtitleText,
            align: 'left'
        },
        legend: {
            enabled: true
        },
        rangeSelector: {
            buttons: [{
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'year',
                count: 10,
                text: '10y',
                title: 'View 10 years'
            }, {
                type: 'year',
                count: 20,
                text: '20y',
                title: 'View 20 years'
            }, {
                type: 'year',
                count: 30,
                text: '30y',
                title: 'View 30 years'
            }, {
                type: 'year',
                count: 50,
                text: '50y',
                title: 'View 50 years'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }],
            selected: 4
        },
        yAxis: {
            labels: {
                format: '{value:.2f}%',
                align: 'left',
            },
            plotLines: [{
                value: 0,
                width: 3,
                color: 'black'
            }],
            min: x,
        },
        plotOptions: {
            series: {
                //compare: 'percent',
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y}%<br/>',
            valueDecimals: 2,
            split: true
        },
        navigator: {
            enabled: false
        },
        credits: {
            enabled: true,
            text: credits
        },
        series
    });
};
createChart('Source: Investment Industry Regulatory Organization of Canada', 0, series1, 'container1', 'Bankers\' Acceptance Rates', 'With the cessation of CDOR\'s publication, it is expected that the BA based lending model will be discontinued and therefore BA issuance will likely cease after June 2024.')
createChart('Source: Bank of Canada', 0, series2, 'container2', 'CPI, CORRA, and Prime Rates', 'Headline CPI is a measure of core inflation corresponding to the price change located at the 50th percentile (in terms of the CPI basket weights) of the distribution of price changes in a given month.<br/>Core CPI excluding eight of the most volatile components (fruit, vegetables, gasoline, fuel oil, natural gas, mortgage interest, inter-city transportation and tobacco products) as well as the effect of changes in indirect taxes on the remaining components.')
createChart('Source: Bank of Canada', 0, series3, 'container3', 'Slected Government of Canada Benchmark Bond Yields, and Chartered Bank Guaranteed Investment Certificates 5-year', 'Financial market statistics, as at Wednesday, Bank of Canada')
createChart('Source: Pal Insurance Services Ltd.', -3, series4, 'container4', 'Long-term and Short-term Government Bond Yield Difference', 'Taking the yield difference between 10-year bond and 2-year government bond to identify the inverted yield.')
