function getDefaultCardData() {
    axios.get(`https://disease.sh/v3/covid-19/historical/USA`)
        .then(response => {
            let totalCases = response.data.timeline.cases
            let totalCasesArray = []

            for (let date in totalCases) {
                totalCasesArray.push(totalCases[date])
            }

            let todayCases = totalCasesArray[29]
            let newCases = totalCasesArray[29] - totalCasesArray[28]

            $('#newCases').html(newCases);
            $('#totalCases').html(todayCases);

            let totalDeaths = response.data.timeline.deaths
            let totalDeathsArray = []

            for (let date in totalDeaths) {
                totalDeathsArray.push(totalDeaths[date])
            }

            let todayDeaths = totalDeathsArray[29]
            let newDeaths = totalDeathsArray[29] - totalDeathsArray[28]

            $('#newDeaths').html(newDeaths);
            $('#totalDeaths').html(todayDeaths);

            let newMonthlyCases = totalCasesArray[29] - totalCasesArray[0]
            let newMonthlyDeaths = totalDeathsArray[29] - totalDeathsArray[0]
            let newDeathRate = (newMonthlyDeaths / newMonthlyCases * 100).toFixed(2);

            $('#deathRate').html(newDeathRate);
        }).catch(error => console.log(error))

    const requestVaccination = axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/USA`);
    const requestPopulation = axios.get(`https://disease.sh/v3/covid-19/countries/usa`)

    axios.all([requestVaccination, requestPopulation])
        .then(axios.spread((responseVaccination, responsePopulation) => {

            let timeline = responseVaccination.data.timeline
            let timelineArray = []
            for (let date in timeline) {
                timelineArray.push(timeline[date])
            }
            let vaccinated = timelineArray[timelineArray.length - 1]

            let population = responsePopulation.data.population

            let vaccinationRate = ((vaccinated / 3) * 100 / population).toFixed(2) //assuming everyone vaccinated got three doses

            $('#vaccinationRate').html(vaccinationRate);
        })).catch(error => console.log(error))
}


function getDefaultChartData() {
    let xlabels = [];
    let ylabels = [];
    axios.get(`https://disease.sh/v3/covid-19/historical/USA`)
        .then(response => {
            let totalCases = response.data.timeline.cases
            let totalCasesArray = []
            let caseDate = Object.keys(totalCases);
            for (let date in totalCases) {
                totalCasesArray.push(totalCases[date])
            }

            caseDate.shift();

            xlabels = caseDate;

            let newCasesArray = []
            for (let i = 1; i < totalCasesArray.length; i++) {
                newCasesArray.push(totalCasesArray[i] - totalCasesArray[i - 1])
            }
            ylabels = newCasesArray

            drawDefaultChart(xlabels, ylabels)
        }).catch(error => console.log(error))
}

function getUSDeathData() {
    let xlabels = [];
    let ylabels = [];
    axios.get(`https://disease.sh/v3/covid-19/historical/USA`)
        .then(response => {
            let totalDeaths = response.data.timeline.deaths
            let totalDeathsArray = []
            let deathDate = Object.keys(totalDeaths);
            for (let date in totalDeaths) {
                totalDeathsArray.push(totalDeaths[date])
            }

            deathDate.shift();

            xlabels = deathDate;

            let newDeathsArray = []
            for (let i = 1; i < totalDeathsArray.length; i++) {
                newDeathsArray.push(totalDeathsArray[i] - totalDeathsArray[i - 1])
            }
            ylabels = newDeathsArray

            drawUSDeathChart(xlabels, ylabels)
        }).catch(error => console.log(error))
}

function getCard1ChartData(searchState) {

    searchState = sessionStorage.getItem("stateName");

    let xlabels = [];
    let ylabels = [];
    axios.get(`https://disease.sh/v3/covid-19/nyt/states/${searchState}`)
        .then(response => {

            let newCasesArray = [];
            let caseDate = [];

            for (let i = 1; i < response.data.length; i++) {
                newCasesArray.push(response.data[i].cases - response.data[i - 1].cases)
                caseDate.push(response.data[i].date)
            }

            xlabels = caseDate
            ylabels = newCasesArray

            drawChart1(xlabels, ylabels)
        }).catch(error => console.log(error))
}

function getCard2ChartData(searchState) {
    searchState = sessionStorage.getItem("stateName");

    let xlabels = [];
    let ylabels = [];
    axios.get(`https://disease.sh/v3/covid-19/nyt/states/${searchState}`)
        .then(response => {

            let newDeathsArray = [];
            let caseDate = [];

            for (let i = 1; i < response.data.length; i++) {
                newDeathsArray.push(response.data[i].deaths - response.data[i - 1].deaths)

                caseDate.push(response.data[i].date)
            }
            for (let i = 0; i < newDeathsArray.length; i++) {
                if (newDeathsArray[i] < 0) {
                    newDeathsArray[i] = 0
                }
            }

            xlabels = caseDate
            ylabels = newDeathsArray

            drawChart2(xlabels, ylabels)
        }).catch(error => console.log(error))
}

