function init() {
  var selector = d3.select("#selDataset");
  d3.json("./static/data/samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    optionChanged(sampleNames[0]);
    })    
}
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");    
    Object.entries(result).forEach(([key,value])=> {
        PANEL.append("h6").text(`${key.toUpperCase()}:${value}`)
        buildGauge(result.wfreq);
    });
   });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  }

function buildCharts(sample) {
  d3.json("samples.json").then((data)=>{
   var sample_values = data.samples;
   var resultsArray = sample_values.filter(sampledata => sampledata.id == sample);
   var results = resultsArray[0];
   var otu_ids = results.otu_ids;
   var otu_labels = results.otu_labels;
   var samplevalues = results.sample_values;
   var filteredData = otu_ids.slice(0,10).map(otu_ID => `OTU${otu_ID}`);
   
   var sorted_ResultsArray = resultsArray.sort((a, b)=>  a.sample_values - b.sample_values);
   var sorted_results = sorted_ResultsArray[0];
   var sorted_otu_ids = sorted_results.otu_ids;
   var sorted_otu_labels = sorted_results.otu_labels;
   var sorted_samplevalues = sorted_results.sample_values;
   var sorted_filteredData = sorted_otu_ids.slice(0,10).map(otu_ID => `OTU${otu_ID}`);

   var trace = {
     x: sorted_samplevalues.slice(0,10).reverse(),
     y: sorted_filteredData.reverse(),
     text: sorted_otu_labels.slice(0,10).reverse(),
     orientation: "h",
     type: "bar"
   };
   var layout ={
   // title: "<B>Bacteria Cultures Per Sample</B>",
    margin: {t:30, l:150}
   };
   dataBar = [trace];
   Plotly.newPlot("bar",dataBar,layout);

  var bubbleLayout = {
    //title: "<B>Bacteria Cultures Per Sample</B>",
    xaxis:{title:"OTU ID"},
    showlegend: false,
    height: 500,
    width: 1100
  };

  var bubbleData = [{
    x: otu_ids,
    y: samplevalues,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: samplevalues,
      color: otu_ids,
      colorscale: "Earth"
    }
  }];
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
  }

  function buildGauge(wfreq) {
    //frequencey between 0 and 180
    var level = parseFloat(wfreq) * 20;
    //math calculations for the meter point using MathPI
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI)/180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // creating main path
    var mainPath = "M -.0 -0.05 L .0 0.05 L";
    var paX = String(x);
    var space = " ";
    var paY = String(y);
    var pathEnd = "Z";
    var path = mainPath.concat(paX, space, paY, pathEnd);
    var newdata = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size:12, color: "85000"},
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name"
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90, 
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgba(0, 105, 11, .5)",
                    "rgba(10, 120, 22, .5)",
                    "rgba(14, 127, 0, .5)",
                    "rgba(110, 154, 22, .5)",
                    "rgba(170, 202, 42, .5)",
                    "rgba(202, 209, 95, .5)",
                    "rgba(210, 206, 145, .5)",
                    "rgba(232, 226, 202, .5)",
                    "rgba(240, 230, 215, .5)",
                    "rgba(255, 255, 255, 0)",
                ]
            },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
        },
    ];
    var layout = {
        shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 400,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1,1]
        }
    };
    var GAUGE = document.getElementById("gauge-chart");
    Plotly.newPlot(GAUGE,newdata,layout);
  }
init();
