$(document).ready(function () {
    getDefaultCardData()
    getDefaultChartData()
    $('#searchState').select2()
    $('#findState').select2()
    getCard5ChartData()

    let isStateSelected = false;

    $("#vaccineButton").on("click", function (e) {
        e.preventDefault();
        let findState = $("#findState").val();
        for (let i = 0; i < vaccinePage.length; i++) {
            if (vaccinePage[i]["state"] === findState) {
                window.location = vaccinePage[i]["website"]
            }
        }
    });


    $("#searchForm").on("change", function (e) {
        e.preventDefault();
        let searchState = $("#searchState").val();
        $('#stateSelected').html("State: " + searchState)
        getNewCases(searchState);
        getNewDeaths(searchState);
        getDeathRate(searchState);
        getVaccinationRate(searchState);

        if (myChart != null) {
            myChart.destroy();
        }

        getCard1ChartData()

        sessionStorage.setItem('stateName', searchState);
        isStateSelected = true;
    });

    $("#card1").on("click", function () {
        if (isStateSelected) {
            getCard1ChartData()
        } else{
            getDefaultChartData()
        }
    })

    $("#card2").on("click", function () {
        if (isStateSelected) {
            getCard2ChartData()
        } else{
            getUSDeathData()
        }
    })

    $("#deathRateButton").change(function () {
        getCard3ChartData()
    })
    $("#vaccRateButton").change(function () {
        getCard4ChartData()
    })
    $("#newCaseRateButton").change(function () {
        getCard5ChartData()
    })
});

let stateName = sessionStorage.getItem("stateName")

function getNewCases(searchState) {
    axios.get(`https://disease.sh/v3/covid-19/nyt/states/${searchState}`)
        .then(response => {
            let today = response.data[29].cases
            let yesterday = response.data[28].cases
            let newCases = today - yesterday;

            $('#newCases').html(newCases);
            $('#totalCases').html(today);
        }).catch(error => console.log(error))
}

function getNewDeaths(searchState) {
    axios.get(`https://disease.sh/v3/covid-19/nyt/states/${searchState}`)
        .then(response => {
            let today = response.data[29].deaths
            let yesterday = response.data[28].deaths
            let newDeaths = today - yesterday;

            $('#newDeaths').html(newDeaths);
            $('#totalDeaths').html(today);
        }).catch(error => console.log(error))
}

function getDeathRate(searchState) {
    axios.get(`https://disease.sh/v3/covid-19/nyt/states/${searchState}`)
        .then(response => {
            let newMonthlyCases = response.data[29].cases - response.data[0].cases
            let newMonthlyDeaths = response.data[29].deaths - response.data[0].deaths
            let newDeathRate = (newMonthlyDeaths / newMonthlyCases * 100).toFixed(2);

            $('#deathRate').html(newDeathRate);
        }).catch(error => console.log(error))
}

function getVaccinationRate(searchState) {

    const requestVaccination = axios.get(`https://disease.sh/v3/covid-19/vaccine/coverage/states/${searchState === "New York" ? 'New York State' : searchState}`);
    const requestPopulation = axios.get(`https://disease.sh/v3/covid-19/states/${searchState}`)

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
            if(!isFinite(vaccinationRate)){
                vaccinationRate="N/A"
            }

            $('#vaccinationRate').html(vaccinationRate);
        })).catch(error => console.log(error))
}