function getCard3ChartData() {
    let xlabels = [];
    let ylabels = [];

        const requestVaccination = axios.get(`https://disease.sh/v3/covid-19/nyt/states`);
        const requestPopulation = axios.get(`https://disease.sh/v3/covid-19/states`)
    
        axios.all([requestVaccination, requestPopulation])
            .then(axios.spread((responseNewDeath, responsePopulation) => {
    
                let todayArray = []
                for (let i = 0; i < responseNewDeath.data.length; i++) {
                    if (responseNewDeath.data[i].date == responseNewDeath.data[responseNewDeath.data.length - 1].date)
                        todayArray.push(responseNewDeath.data[i])
                }

                let monthOldArray = []
                for (let i = 0; i < responseNewDeath.data.length; i++) {
                    if (responseNewDeath.data[i].date == responseNewDeath.data[0].date)
                        monthOldArray.push(responseNewDeath.data[i])
                }
    
                for (let i = 0; i < todayArray.length; i++) {
                    if (todayArray[i].state === "American Samoa") {
                        console.log(i)
                        todayArray.splice(i, 1)
                        monthOldArray.splice(i, 1)
                    }
                }
    
                let stateNames = []
                let allStateNewDeath = []
                for (let i = 0; i < todayArray.length; i++) {
                    allStateNewDeath.push(todayArray[i].deaths - monthOldArray[i].deaths)
                    stateNames.push(todayArray[i].state)
                }
    
                for (let i = 0; i < stateNames.length; i++) {
                    if (stateNames[i] === "New York State") {
                        stateNames[i] = "New York"
                    }
                    if (stateNames[i] === "Virgin Islands") {
                        stateNames[i] = "United States Virgin Islands"
                    }
                    if (stateNames[i] === "District of Columbia") {
                        stateNames[i] = "District Of Columbia"
                    }
                }
    
                let populationDataIndex = []
                for (let i = 0; i < stateNames.length; i++) {
                    populationDataIndex[i] = responsePopulation.data.findIndex(function (populationData) {
                        return populationData.state == stateNames[i]
                    })
                }
    
                let statePopulation = []
                for (let i = 0; i < stateNames.length; i++) {
                    let index = populationDataIndex[i]
                    statePopulation[i] = responsePopulation.data[index].population
                }
    
                let newDeathRate = []
                for (let i = 0; i < stateNames.length; i++) {
                    newDeathRate[i] = allStateNewDeath[i] * 100 / statePopulation[i]
                }

                const index = stateNames.indexOf("Northern Mariana Islands");
    
                stateNames.splice(index, 1);
                newDeathRate.splice(index, 1);
    
                stateNames[48] = "Virgin Islands"
                xlabels = stateNames
                ylabels = newDeathRate
                drawChart3(xlabels, ylabels)
    
            })).catch(error => console.log(error))
}

function getCard4ChartData() {
    const stateNames = JSON.parse(sessionStorage.getItem("allStateNames"));

    let xlabels = [];
    let ylabels = [];
    for (let i = 0; i < stateNames.length; i++) {
        if (stateNames[i] === "New York") {
            stateNames[i] = "New York State"

        }
        if (stateNames[i] === "District Of Columbia") {
            stateNames[i] = "District of Columbia"
        }
    }

    const requestVaccination = axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage/states`);
    const requestPopulation = axios.get(`https://disease.sh/v3/covid-19/states`)

    axios.all([requestVaccination, requestPopulation])
        .then(axios.spread((responseVaccination, responsePopulation) => {

            let timeline = responseVaccination.data[1].timeline

            let dateArray = []
            for (let date in timeline) {
                dateArray.push(date)
            }

            let todayDate = dateArray[dateArray.length - 1]

            let vaccinationDataIndex = []
            for (let i = 0; i < stateNames.length; i++) {
                vaccinationDataIndex[i] = responseVaccination.data.findIndex(function (vaccinationData) {
                    return vaccinationData.state == stateNames[i]
                })
            }

            let stateVaccinated = []
            for (let i = 0; i < stateNames.length; i++) {
                let index = vaccinationDataIndex[i]
                stateVaccinated[i] = responseVaccination.data[index].timeline[todayDate]
            }

            for (let i = 0; i < stateNames.length; i++) {
                if (stateNames[i] === "New York State") {
                    stateNames[i] = "New York"
                }
                if (stateNames[i] === "Virgin Islands") {
                    stateNames[i] = "United States Virgin Islands"
                }
                if (stateNames[i] === "District of Columbia") {
                    stateNames[i] = "District Of Columbia"
                }
            }

            let populationDataIndex = []
            for (let i = 0; i < stateNames.length; i++) {
                populationDataIndex[i] = responsePopulation.data.findIndex(function (populationData) {
                    return populationData.state == stateNames[i]
                })
            }

            let statePopulation = []
            for (let i = 0; i < stateNames.length; i++) {
                let index = populationDataIndex[i]
                statePopulation[i] = responsePopulation.data[index].population
            }

            let vaccinationRate = []
            for (let i = 0; i < stateNames.length; i++) {
                if (statePopulation[i] === 0) {
                    vaccinationRate[i] = 40
                } else {
                    vaccinationRate[i] = (stateVaccinated[i] / 3 * 100 / statePopulation[i]).toFixed(2)
                }
            }

            stateNames[48] = "Virgin Islands"
            xlabels = stateNames
            ylabels = vaccinationRate

            drawChart4(xlabels, ylabels)

        })).catch(error => console.log(error))
}

