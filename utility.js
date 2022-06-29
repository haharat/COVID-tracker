function formatChartResponse(response, responseType) {
    let xlabels = [];
    let ylabels = [];
    let yLabelFormat = [];
    let xLabelFormat = [];
    let yLabelFormat2 = [];

   response.data.forEach(item => {
      if(responseType === "deaths") {
          yLabelFormat.push(item.deaths)
      }
      else if(responseType === "cases") {
          yLabelFormat.push(item.cases)
      }
      xLabelFormat.push(item.date)
   })

    for (let i = 1; i < response.data.length; i++) {
        yLabelFormat2.push(yLabelFormat[i].responseType - yLabelFormat[i - 1].responseType)
    }

    xlabels = xLabelFormat
    ylabels = yLabelFormat2

    return {xData: xlabels, yData: ylabels};
}