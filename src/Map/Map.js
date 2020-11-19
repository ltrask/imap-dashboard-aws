import React from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import 'leaflet-draw';
import * as d3 from 'd3';
import 'd3-scale-chromatic';
import './Map.css'
import 'leaflet-draw/dist/leaflet.draw.css';

class Map extends React.Component {
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
            maxIncidentFac: 100.0
        };

        Map.styleRoadway = Map.styleRoadway.bind(this);
        Map.highlightFeature = Map.highlightFeature.bind(this);
        Map.resetHighlight = Map.resetHighlight.bind(this);
        Map.ensureNumber = Map.ensureNumber.bind(this);
        this.handleFeatureMouseover = this.handleFeatureMouseover.bind(this);
        this.handleFeatureMouseout = this.handleFeatureMouseout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updateLegendGradientBarColor = this.updateLegendGradientBarColor.bind(this);

        Map.getColorByProp = Map.getColorByProp.bind(this);

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

        // var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        //     maxZoom: 20,
        //     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        // });
        var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 16,
        });
        // var Esri_Gray2_Labels = L.esri.basemapLayer('GrayLabels');

        var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        });

        // create map
        this.map = L.map('map-sp', {
            center: this.props.mapCenter,
            zoom: 7,
        });
        // Esri_WorldGrayCanvas.on('add', function() {
        //     Esri_Gray2_Labels.addTo(this.map);
        // });
        // Esri_WorldGrayCanvas.on('remove', function() {
        //     this.map.removeLayer(Esri_Gray2_Labels);
        // });
        Esri_WorldGrayCanvas.addTo(this.map);

        // Create roadway GeoJSON layer
        let primaryLayer = L.geoJson(this.props.roadwayData, {
            style: Map.styleRoadway,
        }).addTo(this.map);

        // Set Up click and hover (mouseover/mouseout) events for the roadway segments
        const layerKeys = Object.keys(primaryLayer._layers);
        let priorityList = [];
        let maxPriorityScore = -1;
        // let maxIncidentFactorTest = -1;
        for (const key of layerKeys) {
            primaryLayer._layers[key].feature.properties['priority'] = Map.computePriorityScore(primaryLayer._layers[key].feature)
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
        let index85 = Math.ceil(priorityList.length * 0.85)
        console.log('85th Priority: ' + priorityList[index85]);
        let priority85 = priorityList[index85];

        // Create base maps object for layer control
        let baseMaps = {
            "OpenStreetMaps": osmLayer,
            "Greyscale": Esri_WorldGrayCanvas,
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
            this._div = L.DomUtil.create('div', 'info');
            return this._div;
        };
        infoDiv.addTo(this.map);

        const legendDiv = L.control({position: 'bottomright'})
        legendDiv.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info info-opaque')
            let legendTitleDiv = document.createElement('div');
            legendTitleDiv.id = 'legend-title';
            legendTitleDiv.style.height = '14pt';
            legendTitleDiv.style.fontSize = '11pt';
            legendTitleDiv.innerHTML = "<h4>Computed Priority Score</h4>";
            let gradientDiv = document.createElement('div');
            gradientDiv.id = "legend-gradient-bar";
            gradientDiv.style.width='184px';
            gradientDiv.style.height='15px';
            gradientDiv.style.border = "1px solid grey";
            gradientDiv.style.borderRadius = "2px";
            let minLabel = document.createElement('span');
            minLabel.innerHTML = "0";
            minLabel.style.float = 'left';
            let maxLabel = document.createElement('span');
            maxLabel.id="legend-max-label";
            maxLabel.innerHTML = "10+";
            maxLabel.style.float = 'right';
            let legendScaleLabelDiv = document.createElement('div');
            legendScaleLabelDiv.appendChild(minLabel);
            legendScaleLabelDiv.appendChild(maxLabel);
            this._div.appendChild(legendTitleDiv);
            this._div.appendChild(gradientDiv);
            this._div.appendChild(legendScaleLabelDiv);
            this._div.style.width = "200px";
            return this._div
        }
        legendDiv.addTo(this.map);
        this.updateLegendGradientBarColor(this.state.colorScale);

        // Fit the maps bounds ot the roadway segments layer
        this.map.fitBounds(primaryLayer.getBounds());

        // Update the state
        this.setState({
            primaryLayer: primaryLayer,
            infoDiv: infoDiv,
            maxPriority: priority85
        });
    }

    updateLegendGradientBarColor(colorScale) {
        if (colorScale === 'RdYlGn') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(-90deg, rgb(165, 0, 38),rgb(212, 50, 44),rgb(241, 110, 67),rgb(252, 172, 99),rgb(254, 221, 141),rgb(249, 247, 174),rgb(215, 238, 142),rgb(164, 216, 110),rgb(100, 188, 97),rgb(34, 150, 79),rgb(0, 104, 55))';
        } else if (colorScale === 'Viridis') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, #440154, #482475, #414487, #355f8d, #2a788e, #21908d, #22a884, #42be71, #7ad151, #bddf26, #fde725)';  //https://bennettfeely.com/cssscales/#viridis
        } else if (colorScale === 'Blues') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(247, 251, 255),rgb(227, 238, 249),rgb(207, 225, 242),rgb(181, 212, 233),rgb(147, 195, 223),rgb(109, 174, 213),rgb(75, 151, 201),rgb(47, 126, 188),rgb(24, 100, 170),rgb(10, 74, 144),rgb(8, 48, 107))';
        } else if (colorScale === 'Greyscale') {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(255, 255, 255),rgb(242, 242, 242),rgb(226, 226, 226),rgb(206, 206, 206),rgb(180, 180, 180),rgb(151, 151, 151),rgb(122, 122, 122),rgb(95, 95, 95),rgb(64, 64, 64),rgb(30, 30, 30),rgb(0, 0, 0))';
        } else {
            document.getElementById("legend-gradient-bar").style.background = 'linear-gradient(90deg, rgb(255,245,240), rgb(254,277,214), rgb(253,201,180), rgb(252,170,142), rgb(252,138,107), rgb(249,105,76), rgb(239,69,51), rgb(217,29,35), rgb(187,21,26), rgb(151,11,19), rgb(103,0,13))';
        }
    }

    static ensureNumber(val, parseFunc) {
        if (typeof(val) === 'string') {
            return parseFunc(val);
        }
        return val;
    }

    updateInfo() {
        const infoDiv = this.state.infoDiv;
        const infoLayer = this.state.hoverLayer;
        if (infoLayer) {
            let incidentFactorVal = 1.0;
            if (infoLayer.feature.properties["inc_fac"]) {
                incidentFactorVal = Map.ensureNumber(infoLayer.feature.properties["inc_fac"], parseFloat);
            }
            let detourFactorVal = 0.0;
            if (infoLayer.feature.properties["detour_fac"]) {
                detourFactorVal = Map.ensureNumber(infoLayer.feature.properties["detour_fac"], parseFloat);
            }
            let nationalImpFactorCat = "--";
            if (infoLayer.feature.properties["nat_imp_cat"]) {
                nationalImpFactorCat = infoLayer.feature.properties["nat_imp_cat"]
            }
            let severityIndexFactorVal = 0.0;
            if (infoLayer.feature.properties["si_fac"]) {
                severityIndexFactorVal = Map.ensureNumber(infoLayer.feature.properties["si_fac"], parseFloat);
            }
            let growthFactorVal = 1.0;
            if (infoLayer.feature.properties["growth_fac"]) {
                growthFactorVal = Map.ensureNumber(infoLayer.feature.properties["growth_fac"], parseFloat);
            }
            let seasonalFactorVal = 1.0;
            if (infoLayer.feature.properties["seasonal_fac"]) {
                seasonalFactorVal = Map.ensureNumber(infoLayer.feature.properties["seasonal_fac"], parseFloat);
            }
            let priorityScoreStr = '--';
            if (infoLayer.feature.properties["priority"] && infoLayer.feature.properties['priority'] > 0) {
                priorityScoreStr = infoLayer.feature.properties['priority'].toFixed(2);
            }
            infoDiv._div.innerHTML = '<h4>Segment Info</h4>';
            infoDiv._div.innerHTML += '<br /><b>Route ID: </b> ' + infoLayer.feature.properties["route_id"];
            infoDiv._div.innerHTML += '<br /><b>Functional Class: </b> ' + infoLayer.feature.properties["route_class"];
            infoDiv._div.innerHTML += '<br /><b>Route Number: </b> ' + infoLayer.feature.properties["route_no"];
            infoDiv._div.innerHTML += '<br /><b>AADT (2018): </b> ' + Map.ensureNumber(infoLayer.feature.properties["aadt_2018"], parseInt).toLocaleString();
            infoDiv._div.innerHTML += '<br />';
            infoDiv._div.innerHTML += '<br /><b>Priority Score: </b> ' +priorityScoreStr;
            infoDiv._div.innerHTML += '<br />';
            infoDiv._div.innerHTML += '<br /><b>Incident Factor: </b> ' + incidentFactorVal.toFixed(2);
            infoDiv._div.innerHTML += '<br /><b>Detour Factor: </b> ' + detourFactorVal.toFixed(2);
            infoDiv._div.innerHTML += '<br /><b>National Importance: </b> ' + nationalImpFactorCat;
            infoDiv._div.innerHTML += '<br /><b>Severity Index Factor: </b> ' + severityIndexFactorVal.toFixed(2);
            infoDiv._div.innerHTML += '<br /><b>Growth Factor: </b> ' + growthFactorVal.toFixed(2);
            infoDiv._div.innerHTML += '<br /><b>Seasonal Factor: </b> ' + seasonalFactorVal.toFixed(2);
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
            Map.highlightFeature(tempState.hoverLayer)
        } else {
            Map.resetHighlight(prevState.hoverLayer);
        }

        if (tempState.primaryLayer) {
            if (tempState.colorScale !== prevState.colorScale || tempState.maxPriority !== prevState.maxPriority) {
                tempState.primaryLayer.eachLayer(function (layer) {
                    layer.setStyle(Map.styleRoadway(layer.feature));
                })
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
            Map.styleRoadway(e.feature);
            const layer = e;
            layer.setStyle(Map.styleRoadway(layer.feature));
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
            color: Map.getColorByProp(feature.properties, 'Viridis', 10.0),
            weight: wt
        };
    }


    static computePriorityScore(feature) {
        let hasAllScores = true;
        let incidentFactorVal = 1.0;
        if (feature.properties["inc_fac"]) {
            incidentFactorVal = Map.ensureNumber(feature.properties["inc_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let detourFactorVal = 0.0;
        if (feature.properties["detour_fac"]) {
            detourFactorVal = Map.ensureNumber(feature.properties["detour_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let nationalImpFactorVal = 0.0;
        if (feature.properties["nat_imp_cat"]) {
            nationalImpFactorVal = Map.ensureNumber(feature.properties["nat_imp_fac"], parseInt);
        }
        let severityIndexFactorVal = 0.0;
        if (feature.properties["si_fac"]) {
            severityIndexFactorVal = Map.ensureNumber(feature.properties["si_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let growthFactorVal = 1.0;
        if (feature.properties["growth_fac"]) {
            growthFactorVal = Map.ensureNumber(feature.properties["growth_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let seasonalFactorVal = 1.0;
        if (feature.properties["seasonal_fac"]) {
            seasonalFactorVal = Map.ensureNumber(feature.properties["seasonal_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }

        let priorityScore = -1;
        if (hasAllScores) {
            priorityScore = incidentFactorVal * (detourFactorVal + severityIndexFactorVal + nationalImpFactorVal + growthFactorVal + seasonalFactorVal)
        }
        return priorityScore;
    }

    static getColorByProp(f_props, colorValueType, maxPriority) {
        // const colorVal = Math.max(Math.min(f_props["inc_fac"] - 1, 1), 0);
        let colorVal;
        switch (colorValueType) {
            default:
            case 'priority':
                if (!f_props["priority"] || maxPriority < 0) {
                    return 'cyan';
                }
                colorVal = Math.max(Math.min((f_props["priority"] / maxPriority), 1), 0);
                break;
            case 'inc_fac':
                colorVal = Math.max(Math.min((f_props["priority"] / 100.0), 1), 0);
                break;
            case 'detour_fac':
            case 'nat_imp_fac':
            case 'si_fac':
            case 'growth_fac':
            case 'seasonal_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);
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
            <div id="map-sp" />
        )
    }
}

export default Map;