function getCard5ChartData() {

    let xlabels = [];
    let ylabels = [];

    const requestVaccination = axios.get(`https://disease.sh/v3/covid-19/nyt/states`);
    const requestPopulation = axios.get(`https://disease.sh/v3/covid-19/states`)

    axios.all([requestVaccination, requestPopulation])
        .then(axios.spread((responseNewCase, responsePopulation) => {

            let todayArray = []
            for (let i = 0; i < responseNewCase.data.length; i++) {
                if (responseNewCase.data[i].date == responseNewCase.data[responseNewCase.data.length - 1].date)
                    todayArray.push(responseNewCase.data[i])
            }

            let monthOldArray = []
            for (let i = 0; i < responseNewCase.data.length; i++) {
                if (responseNewCase.data[i].date == responseNewCase.data[0].date)
                    monthOldArray.push(responseNewCase.data[i])
            }

            for (let i = 0; i < todayArray.length; i++) {
                if (todayArray[i].state === "American Samoa") {
                    todayArray.splice(i, 1)
                    monthOldArray.splice(i, 1)
                }
            }

            let stateNames = []
            let allStateNewCase = []
            for (let i = 0; i < todayArray.length; i++) {
                allStateNewCase.push(todayArray[i].cases - monthOldArray[i].cases)
                stateNames.push(todayArray[i].state)
            }

            for (let i = 0; i < stateNames.length; i++) {
                if (stateNames[i] === "New York State") {
                    stateNames[i] = "New York"
                }
                if (stateNames[i] === "Virgin Islands") {
                    stateNames[i] = "United States Virgin Islands"
                }
                if (stateNames[i] === "District of Columbia") {
                    stateNames[i] = "District Of Columbia"
                }
            }

            let populationDataIndex = []
            for (let i = 0; i < stateNames.length; i++) {
                populationDataIndex[i] = responsePopulation.data.findIndex(function (populationData) {
                    return populationData.state == stateNames[i]
                })
            }

            let statePopulation = []
            for (let i = 0; i < stateNames.length; i++) {
                let index = populationDataIndex[i]
                statePopulation[i] = responsePopulation.data[index].population
            }

            let newCaseRate = []
            for (let i = 0; i < stateNames.length; i++) {
                newCaseRate[i] = allStateNewCase[i] * 100 / statePopulation[i]
            }
            const index = stateNames.indexOf("Northern Mariana Islands");

            stateNames.splice(index, 1);
            newCaseRate.splice(index, 1);

            stateNames[48] = "Virgin Islands"
            xlabels = stateNames
            ylabels = newCaseRate
            sessionStorage.setItem('allStateNames', JSON.stringify(stateNames));
            drawChart5(xlabels, ylabels)

        })).catch(error => console.log(error))
}

let myChart = null

function drawDefaultChart(xlabels, ylabels) {

    if (myChart != null) {
        myChart.destroy();
    }

    const ctx = document.getElementById('state-chart').getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'New Cases in the Last 30 Days',
                data: ylabels,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function drawUSDeathChart(xlabels, ylabels) {

    if (myChart != null) {
        myChart.destroy();
    }

    const ctx = document.getElementById('state-chart').getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'New Deaths in the Last 30 Days',
                data: ylabels,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function drawChart1(xlabels, ylabels) {
    if (myChart != null) {
        myChart.destroy();
    }
    const ctx = document.getElementById('state-chart').getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'New Cases in the Last 30 Days',
                data: ylabels,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function drawChart2(xlabels, ylabels) {
    if (myChart != null) {
        myChart.destroy();
    }
    const ctx = document.getElementById('state-chart').getContext('2d');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'New Deaths in the Last 30 Days',
                data: ylabels,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

let myRightChart = null
function drawChart3(xlabels, ylabels) {
    if (myRightChart != null) {
        myRightChart.destroy();
    }
    const ctx = document.getElementById('deathRate-chart').getContext('2d');

    myRightChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Death Rate in the Last 30 Days (%)',
                data: ylabels,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
    });
}

function drawChart4(xlabels, ylabels) {
    if (myRightChart != null) {
        myRightChart.destroy();
    }
    const ctx = document.getElementById('deathRate-chart').getContext('2d');

    myRightChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Vaccination Rate (%)',
                data: ylabels,
                backgroundColor:
                    'rgba(75, 192, 192, 0.2)',
                borderColor:
                    'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: [{
                    min: 40,
                }]
            },
        }
    });
}

function drawChart5(xlabels, ylabels) {
    if (myRightChart != null) {
        myRightChart.destroy();
    }
    const ctx = document.getElementById('deathRate-chart').getContext('2d');

    myRightChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'New Cases per Capita in last 30 days (%)',
                data: ylabels,
                backgroundColor:
                    'rgba(54, 162, 235, 0.2)',
                borderColor:
                    'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
    });
}