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
            detourWeight: this.props.detourWeight || 1.0,
            nationalImpWeight: this.props.nationalImpWeight || 1.0,
            severityIndexWeight: this.props.severityIndexWeight || 1.0,
            growthWeight: this.props.growthWeight || 1.0,
            seasonalWeight: this.props.seasonalWeight || 1.0,
        };

        Map.styleRoadway = Map.styleRoadway.bind(this);
        Map.highlightFeature = Map.highlightFeature.bind(this);
        Map.resetHighlight = Map.resetHighlight.bind(this);
        Map.ensureNumber = Map.ensureNumber.bind(this);
        this.handleFeatureMouseover = this.handleFeatureMouseover.bind(this);
        this.handleFeatureMouseout = this.handleFeatureMouseout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateInfo = this.updateInfo.bind(this);

        this.getColorByProp = this.getColorByProp.bind(this);

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
        let primaryLayer = L.geoJson(this.props.roadwayData, {
            style: Map.styleRoadway,
        }).addTo(this.map);

        // Set Up click and hover (mouseover/mouseout) events for the roadway segments
        const layerKeys = Object.keys(primaryLayer._layers);
        for (const key of layerKeys) {
            primaryLayer._layers[key].on('click', this.handleClick);
            primaryLayer._layers[key].on('mouseover', this.handleFeatureMouseover);
            primaryLayer._layers[key].on('mouseout', this.handleFeatureMouseout);
        }

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
            this._div = L.DomUtil.create('div', 'info');
            return this._div;
        };
        infoDiv.addTo(this.map);

        // Fit the maps bounds ot the roadway segments layer
        this.map.fitBounds(primaryLayer.getBounds());

        // Update the state
        this.setState({
            primaryLayer: primaryLayer,
            infoDiv: infoDiv
        });
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
            let hasAllScores = true;
            let incidentFactorVal = 1.0;
            if (infoLayer.feature.properties["inc_fac"]) {
                incidentFactorVal = Map.ensureNumber(infoLayer.feature.properties["inc_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let detourFactorVal = 0.0;
            if (infoLayer.feature.properties["detour_fac"]) {
                detourFactorVal = Map.ensureNumber(infoLayer.feature.properties["detour_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let nationalImpFactorVal = 0.0;
            let nationalImpFactorCat = "--";
            if (infoLayer.feature.properties["nat_imp_cat"]) {
                nationalImpFactorCat = infoLayer.feature.properties["nat_imp_cat"]
                nationalImpFactorVal = Map.ensureNumber(infoLayer.feature.properties["nat_imp_fac"], parseInt);
            }
            let severityIndexFactorVal = 0.0;
            if (infoLayer.feature.properties["si_fac"]) {
                severityIndexFactorVal = Map.ensureNumber(infoLayer.feature.properties["si_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let growthFactorVal = 1.0;
            if (infoLayer.feature.properties["growth_fac"]) {
                growthFactorVal = Map.ensureNumber(infoLayer.feature.properties["growth_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let seasonalFactorVal = 1.0;
            if (infoLayer.feature.properties["seasonal_fac"]) {
                seasonalFactorVal = Map.ensureNumber(infoLayer.feature.properties["seasonal_fac"], parseFloat);
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
            infoDiv._div.innerHTML += '<br /><b>AADT (2018): </b> ' + Map.ensureNumber(infoLayer.feature.properties["aadt_2018"], parseInt).toLocaleString();
            infoDiv._div.innerHTML += '<br />';
            if (hasAllScores) {
                infoDiv._div.innerHTML += '<table><thead><tr><th>Factor</th><th>Adjusted</th><th>Raw</th></tr></thead>';
                infoDiv._div.innerHTML += '<tbody>';
                infoDiv._div.innerHTML += '<tr><td>Priority</td><td>' + adjustedPriorityScore.toFixed(2) +'</td><td>' + priorityScore.toFixed(2) +'</td></tr>';
                infoDiv._div.innerHTML += '<tr><td>Detour</td><td>' + adjustedDetour.toFixed(2) +'</td><td>' + detourFactorVal.toFixed(2) +'</td></tr>';
                infoDiv._div.innerHTML += '<tr><td>National Importance</td><td>' + adjustedNationalImp.toFixed(2) +'</td><td>' + nationalImpFactorVal.toFixed(2) +'</td></tr>';
                infoDiv._div.innerHTML += '<tr><td>Severity Index</td><td>' + adjustedSeverity +'</td><td>' + severityIndexFactorVal.toFixed(2) +'</td></tr>';
                infoDiv._div.innerHTML += '<tr><td>Growth</td><td>' + adjustedGrowth.toFixed(2) +'</td><td>' + growthFactorVal.toFixed(2) +'</td></tr>';
                infoDiv._div.innerHTML += '<tr><td>Seasonal</td><td>' + adjustedSeasonal +'</td><td>' + seasonalFactorVal.toFixed(2) + '</td></tr>';
                infoDiv._div.innerHTML += '</tbody></table>';
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
            Map.highlightFeature(tempState.hoverLayer)
        } else {
            Map.resetHighlight(prevState.hoverLayer);
        }

        if (tempState.primaryLayer) {
            if (tempState.colorScale !== prevState.colorScale) {
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
            color: this.getColorByProp(feature.properties),
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
        let nationalImpFactorCat = "--";
        if (feature.properties["nat_imp_cat"]) {
            nationalImpFactorCat = feature.properties["nat_imp_cat"]
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
            let detourWeight = 1.0;
            let severityIndexWeight = 1.0;
            let nationalImpWeight = 1.0;
            let growthWeight = 1.0;
            let seasonalWeight = 1.0;
            let adjustedDetour = detourFactorVal * detourWeight;
            let adjustedSeverity = severityIndexFactorVal * severityIndexWeight;
            let adjustedNationalImp = nationalImpFactorVal * nationalImpWeight;
            let adjustedGrowth = growthFactorVal * growthWeight;
            let adjustedSeasonal = seasonalFactorVal * seasonalWeight;
            priorityScore = incidentFactorVal * (adjustedDetour + adjustedSeverity + adjustedNationalImp + adjustedGrowth + adjustedSeasonal)
        }
        return priorityScore;
    }

    getColorByProp(f_props) {
        if (f_props.route_class !== "Interstate" && f_props.route_class !== "US Route") {
            return 'grey';
        }
        const colorVal = Math.max(Math.min(f_props["inc_fac"] - 1, 1), 0);
        if (this.state.colorScale === "RdYlGn") {
            return d3.interpolateRdYlGn(1 - colorVal);
        } else if (this.state.colorScale === "Blues") {
            return d3.interpolateBlues(colorVal);
        } else if (this.state.colorScale === "Viridis") {
            // return d3.interpolateViridis(1 - colorVal);
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