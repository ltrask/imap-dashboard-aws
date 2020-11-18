import React from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import 'leaflet-draw';
import * as d3 from 'd3';
import 'd3-scale-chromatic';
import './Map.css'
import 'leaflet-draw/dist/leaflet.draw.css';
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import CustomSliderInput from "../Dashboard/CustomSliderInput";
import BasisPaginationGrid from "../Table/SimpleTable";

class SensitivityDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            primaryLayer: null,
            additionalLayers: null,
            colorScale: "Viridis",
            infoDiv: null,
            hoverLayer: null,
            colorValueType: 'priority',
            maxPriority: -1,
            maxIncidentFac: 100.0,
            detourWeight: this.props.initialDetourWeight || 1.0,
            nationalImpWeight: this.props.intialNationalImpWeight || 1.0,
            severityIndexWeight: this.props.initialSeverityIndexWeight || 1.0,
            growthWeight: this.props.initialGrowthWeight || 1.0,
            seasonalWeight: this.props.initialSeasonalWeight || 1.0,
            updateColors: false
        };

        SensitivityDashboard.styleRoadway = SensitivityDashboard.styleRoadway.bind(this);
        SensitivityDashboard.highlightFeature = SensitivityDashboard.highlightFeature.bind(this);
        SensitivityDashboard.resetHighlight = SensitivityDashboard.resetHighlight.bind(this);
        SensitivityDashboard.ensureNumber = SensitivityDashboard.ensureNumber.bind(this);
        SensitivityDashboard.createOption = SensitivityDashboard.createOption.bind(this);
        this.handleFeatureMouseover = this.handleFeatureMouseover.bind(this);
        this.handleFeatureMouseout = this.handleFeatureMouseout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateInfo = this.updateInfo.bind(this);

        this.handleLegendColorChange = this.handleLegendColorChange.bind(this);
        this.updateLegendGradientBarColor = this.updateLegendGradientBarColor.bind(this);
        this.handleVisualizationMetricChange = this.handleVisualizationMetricChange.bind(this);
        // this.styleRoadway = this.styleRoadway.bind(this);
        this.getColorByProp = this.getColorByProp.bind(this);
        this.computePriorityScore = this.computePriorityScore.bind(this);

        // Binding the slider input handleChange functions
        this.handleIncidentChange = this.handleIncidentChange.bind(this);
        this.handleDetourChange = this.handleDetourChange.bind(this);
        this.handleNationalImpChange = this.handleNationalImpChange.bind(this);
        this.handleSeverityIndexChange = this.handleSeverityIndexChange.bind(this);
        this.handleGrowthChange = this.handleGrowthChange.bind(this);
        this.handleSeasonalChange = this.handleSeasonalChange.bind(this);

        // Binding the slider input handleChangeCommit functions
        this.handleIncidentChangeCommit = this.handleIncidentChangeCommit.bind(this);
        this.handleDetourChangeCommit = this.handleDetourChangeCommit.bind(this);
        this.handleNationalImpChangeCommit = this.handleNationalImpChangeCommit.bind(this);
        this.handleSeverityIndexChangeCommit = this.handleSeverityIndexChangeCommit.bind(this);
        this.handleGrowthChangeCommit = this.handleGrowthChangeCommit.bind(this);
        this.handleSeasonalChangeCommit = this.handleSeasonalChangeCommit.bind(this);

        // Binding the number input handleChange functions
        this.handleIncidentInputChange = this.handleIncidentInputChange.bind(this);
        this.handleDetourInputChange = this.handleDetourInputChange.bind(this);
        this.handleNationalImpInputChange = this.handleNationalImpInputChange.bind(this);
        this.handleSeverityIndexInputChange = this.handleSeverityIndexInputChange.bind(this);
        this.handleGrowthInputChange = this.handleGrowthInputChange.bind(this);
        this.handleSeasonalInputChange = this.handleSeasonalInputChange.bind(this);

        // Binding the "blur" functions for each input to have the slider change the input on drag
        this.handleIncidentBlur = this.handleIncidentBlur.bind(this);
        this.handleDetourBlur = this.handleDetourBlur.bind(this);
        this.handleNationalImpBlur = this.handleNationalImpBlur.bind(this);
        this.handleSeverityIndexBlur = this.handleSeverityIndexBlur.bind(this);
        this.handleGrowthBlur = this.handleGrowthBlur.bind(this);
        this.handleSeasonalBlur = this.handleSeasonalBlur.bind(this);

    }

    handleIncidentChange(event, value) {
        this.setState({incidentWeight: value});
    }

    handleDetourChange(event, value) {
        this.setState({detourWeight: value});
    }

    handleNationalImpChange(event, value) {
        this.setState({nationalImpWeight: value});
    }

    handleSeverityIndexChange(event, value) {
        this.setState({severityIndexWeight: value});
    }

    handleGrowthChange(event, value) {
        this.setState({growthWeight: value});
    }

    handleSeasonalChange(event, value) {
        this.setState({seasonalWeight: value});
    }

    handleIncidentChangeCommit(event, value) {
        this.setState({incidentWeight: value, updateColors: true});
    }

    handleDetourChangeCommit(event, value) {
        this.setState({detourWeight: value, updateColors: true});
    }

    handleNationalImpChangeCommit(event, value) {
        this.setState({nationalImpWeight: value, updateColors: true});
    }

    handleSeverityIndexChangeCommit(event, value) {
        this.setState({severityIndexWeight: value, updateColors: true});
    }

    handleGrowthChangeCommit(event, value) {
        this.setState({growthWeight: value, updateColors: true});
    }

    handleSeasonalChangeCommit(event, value) {
        this.setState({seasonalWeight: value, updateColors: true});
    }

    handleIncidentInputChange(event) {
        this.setState({
            incidentWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleDetourInputChange(event) {
        this.setState({
            detourWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleNationalImpInputChange(event) {
        this.setState({
            nationalImpWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleSeverityIndexInputChange(event) {
        this.setState({
            severityIndexWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleGrowthInputChange(event) {
        this.setState({
            growthWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleSeasonalInputChange(event) {
        this.setState({
            seasonalWeight: event.target.value === '' ? '' : Number(event.target.value),
            updateColors: true
        });
    }

    handleIncidentBlur() {
        if (this.state.incidentWeight < 0) {
            this.setState({incidentWeight: 0});
        } else if (this.state.incidentWeight > 2) {
            this.setState({incidentWeight: 2});
        }
    }

    handleDetourBlur() {
        if (this.state.detourWeight < 0) {
            this.setState({detourWeight: 0});
        } else if (this.state.detourWeight > 2) {
            this.setState({detourWeight: 2});
        }
    }

    handleNationalImpBlur() {
        if (this.state.nationalImpWeight < 0) {
            this.setState({nationalImpWeight: 0});
        } else if (this.state.nationalImpWeight > 2) {
            this.setState({nationalImpWeight: 2});
        }
    }

    handleSeverityIndexBlur() {
        if (this.state.severityIndexWeight < 0) {
            this.setState({severityIndexWeight: 0});
        } else if (this.state.severityIndexWeight > 2) {
            this.setState({severityIndexWeight: 2});
        }
    }

    handleGrowthBlur() {
        if (this.state.growthWeight < 0) {
            this.setState({growthWeight: 0});
        } else if (this.state.growthWeight > 2) {
            this.setState({growthWeight: 2});
        }
    }

    handleSeasonalBlur() {
        if (this.state.seasonalWeight < 0) {
            this.setState({seasonalWeight: 0});
        } else if (this.state.seasonalWeight > 2) {
            this.setState({seasonalWeight: 2});
        }
    }

    componentDidMount() {

        let osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });

        let googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

        var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

        // create map
        this.map = L.map('map-sp', {
            center: this.props.mapCenter,
            zoom: 7,
            layers: [Stadia_AlidadeSmooth]
        });

        // Create roadway GeoJSON layer
        let primaryLayer = L.geoJson(this.props.primaryLayer, {
            style: SensitivityDashboard.styleRoadway,
        }).addTo(this.map);

        // Set Up click and hover (mouseover/mouseout) events for the roadway segments
        const layerKeys = Object.keys(primaryLayer._layers);
        let priorityList = [];
        let maxPriorityScore = -1;
        // let maxIncidentFactorTest = -1;git
        for (const key of layerKeys) {
            primaryLayer._layers[key].feature.properties['priority'] = this.computePriorityScore(primaryLayer._layers[key].feature.properties, false)
            priorityList.push(primaryLayer._layers[key].feature.properties['priority']);
            if (primaryLayer._layers[key].feature.properties['priority']  > maxPriorityScore) {
                maxPriorityScore = primaryLayer._layers[key].feature.properties['priority'];
            }
            // if (primaryLayer._layers[key].feature.properties['inc_fac']  > maxIncidentFactorTest) {
            //     maxIncidentFactorTest = primaryLayer._layers[key].feature.properties['inc_fac'];
            // }
            primaryLayer._layers[key].on('click', this.handleClick);
            primaryLayer._layers[key].on('mouseover', this.handleFeatureMouseover);
            primaryLayer._layers[key].on('mouseout', this.handleFeatureMouseout);
        }
        // console.log('Max Inc Fac: ' + maxIncidentFactorTest);
        console.log('Max Priority: ' + maxPriorityScore);
        priorityList.sort(function(a, b) { return a - b });
        let index50 = Math.ceil(priorityList.length * 0.5)
        console.log('50th Priority: ' + priorityList[index50]);
        let priority85 = priorityList[index50];

        // Create base maps object for layer control
        let baseMaps = {
            "OpenStreetMaps": osmLayer,
            "Greyscale": Stadia_AlidadeSmooth,
            "Dark": Stadia_AlidadeSmoothDark,
            "Google Satellite": googleSat,
            "Google Hybrid": googleHybrid,
        };

        // Create overlay layers object for layer cotnrol
        let roadwayLabel = this.props.primaryLayerName || "Roadway Data"
        let overlayLayers = {};
        overlayLayers[roadwayLabel]=primaryLayer;

        // Create the layer control and add to bottom left of map
        L.control.layers(baseMaps, overlayLayers, {position: "bottomleft"}).addTo(this.map);

        // Add hover info div to top-right corner
        const infoDiv = L.control({position: 'topright'});
        infoDiv.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info info-opaque');
            return this._div;
        };
        infoDiv.addTo(this.map);

        const legendDiv = L.control({position: 'bottomright'})
        legendDiv.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info info-opaque')
            let metricSelectDiv = document.createElement('select');
            metricSelectDiv.id = "legend-metric-select";
            metricSelectDiv.add(SensitivityDashboard.createOption('Priority', 'priority', true));
            metricSelectDiv.add(SensitivityDashboard.createOption('Incident Factor', 'inc_fac', false));
            metricSelectDiv.add(SensitivityDashboard.createOption('Detour Factor', 'detour_fac', false));
            metricSelectDiv.add(SensitivityDashboard.createOption('National Importance Factor', 'nat_imp_fac', false));
            metricSelectDiv.add(SensitivityDashboard.createOption('Severity Index Factor', 'si_fac', false));
            metricSelectDiv.add(SensitivityDashboard.createOption('Growth Factor', 'growth_fac', false));
            metricSelectDiv.add(SensitivityDashboard.createOption('Seasonal Factor', 'seasonal_fac', false));
            metricSelectDiv.onchange = function() {legendDiv.handleMetricChange()};
            metricSelectDiv.style.width = "100%";
            let gradientSelectDiv = document.createElement('select');
            gradientSelectDiv.id = "legend-gradient-select";
            gradientSelectDiv.add(SensitivityDashboard.createOption('Viridis', 'Viridis', true));
            gradientSelectDiv.add(SensitivityDashboard.createOption('RdYlGn', 'RdYlGn', false));
            gradientSelectDiv.add(SensitivityDashboard.createOption('Blues', 'Blues', false));
            gradientSelectDiv.add(SensitivityDashboard.createOption('Reds', 'Reds', false));
            gradientSelectDiv.add(SensitivityDashboard.createOption('Greyscale', 'Greyscale', false));
            gradientSelectDiv.onchange = function() {legendDiv.handleLegendColorChange()};
            gradientSelectDiv.style.width = "100%";
            let gradientDiv = document.createElement('div');
            gradientDiv.id = "legend-gradient-bar";
            gradientDiv.style.width='184px';
            gradientDiv.style.height='15px';
            gradientDiv.style.border = "1px solid grey";
            gradientDiv.style.borderRadius = "2px";
            let minLabel = document.createElement('span');
            minLabel.innerHTML = "0.0";
            minLabel.style.float = 'left';
            let maxLabel = document.createElement('span');
            maxLabel.innerHTML = "0.0";
            maxLabel.style.float = 'right';
            let legendLabelDiv = document.createElement('div');
            legendLabelDiv.appendChild(minLabel);
            legendLabelDiv.appendChild(maxLabel);
            this._div.appendChild(metricSelectDiv);
            this._div.appendChild(gradientSelectDiv);
            this._div.appendChild(gradientDiv);
            this._div.appendChild(legendLabelDiv);
            this._div.style.width = "200px";
            return this._div
        }
        legendDiv.handleLegendColorChange = this.handleLegendColorChange;
        legendDiv.handleMetricChange = this.handleVisualizationMetricChange;
        legendDiv.addTo(this.map);
        this.updateLegendGradientBarColor(this.state.colorScale);

        // Fit the maps bounds ot the roadway segments layer
        this.map.fitBounds(primaryLayer.getBounds());

        // Update the state
        this.setState({
            primaryLayer: primaryLayer,
            infoDiv: infoDiv,
            maxPriority: priority85,
            updateColors: true
        });
    }

    static ensureNumber(val, parseFunc) {
        if (typeof(val) === 'string') {
            return parseFunc(val);
        }
        return val;
    }

    static createOption(text, value, selected) {
        let option = document.createElement("option");
        option.text = text;
        option.value = value;
        if (selected) {
            option.selected = true;
        }
        return option;
    }

    handleLegendColorChange() {
        console.log("handling legend color change select")
        console.log(document.getElementById("legend-gradient-select").value);
        let selectedColorScale = document.getElementById("legend-gradient-select").value;
        this.updateLegendGradientBarColor(selectedColorScale);
        this.setState({colorScale: document.getElementById("legend-gradient-select").value, updateColors: true})
    }

    updateLegendGradientBarColor(colorScale) {
        if (colorScale === 'RdYlGn') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(-90deg, rgb(165, 0, 38),rgb(212, 50, 44),rgb(241, 110, 67),rgb(252, 172, 99),rgb(254, 221, 141),rgb(249, 247, 174),rgb(215, 238, 142),rgb(164, 216, 110),rgb(100, 188, 97),rgb(34, 150, 79),rgb(0, 104, 55))';
        } else if (colorScale === 'Viridis') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(-90deg, #440154, #482475, #414487, #355f8d, #2a788e, #21908d, #22a884, #42be71, #7ad151, #bddf26, #fde725)';  //https://bennettfeely.com/cssscales/#viridis
        } else if (colorScale === 'Blues') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(247, 251, 255),rgb(227, 238, 249),rgb(207, 225, 242),rgb(181, 212, 233),rgb(147, 195, 223),rgb(109, 174, 213),rgb(75, 151, 201),rgb(47, 126, 188),rgb(24, 100, 170),rgb(10, 74, 144),rgb(8, 48, 107))';
        } else if (colorScale === 'Greyscale') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(255, 255, 255),rgb(242, 242, 242),rgb(226, 226, 226),rgb(206, 206, 206),rgb(180, 180, 180),rgb(151, 151, 151),rgb(122, 122, 122),rgb(95, 95, 95),rgb(64, 64, 64),rgb(30, 30, 30),rgb(0, 0, 0))';
        } else {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(255,245,240), rgb(254,277,214), rgb(253,201,180), rgb(252,170,142), rgb(252,138,107), rgb(249,105,76), rgb(239,69,51), rgb(217,29,35), rgb(187,21,26), rgb(151,11,19), rgb(103,0,13))';
        }
    }

    handleVisualizationMetricChange() {
        console.log("Metric change triggered");
        console.log(document.getElementById('legend-metric-select').value);
        this.setState({colorValueType: document.getElementById('legend-metric-select').value, updateColors: true})
    }

    updateInfo() {
        const infoDiv = this.state.infoDiv;
        const infoLayer = this.state.hoverLayer;
        if (infoLayer) {
            let hasAllScores = true;
            let incidentFactorVal = 1.0;
            if (infoLayer.feature.properties["inc_fac"]) {
                incidentFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["inc_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let detourFactorVal = 0.0;
            if (infoLayer.feature.properties["detour_fac"]) {
                detourFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["detour_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let nationalImpFactorVal = 0.0;
            if (infoLayer.feature.properties["nat_imp_cat"]) {
                nationalImpFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["nat_imp_fac"], parseInt);
            }
            let severityIndexFactorVal = 0.0;
            if (infoLayer.feature.properties["si_fac"]) {
                severityIndexFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["si_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let growthFactorVal = 1.0;
            if (infoLayer.feature.properties["growth_fac"]) {
                growthFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["growth_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let seasonalFactorVal = 1.0;
            if (infoLayer.feature.properties["seasonal_fac"]) {
                seasonalFactorVal = SensitivityDashboard.ensureNumber(infoLayer.feature.properties["seasonal_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }

            let priorityScore = -1;
            let adjustedPriorityScore = -1;
            let adjustedDetour = -1;
            let adjustedSeverity = -1;
            let adjustedNationalImp = -1;
            let adjustedGrowth = -1;
            let adjustedSeasonal = -1;
            if (hasAllScores) {
                priorityScore = incidentFactorVal * (detourFactorVal + severityIndexFactorVal + nationalImpFactorVal+ growthFactorVal + seasonalFactorVal)
                adjustedDetour = detourFactorVal * this.state.detourWeight;
                adjustedSeverity = severityIndexFactorVal * this.state.severityIndexWeight;
                adjustedNationalImp = nationalImpFactorVal * this.state.nationalImpWeight;
                adjustedGrowth = growthFactorVal * this.state.growthWeight;
                adjustedSeasonal = seasonalFactorVal * this.state.seasonalWeight;
                adjustedPriorityScore = incidentFactorVal * (adjustedDetour + adjustedSeverity + adjustedNationalImp + adjustedGrowth + adjustedSeasonal)
            }
            infoDiv._div.innerHTML = '<h4>Segment Info</h4>';
            infoDiv._div.innerHTML += '<br /><b>Route ID: </b> ' + infoLayer.feature.properties["route_id"];
            infoDiv._div.innerHTML += '<br /><b>Functional Class: </b> ' + infoLayer.feature.properties["route_class"];
            infoDiv._div.innerHTML += '<br /><b>Route Number: </b> ' + infoLayer.feature.properties["route_no"];
            infoDiv._div.innerHTML += '<br /><b>AADT (2018): </b> ' + SensitivityDashboard.ensureNumber(infoLayer.feature.properties["aadt_2018"], parseInt).toLocaleString();
            infoDiv._div.innerHTML += '<br />';
            if (hasAllScores) {
                let tableStr =  '<table><thead><tr><th>Factor</th><th>Adjusted</th><th>Raw</th></tr></thead>';
                tableStr += '<tbody>';
                tableStr += '<tr><td>Priority</td><td>' + adjustedPriorityScore.toFixed(2) +'</td><td>' + priorityScore.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Detour</td><td>' + adjustedDetour.toFixed(2) +'</td><td>' + detourFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>National Importance</td><td>' + adjustedNationalImp.toFixed(2) +'</td><td>' + nationalImpFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Severity Index</td><td>' + adjustedSeverity.toFixed(2) +'</td><td>' + severityIndexFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Growth</td><td>' + adjustedGrowth.toFixed(2) +'</td><td>' + growthFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Seasonal</td><td>' + adjustedSeasonal +'</td><td>' + seasonalFactorVal.toFixed(2) + '</td></tr>';
                tableStr+= '</tbody></table>';
                infoDiv._div.innerHTML += tableStr;
            }
        } else {
            infoDiv._div.innerHTML = '<h4>Segment Info</h4>' +
                'Hover on a segment to' +
                '<br>view its info, or click on' +
                '<br>a segment to open the' +
                '<br>analysis popup.' +
                '<br><br>' +
                'Segments are colored by' +
                '<br>estimated peak hour D/C' +
                '<br>ratio and the line width' +
                '<br>reflects AADT.';
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // const hoverLayer = this.state.hoverLayer;
        const tempState = this.state;
        this.updateInfo();
        if (tempState.hoverLayer) {
            SensitivityDashboard.highlightFeature(tempState.hoverLayer)
        } else {
            SensitivityDashboard.resetHighlight(prevState.hoverLayer);
        }

        if (tempState.primaryLayer) {
            // if (tempState.colorScale !== prevState.colorScale || tempState.maxPriority !== prevState.maxPriority) {
            //     tempState.primaryLayer.eachLayer(function (layer) {
            //         layer.setStyle(SensitivityDashboard.styleRoadway(layer.feature));
            //     })
            // }
            // let filterChange = tempState.detourWeight === prevState.detourWeight;
            // filterChange = filterChange && tempState.nationalImpWeight === prevState.nationalImpWeight;
            // filterChange = filterChange && tempState.severityIndexWeight === prevState.severityIndexWeight;
            // filterChange = filterChange && tempState.growthWeight === prevState.growthWeight;
            // filterChange = filterChange && tempState.seasonalWeight === prevState.seasonalWeight;
            // filterChange = !filterChange;
            console.log("Has primary layer")
            if (tempState.updateColors) {
                console.log("Updating colors")
                console.log(this.state.colorValueType);
                tempState.primaryLayer.eachLayer(function (layer) {
                    layer.setStyle(SensitivityDashboard.styleRoadway(layer.feature));
                });
                this.setState({updateColors: false});
            }
        }
    }


    handleClick(e) {
        // e.target reprsents the clicked segment
        console.log(e.target);
        // To access properties
        console.log(e.target.feature.properties);
    }

    static resetHighlight(e) {
        if (e) {
            SensitivityDashboard.styleRoadway(e.feature);
            const layer = e;
            layer.setStyle(this.styleRoadway(layer.feature));
        }
    }

    handleFeatureMouseover(e) {
        this.setState({
            hoverLayer: e.target
        });
    }

    handleFeatureMouseout(e) {
        this.setState({
            hoverLayer: null
        });
    }

    static highlightFeature(e) {
        const layer = e;
        layer.setStyle({
            weight: 10
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    static styleRoadway(feature) {
        let wt = 2;
        return {
            color: this.getColorByProp(feature.properties),
            weight: wt
        };
    }


    computePriorityScore(featureProps, isAdjusted) {
        let hasAllScores = true;
        let incidentFactorVal = 1.0;
        if (featureProps["inc_fac"]) {
            incidentFactorVal = SensitivityDashboard.ensureNumber(featureProps["inc_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let detourFactorVal = 0.0;
        if (featureProps["detour_fac"]) {
            detourFactorVal = SensitivityDashboard.ensureNumber(featureProps["detour_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let nationalImpFactorVal = 0.0;
        if (featureProps["nat_imp_cat"]) {
            nationalImpFactorVal = SensitivityDashboard.ensureNumber(featureProps["nat_imp_fac"], parseInt);
        }
        let severityIndexFactorVal = 0.0;
        if (featureProps["si_fac"]) {
            severityIndexFactorVal = SensitivityDashboard.ensureNumber(featureProps["si_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let growthFactorVal = 1.0;
        if (featureProps["growth_fac"]) {
            growthFactorVal = SensitivityDashboard.ensureNumber(featureProps["growth_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let seasonalFactorVal = 1.0;
        if (featureProps["seasonal_fac"]) {
            seasonalFactorVal = SensitivityDashboard.ensureNumber(featureProps["seasonal_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }

        let priorityScore = -1;
        if (hasAllScores) {
            if (isAdjusted) {
                priorityScore = incidentFactorVal * (detourFactorVal*this.state.detourWeight + severityIndexFactorVal*this.state.severityIndexWeight + nationalImpFactorVal*this.state.nationalImpWeight + growthFactorVal*this.state.growthWeight + seasonalFactorVal*this.state.seasonalWeight);
            } else {
                priorityScore = incidentFactorVal * (detourFactorVal + severityIndexFactorVal + nationalImpFactorVal + growthFactorVal + seasonalFactorVal);
            }
        }
        return priorityScore;
    }

    getColorByProp(f_props) {
        // const colorVal = Math.max(Math.min(f_props["inc_fac"] - 1, 1), 0);
        let colorVal;
        switch (this.state.colorValueType) {
            default:
            case 'priority':
                if (!f_props["priority"] || this.state.maxPriority < 0) {
                    return 'cyan';
                }
                colorVal = Math.max(Math.min((this.computePriorityScore(f_props, true) / this.state.maxPriority), 1), 0);
                break;
            case 'inc_fac':
                colorVal = Math.max(Math.min((f_props["inc_fac"] / this.state.maxIncidentFac), 1), 0);
                break;
            case 'detour_fac':
                colorVal = Math.max(Math.min(f_props[this.state.colorValueType], 1), 0) * this.state.detourWeight;
                break;
            case 'nat_imp_fac':
                colorVal = Math.max(Math.min(f_props[this.state.colorValueType], 1), 0) * this.state.nationalImpWeight;
                break;
            case 'si_fac':
                colorVal = Math.max(Math.min(f_props[this.state.colorValueType], 1), 0) * this.state.severityIndexWeight;
                break;
            case 'growth_fac':
                colorVal = Math.max(Math.min(f_props[this.state.colorValueType], 1), 0) * this.state.growthWeight;
                break;
            case 'seasonal_fac':
                colorVal = Math.max(Math.min(f_props[this.state.colorValueType], 1), 0) * this.state.seasonalWeight;
                break;
        }

        if (this.state.colorScale === "RdYlGn") {
            return d3.interpolateRdYlGn(1 - colorVal);
        } else if (this.state.colorScale === "Blues") {
            return d3.interpolateBlues(colorVal);
        } else if (this.state.colorScale === "Viridis") {
            return d3.interpolateViridis(colorVal);
        } else if (this.state.colorScale === "Greyscale") {
            return d3.interpolateGreys(colorVal);
        } else {
            return d3.interpolateReds(colorVal);
        }
    }

    render() {
        return (
        <div style={{height: "100%"}}>
            <div style={{width: "100%", height: "65%", display: "inline-flex"}}>
                <div style={{width: "66%", height: "100%"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
                        <div className='map-wrapper' style={{width: '100%', height: '100%', position: 'relative'}}>
                            <div id="map-sp" />
                            {/*<Map*/}
                            {/*    roadwayData={this.props.roadwayData}*/}
                            {/*    primaryLayerName={this.props.primaryLayerName}*/}
                            {/*    markerStart={this.props.mapCenter}*/}
                            {/*/>*/}
                        </div>
                    </Paper>
                </div>
                <div style={{width: "34%", height: "100%", paddingLeft: "5px", paddingRight: "5px"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px", padding: "10px"}}>
                        <Typography variant={"h5"}>Factor Weighting Adjustments</Typography>
                        Use the following sliders and/or numeric inputs to specify different weights for the six factors.
                        <div>
                            <CustomSliderInput
                                id="input-slider-incident"
                                label="Incident Factor"
                                value={this.state.incidentWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleIncidentChange}
                                funcSliderChangeCommit={this.handleIncidentChangeCommit}
                                funcInputChange={this.handleIncidentInputChange}
                                funcBlur={this.handleIncidentBlur}
                            />
                            <CustomSliderInput
                                id="input-slider-detour"
                                label="Detour Factor"
                                value={this.state.detourWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleDetourChange}
                                funcSliderChangeCommit={this.handleDetourChangeCommit}
                                funcInputChange={this.handleDetourInputChange}
                                funcBlur={this.handleDetourBlur}
                            />
                            <CustomSliderInput
                                id="input-slider-national-importance"
                                label="National Importance Factor"
                                value={this.state.nationalImpWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleNationalImpChange}
                                funcSliderChangeCommit={this.handleNationalImpChangeCommit}
                                funcInputChange={this.handleNationalImpInputChange}
                                funcBlur={this.handleNationalImpBlur}
                            />
                            <CustomSliderInput
                                id="input-slider-severity-index"
                                label="Severity Index Factor"
                                value={this.state.severityIndexWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleSeverityIndexChange}
                                funcSliderChangeCommit={this.handleSeverityIndexChangeCommit}
                                funcInputChange={this.handleSeverityIndexInputChange}
                                funcBlur={this.handleSeverityIndexBlur}
                            />
                            <CustomSliderInput
                                id="input-slider-growth"
                                label="Growth Factor"
                                value={this.state.growthWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleGrowthChange}
                                funcSliderChangeCommit={this.handleGrowthChangeCommit}
                                funcInputChange={this.handleGrowthInputChange}
                                funcBlur={this.handleGrowthBlur}
                            />
                            <CustomSliderInput
                                id="input-slider-seasonal"
                                label="Seasonal Factor"
                                value={this.state.seasonalWeight}
                                step={0.01}
                                min={1.0}
                                max={2.0}
                                funcHandleSlide={this.handleSeasonalChange}
                                funcSliderChangeCommit={this.handleSeasonalChangeCommit}
                                funcInputChange={this.handleSeasonalInputChange}
                                funcBlur={this.handleSeasonalBlur}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
            <div style={{height: "calc(35% - 5px)", width: "100%", paddingTop: "5px"}}>
                <Paper style={{
                    height: 'calc(100% - 10px)',
                    marginTop: "5px",
                    marginBottom: "10px",
                    overflow: "auto"
                }}>
                    <BasisPaginationGrid
                        tableData={this.props.primaryLayer}
                    />
                </Paper>
            </div>
        </div>
        )
    }
}

export default SensitivityDashboard;