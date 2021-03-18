var sampleData = [];

var menu = d3.select("#selDataset");

const bactData = d3.json("./samples.json")

bactData.then((data) => {
    console.log(data.samples);
    data.names.forEach(name => {
        var option = menu.append("option");
        option.text(name);
    });
    data.samples.forEach(sample => {
        sampleData.push(sample);
    })
});

console.log(sampleData);

function optionChanged(idSel) {
    console.log(idSel);
    var table = d3.select("#sample-metadata");
    table.html("");
    var metadata = {};
    bactData.then((data) => {
        var tableFilter = data.metadata.filter(datum => datum.id === parseInt(idSel))[0];
        console.log(tableFilter);
        Object.entries(tableFilter).forEach(([key, value]) => {
            var par = table.append("p");
            par.text(`${key}: ${value}`);
        });
    });

    bactData.then((data) => {
        var idFilter = data.samples.filter(datum => datum.id === idSel);
        console.log(idFilter);
        var values = idFilter.map(r => r.sample_values)[0].slice(0, 10);
        var ids = idFilter.map(r => r.otu_ids)[0].slice(0, 10);
        var idLabels = [];
        ids.forEach(id => {
            idLabels.push(`OTU ${id}`);
        });
        var labels = idFilter.map(r => r.otu_labels)[0].slice(0, 10);
        console.log(values);
        console.log(ids);
        console.log(idLabels)
        console.log(labels);
        var traceBar = {
            x: values,
            y: idLabels,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        var barData = [traceBar];

        var barLayout = {
            title: "OTU abundance"
        };
        Plotly.newPlot("bar", barData, barLayout);

        var traceBubble = {
            x: ids,
            y: values,
            mode: "markers",
            marker: {
                size: values,
                color: ids
            }
        };
        var bubbleData = [traceBubble];

        var bubbleLayout = {
            title: "OTU bubbles",
            xaxis: { title: "OTU ID" }
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};