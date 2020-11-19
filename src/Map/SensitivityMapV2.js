import React, {useState, useEffect, useCallback} from 'react';
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
import {ResponsiveBar} from "@nivo/bar";
import {kaiTheme} from "../style/kaiTheme";
// import BasisPaginationGrid from "../Table/SimpleTable";

export default function SensitivityDashboardV2(props) {
    const maxAlphaWeight = 100;
    const weightFactorStep = 0.01;
    const weightFactorMin = 0.0;
    const maxDetourWeight = 1.0;
    const maxNationalImpWeight = 1.0;
    const maxSeverityIndexWeight = 1.0;
    const maxGrowthWeight = 1.0;
    const maxSeasonalWeight = 1.0;
    const [maxPriority, setMaxPriority] = useState(-1);
    const [primaryLayer, setPrimaryLayer] = useState(null);
    const [colorScale, setColorScale] = useState('Viridis');
    const [mapInfoDiv, setMapInfoDiv] = useState(null);
    const [hoverLayer, setHoverLayer] = useState(null);
    const [colorValueType, setColorValueType] = useState('priority');
    const [maxIncidentFac, setMaxIncidentFac] = useState(100.0);
    const [alpha, setAlpha] = useState(5);
    const [detourWeight, setDetourWeight] = useState(0.5);
    const [nationalImpWeight, setNationalImpWeight] = useState(0.5);
    const [severityIndexWeight, setSeverityIndexWeight] = useState(0.5);
    const [growthWeight, setGrowthWeight] = useState(0.5);
    const [seasonalWeight, setSeasonalWeight] = useState(0.5);
    const [updateColors, setUpdateColors] = useState(false);
    const [mapComponent, setMapComponent] = useState(null);
    const [histData, setHistData] = useState(null);

    const ensureNumber = (val, parseFunc) => {
        if (typeof(val) === 'string') {
            return parseFunc(val);
        }
        return val;
    }

    const createOption = (text, value, selected) => {
        let option = document.createElement("option");
        option.text = text;
        option.value = value;
        if (selected) {
            option.selected = true;
        }
        return option;
    }

    function handleAlphaChange(event, value) {
        setAlpha(value);
    }

    function handleDetourChange(event, value) {
        setDetourWeight(value);
    }

    function handleNationalImpChange(event, value) {
        setNationalImpWeight(value);
    }

    function handleSeverityIndexChange(event, value) {
        setSeverityIndexWeight(value);
    }

    function handleGrowthChange(event, value) {
        setGrowthWeight(value);
    }

    function handleSeasonalChange(event, value) {
        setSeasonalWeight(value);
    }

    function handleAlphaChangeCommit(event, value) {
        handleAlphaChange(event, value);
        setUpdateColors(true);
    }

    function handleDetourChangeCommit(event, value) {
        handleDetourChange(event, value);
        setUpdateColors(true);
    }

    function handleNationalImpChangeCommit(event, value) {
        handleNationalImpChange(event, value);
        setUpdateColors(true);
    }

    function handleSeverityIndexChangeCommit(event, value) {
        handleSeverityIndexChange(event, value);
        setUpdateColors(true);
    }

    function handleGrowthChangeCommit(event, value) {
        handleGrowthChange(event, value);
        setUpdateColors(true);
    }

    function handleSeasonalChangeCommit(event, value) {
        handleSeasonalChange(event, value);
        setUpdateColors(true);
    }

    function handleAlphaInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleAlphaChange(event, value);
        setUpdateColors(true);
    }

    function handleDetourInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleDetourChange(event, value);
        setUpdateColors(true);
    }

    function handleNationalImpInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleNationalImpChange(event, value);
        setUpdateColors(true);
    }

    function handleSeverityIndexInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleSeverityIndexChange(event, value);
        setUpdateColors(true);
    }

    function handleGrowthInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleGrowthChange(event, value);
        setUpdateColors(true);
    }

    function handleSeasonalInputChange(event) {
        let value = event.target.value === '' ? 1.0 : Number(event.target.value);
        handleSeasonalChange(event, value);
        setUpdateColors(true);
    }

    function handleAlphaBlur() {
        if (alpha < 1.0) {
            setAlpha(1.0);
        } else if (alpha > maxAlphaWeight) {
            setAlpha(maxAlphaWeight);
        }
    }

    function handleDetourBlur() {
        if (detourWeight < 0) {
            setDetourWeight(0)
        } else if (detourWeight > maxDetourWeight) {
            setDetourWeight(maxDetourWeight)
        }
    }

    function handleNationalImpBlur() {
        if (nationalImpWeight < 0) {
            setNationalImpWeight(0)
        } else if (nationalImpWeight > maxNationalImpWeight) {
            setNationalImpWeight(maxNationalImpWeight)
        }
    }

    function handleSeverityIndexBlur() {
        if (severityIndexWeight < 0) {
            setSeverityIndexWeight(0)
        } else if (severityIndexWeight > maxSeverityIndexWeight) {
            setSeverityIndexWeight(maxSeverityIndexWeight)
        }
    }

    function handleGrowthBlur() {
        if (growthWeight < 0) {
            setGrowthWeight(0)
        } else if (growthWeight > maxGrowthWeight) {
            setGrowthWeight(maxGrowthWeight)
        }
    }

    function handleSeasonalBlur() {
        if (seasonalWeight < 0) {
            setSeasonalWeight(0)
        } else if (seasonalWeight > maxSeasonalWeight) {
            setSeasonalWeight(maxSeasonalWeight)
        }
    }

    function handleClick(e) {
        // e.target reprsents the clicked segment
        console.log(e.target);
        // To access properties
        console.log(e.target.feature.properties);
    }

    function handleFeatureMouseover(e) {
        setHoverLayer(e.target);
    }

    // function handleFeatureMouseout(e) {
    //     setHoverLayer(null);
    //     resetHighlight(e.target);
    // }

    const computePriorityScore = useCallback((featureProps, isAdjusted) => {
        let hasAllScores = true;
        let incidentFactorVal = 1.0;
        if (featureProps["inc_fac"]) {
            incidentFactorVal = ensureNumber(featureProps["inc_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let detourFactorVal = 0.0;
        if (featureProps["detour_fac"]) {
            detourFactorVal = ensureNumber(featureProps["detour_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let nationalImpFactorVal = 0.0;
        if (featureProps["nat_imp_cat"]) {
            nationalImpFactorVal = ensureNumber(featureProps["nat_imp_fac"], parseInt);
        }
        let severityIndexFactorVal = 0.0;
        if (featureProps["si_fac"]) {
            severityIndexFactorVal = ensureNumber(featureProps["si_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let growthFactorVal = 1.0;
        if (featureProps["growth_fac"]) {
            growthFactorVal = ensureNumber(featureProps["growth_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }
        let seasonalFactorVal = 1.0;
        if (featureProps["seasonal_fac"]) {
            seasonalFactorVal = ensureNumber(featureProps["seasonal_fac"], parseFloat);
        } else {
            hasAllScores = false;
        }

        let priorityScore = -1;
        if (hasAllScores) {
            if (isAdjusted) {
                let sumAllAdjust = (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight);
                let adjDetour = detourFactorVal * detourWeight / sumAllAdjust;
                let adjNatImp = nationalImpFactorVal * nationalImpWeight / sumAllAdjust;
                let adjSevInd = severityIndexFactorVal * severityIndexWeight / sumAllAdjust;
                let adjGrowth = growthFactorVal * growthWeight / sumAllAdjust;
                let adjSeason = seasonalFactorVal * seasonalWeight / sumAllAdjust;
                priorityScore = incidentFactorVal * alpha * (1 + adjDetour + adjNatImp + adjSevInd + adjGrowth + adjSeason);
            } else {
                priorityScore = incidentFactorVal * (1 + (detourFactorVal + severityIndexFactorVal + nationalImpFactorVal + growthFactorVal + seasonalFactorVal) / 5.0);
            }
        }
        return priorityScore;
    }, [alpha, detourWeight, growthWeight, nationalImpWeight, seasonalWeight, severityIndexWeight]);

    const getColorByProp = useCallback((f_props, isReset) => {
        // const colorVal = Math.max(Math.min(f_props["inc_fac"] - 1, 1), 0);
        if (isReset) {
            console.log("resetting a segment's style");
            console.log(f_props);
            console.log(colorValueType);
            console.log(maxPriority);
        }
        let colorVal;
        switch (colorValueType) {
            default:
            case 'priority':
                if (!f_props["priority"] || maxPriority < 0) {
                    return 'cyan';
                }
                colorVal = Math.max(Math.min((f_props['adj_priority'] / maxPriority), 1), 0);
                break;
            case 'inc_fac':
                colorVal = Math.max(Math.min((f_props["inc_fac"] / maxIncidentFac), 1), 0);
                break;
            case 'detour_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);// * detourWeight;
                break;
            case 'nat_imp_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);// * nationalImpWeight;
                break;
            case 'si_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);// * severityIndexWeight;
                break;
            case 'growth_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);// * growthWeight;
                break;
            case 'seasonal_fac':
                colorVal = Math.max(Math.min(f_props[colorValueType], 1), 0);// * seasonalWeight;
                break;
        }

        if (colorScale === "RdYlGn") {
            return d3.interpolateRdYlGn(1 - colorVal);
        } else if (colorScale === "Blues") {
            return d3.interpolateBlues(colorVal);
        } else if (colorScale === "Viridis") {
            return d3.interpolateViridis(colorVal);
        } else if (colorScale === "Greyscale") {
            return d3.interpolateGreys(colorVal);
        } else {
            return d3.interpolateReds(colorVal);
        }
    }, [colorScale, colorValueType, maxIncidentFac, maxPriority]);

    // function styleRoadway(feature, isReset) {
    //     let wt = 2;
    //     return {
    //         color: getColorByProp(feature.properties, isReset),
    //         weight: wt
    //     };
    // }

    const styleRoadway = useCallback((feature, isReset) => {
        let wt = 2;
        return {
            color: getColorByProp(feature.properties, isReset),
            weight: wt
        };
    }, [getColorByProp])

    function highlightFeature(e) {
        const layer = e;
        layer.setStyle({
            weight: 10
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // function handleLegendColorChange() {
    //     console.log("handling legend color change select")
    //     console.log(document.getElementById("legend-gradient-select").value);
    //     let selectedColorScale = document.getElementById("legend-gradient-select").value;
    //     updateLegendGradientBarColor(selectedColorScale);
    //     setColorScale(selectedColorScale);
    //     setUpdateColors(true);
    // }

    const handleLegendColorChange = useCallback(() => {
        console.log("handling legend color change select")
        console.log(document.getElementById("legend-gradient-select").value);
        let selectedColorScale = document.getElementById("legend-gradient-select").value;
        updateLegendGradientBarColor(selectedColorScale);
        setColorScale(selectedColorScale);
        setUpdateColors(true);
    }, []);

    function updateLegendGradientBarColor(colorScale) {
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

    function handleVisualizationMetricChange() {
        console.log("Metric change triggered");
        console.log(document.getElementById('legend-metric-select').value);
        let selValueType = document.getElementById('legend-metric-select').value;
        setColorValueType(selValueType);
        if (selValueType !== 'priority') {
            document.getElementById("legend-max-label").innerHTML = "1.0"
        }
        setUpdateColors(true);
    }

    const updateInfo = useCallback(() => {
        if (hoverLayer) {
            let hasAllScores = true;
            let incidentFactorVal = 1.0;
            if (hoverLayer.feature.properties["inc_fac"]) {
                incidentFactorVal = ensureNumber(hoverLayer.feature.properties["inc_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let detourFactorVal = 0.0;
            if (hoverLayer.feature.properties["detour_fac"]) {
                detourFactorVal = ensureNumber(hoverLayer.feature.properties["detour_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let nationalImpFactorVal = 0.0;
            if (hoverLayer.feature.properties["nat_imp_cat"]) {
                nationalImpFactorVal = ensureNumber(hoverLayer.feature.properties["nat_imp_fac"], parseInt);
            }
            let severityIndexFactorVal = 0.0;
            if (hoverLayer.feature.properties["si_fac"]) {
                severityIndexFactorVal = ensureNumber(hoverLayer.feature.properties["si_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let growthFactorVal = 1.0;
            if (hoverLayer.feature.properties["growth_fac"]) {
                growthFactorVal = ensureNumber(hoverLayer.feature.properties["growth_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }
            let seasonalFactorVal = 1.0;
            if (hoverLayer.feature.properties["seasonal_fac"]) {
                seasonalFactorVal = ensureNumber(hoverLayer.feature.properties["seasonal_fac"], parseFloat);
            } else {
                hasAllScores = false;
            }

            mapInfoDiv._div.innerHTML = '<h4>Segment Info</h4>';
            mapInfoDiv._div.innerHTML += '<br /><b>Route ID: </b> ' + hoverLayer.feature.properties["route_id"];
            mapInfoDiv._div.innerHTML += '<br /><b>Functional Class: </b> ' + hoverLayer.feature.properties["route_class"];
            mapInfoDiv._div.innerHTML += '<br /><b>Route Number: </b> ' + hoverLayer.feature.properties["route_no"];
            mapInfoDiv._div.innerHTML += '<br /><b>AADT (2018): </b> ' + ensureNumber(hoverLayer.feature.properties["aadt_2018"], parseInt).toLocaleString();
            mapInfoDiv._div.innerHTML += '<br />';
            if (hasAllScores) {
                let tableStr =  '<table><thead><tr><th>Factor</th><th>Adjusted</th><th>Raw</th></tr></thead>';
                tableStr += '<tbody>';
                tableStr += '<tr><td>Priority</td><td>' + hoverLayer.feature.properties['adj_priority'].toFixed(2) +'</td><td>' + hoverLayer.feature.properties['priority'].toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Detour</td><td> </td><td>' + detourFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>National Importance</td><td> </td><td>' + nationalImpFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Severity Index</td><td> </td><td>' + severityIndexFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Growth</td><td> </td><td>' + growthFactorVal.toFixed(2) +'</td></tr>';
                tableStr += '<tr><td>Seasonal</td><td> </td><td>' + seasonalFactorVal.toFixed(2) + '</td></tr>';
                tableStr+= '</tbody></table>';
                mapInfoDiv._div.innerHTML += tableStr;
            }
        } else {
            mapInfoDiv._div.innerHTML = '<h4>Segment Info</h4>' +
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
    }, [hoverLayer, mapInfoDiv]);

    const resetHighlight = useCallback((e) => {
        if (e) {
            // const layer = e;
            // e.setStyle(styleRoadway(e.feature, true));
            e.setStyle({weight: 2});
        }
    }, []);

    const handleFeatureMouseout = useCallback((e) => {
        setHoverLayer(null);
        resetHighlight(e.target);
    }, [resetHighlight])
    
    const createBinsFromData = useCallback((dataList, adjDataList) => {
        const bins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        console.log("createBinsCalled");
        let ub = 1;
        let currBinCount = 0;
        let dataMap = {};
        for (let pIdx = 0; pIdx < dataList.length; pIdx++) {
            if (dataList[pIdx] > bins[ub]) {
                if (ub === bins.length -1) {
                    currBinCount++;
                }
                dataMap[(bins[ub-1]+'-'+bins[ub])] = {raw:currBinCount};
                currBinCount = 0;
                ub++;
            } else {
                currBinCount++;
            }
        }
        dataMap[bins[bins.length-1]+'+'] = {raw:currBinCount};

        ub = 1;
        currBinCount = 0;
        for (let pIdx = 0; pIdx < adjDataList.length; pIdx++) {
            if (adjDataList[pIdx] > bins[ub]) {
                if (ub === bins.length -1) {
                    currBinCount++;
                }
                dataMap[(bins[ub-1]+'-'+bins[ub])]['adj'] = currBinCount;
                currBinCount = 0;
                ub++;
            } else {
                currBinCount++;
            }
        }
        dataMap[bins[bins.length-1]+'+']['adj'] = currBinCount;

        let pdfData = [];
        for (let bi = 1; bi < bins.length; bi++) {
            let binStr = (bins[bi-1]+'-'+bins[bi]);
            pdfData.push({
                bin: binStr,
                "Base Priority": dataMap[binStr]['raw'],
                "Adj Priority": dataMap[binStr]['adj']
            })
        }
        let binStr = bins[bins.length-1]+'+';
        pdfData.push({bin: binStr, "Base Priority": dataMap[binStr]['raw'], "Adj Priority": dataMap[binStr]['adj'] });
        console.log(pdfData);
        return pdfData;
    }, []);

    const updateChart = useCallback(() => {
        console.log("Chart to be updated");
    }, [])

    useEffect(() => {
        if (!mapComponent) {
            // create map
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
                maxZoom: 16
            });

            var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            });

            let map = L.map('map-sp', {
                center: props.mapCenter,
                zoom: 7,
                layers: [Esri_WorldGrayCanvas]
            });
            // Create base maps object for layer control
            let baseMaps = {
                "OpenStreetMaps": osmLayer,
                "Greyscale": Esri_WorldGrayCanvas,
                "Dark": Stadia_AlidadeSmoothDark,
                "Google Satellite": googleSat,
                "Google Hybrid": googleHybrid,
            };

            let segData = L.geoJson(props.primaryLayer, {
                style: styleRoadway,
                onEachFeature: function (feature, layer) {
                    // feature.properties['priority'] = computePriorityScore(feature.properties, false)
                    layer.on('click', handleClick);
                    layer.on('mouseover', handleFeatureMouseover);
                    layer.on('mouseout', handleFeatureMouseout);
                }
            }).addTo(map);
            console.log(segData)
            // Set Up click and hover (mouseover/mouseout) events for the roadway segments
            const layerKeys = Object.keys(segData._layers);
            let priorityList = [];
            let adjPriorityList = [];
            for (const key of layerKeys) {
                segData._layers[key].feature.properties['priority'] = computePriorityScore(segData._layers[key].feature.properties, false)
                segData._layers[key].feature.properties['adj_priority'] = computePriorityScore(segData._layers[key].feature.properties, true)
                priorityList.push(segData._layers[key].feature.properties['priority']);
                adjPriorityList.push(segData._layers[key].feature.properties['adj_priority'])
            //     segData._layers[key].on('click', handleClick);
            //     segData._layers[key].on('mouseover', handleFeatureMouseover);
            //     segData._layers[key].on('mouseout', handleFeatureMouseout);
            }
            priorityList.sort(function(a, b) { return a - b });
            adjPriorityList.sort(function(a, b) { return a - b });
            let index50 = Math.ceil(priorityList.length * 0.5)
            console.log('50th Priority: ' + priorityList[index50]);
            let index85 = Math.ceil(priorityList.length * 0.85)
            console.log('85th Priority: ' + priorityList[index85]);
            let index90 = Math.ceil(priorityList.length * 0.9)
            console.log('90th Priority: ' + priorityList[index90]);
            let priorityThreshold = priorityList[index85];
            let pdfData = createBinsFromData(priorityList, adjPriorityList);
            setHistData(pdfData);
            // let pdfData = [
            //     { quarter: 1, earnings: 13000 },
            //     { quarter: 2, earnings: 16500 },
            //     { quarter: 3, earnings: 14250 },
            //     { quarter: 4, earnings: 19000 }
            // ];


            // Create overlay layers object for layer cotnrol
            let roadwayLabel = props.primaryLayerName || "Roadway Data"
            let overlayLayers = {};
            overlayLayers[roadwayLabel]=segData;

            // Create the layer control and add to bottom left of map
            L.control.layers(baseMaps, overlayLayers, {position: "bottomleft"}).addTo(map);

            // Add hover info div to top-right corner
            const infoDiv = L.control({position: 'topright'});
            infoDiv.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info info-opaque');
                return this._div;
            };
            infoDiv.addTo(map);

            const legendDiv = L.control({position: 'bottomright'})
            legendDiv.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info info-opaque')
                let metricSelectDiv = document.createElement('select');
                metricSelectDiv.id = "legend-metric-select";
                metricSelectDiv.add(createOption('Priority', 'priority', true));
                metricSelectDiv.add(createOption('Incident Factor', 'inc_fac', false));
                metricSelectDiv.add(createOption('Detour Factor', 'detour_fac', false));
                metricSelectDiv.add(createOption('National Importance Factor', 'nat_imp_fac', false));
                metricSelectDiv.add(createOption('Severity Index Factor', 'si_fac', false));
                metricSelectDiv.add(createOption('Growth Factor', 'growth_fac', false));
                metricSelectDiv.add(createOption('Seasonal Factor', 'seasonal_fac', false));
                metricSelectDiv.onchange = function() {handleVisualizationMetricChange()};
                metricSelectDiv.style.width = "100%";
                let gradientSelectDiv = document.createElement('select');
                gradientSelectDiv.id = "legend-gradient-select";
                gradientSelectDiv.add(createOption('Viridis', 'Viridis', true));
                gradientSelectDiv.add(createOption('RdYlGn', 'RdYlGn', false));
                gradientSelectDiv.add(createOption('Blues', 'Blues', false));
                gradientSelectDiv.add(createOption('Reds', 'Reds', false));
                gradientSelectDiv.add(createOption('Greyscale', 'Greyscale', false));
                gradientSelectDiv.onchange = function() {handleLegendColorChange()};
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
                maxLabel.id="legend-max-label";
                let maxRangeVal = 1.0;
                switch (colorValueType) {
                    case "priority":
                        maxRangeVal = maxPriority;
                        break;
                    default:
                    case "detour_fac":
                    case "nat_imp_fac":
                    case "si_fac":
                    case "growth_fac":
                    case "seasonal_fac":
                        maxRangeVal = 1.0;
                        break;
                }
                maxLabel.innerHTML = maxRangeVal.toFixed(1);
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
            // legendDiv.handleLegendColorChange = handleLegendColorChange;
            // legendDiv.handleMetricChange = handleVisualizationMetricChange;
            legendDiv.addTo(map);
            updateLegendGradientBarColor(colorScale);

            // Fit the maps bounds ot the roadway segments layer
            map.fitBounds(segData.getBounds());

            setPrimaryLayer(segData);
            setMaxPriority(priorityThreshold);
            setMapInfoDiv(infoDiv);
            setUpdateColors(true);
            setMapComponent(map);
        }
    }, [colorScale, colorValueType, computePriorityScore, createBinsFromData, handleFeatureMouseout, handleLegendColorChange, mapComponent, maxPriority, props.mapCenter, props.primaryLayer, props.primaryLayerName, styleRoadway]);

    useEffect(() => {
        console.log("Max Priority Set to: " + maxPriority);
        if (colorValueType === 'priority') {
            let maxLabelDiv = document.getElementById('legend-max-label');
            if (maxLabelDiv) {
                maxLabelDiv.innerHTML = maxPriority.toFixed(1);
            }
        }
    }, [colorValueType, maxPriority])

    useEffect(() => {
        if (mapInfoDiv) {
            updateInfo();
        }
    }, [updateInfo, mapInfoDiv])

    useEffect(() => {
        console.log("updateColors effect called");
        if (updateColors && primaryLayer !== null) {
            console.log("Update Colors: " + updateColors);
            const layerKeys = Object.keys(primaryLayer._layers);
            let priorityList = [];
            let adjPriorityList = [];
            for (const key of layerKeys) {
                primaryLayer._layers[key].feature.properties['adj_priority'] = computePriorityScore(primaryLayer._layers[key].feature.properties, true);
                priorityList.push(primaryLayer._layers[key].feature.properties['priority']);
                adjPriorityList.push(primaryLayer._layers[key].feature.properties['adj_priority']);
            }

            priorityList.sort(function(a, b) { return a - b });
            adjPriorityList.sort(function(a, b) { return a - b });
            let pdfData = createBinsFromData(priorityList, adjPriorityList);
            setHistData(pdfData);
            let index85 = Math.ceil(priorityList.length * 0.85)
            let priorityThreshold = adjPriorityList[index85];
            setMaxPriority(priorityThreshold);
            primaryLayer.eachLayer(function (layer) {
                layer.setStyle(styleRoadway(layer.feature));
            });
            setUpdateColors(false);
        }
    }, [computePriorityScore, createBinsFromData, primaryLayer, styleRoadway, updateChart, updateColors]);

    useEffect(() => {
        console.log("Prority Threshold Set: " + maxPriority.toFixed(2));
    }, [maxPriority]);

    useEffect(() => {
        if (mapInfoDiv) {
            updateInfo();
        }
        if (hoverLayer) {
            highlightFeature(hoverLayer)
        } else {
            resetHighlight(hoverLayer);
        }
    }, [updateInfo, mapInfoDiv, hoverLayer, resetHighlight]);

    return (
        <div style={{height: "100%"}}>
            <div style={{width: "100%", height: "100%", display: "inline-flex"}}>
                <div style={{width: "66%", height: "100%"}}>
                    <Paper className='card' style={{height: '100%', marginTop: "10px"}}>
                        <div className='map-wrapper' style={{width: '100%', height: '100%', position: 'relative'}}>
                            <div id="map-sp" />
                        </div>
                    </Paper>
                </div>
                <div style={{width: "34%", height: "100%", paddingLeft: "5px", paddingRight: "5px"}}>
                    <div style={{width: "100%", height: "50%"}}>
                        <Paper className='card' style={{height: '100%', marginTop: "10px", padding: "10px", overflow: "auto"}}>
                            <Typography variant={"h5"}>Factor Weighting Adjustments</Typography>
                            Use the following sliders and/or numeric inputs to specify different weights for the six factors.
                            <div>
                                <CustomSliderInput
                                    id="input-slider-alpha"
                                    label="Alpha"
                                    value={alpha}
                                    step={1}
                                    min={1}
                                    max={maxAlphaWeight}
                                    funcHandleSlide={handleAlphaChange}
                                    funcSliderChangeCommit={handleAlphaChangeCommit}
                                    funcInputChange={handleAlphaInputChange}
                                    funcBlur={handleAlphaBlur}
                                    showInput={true}
                                />
                                <CustomSliderInput
                                    id="input-slider-detour"
                                    label="Detour Factor"
                                    value={detourWeight}
                                    step={weightFactorStep}
                                    min={weightFactorMin}
                                    max={maxDetourWeight}
                                    funcHandleSlide={handleDetourChange}
                                    funcSliderChangeCommit={handleDetourChangeCommit}
                                    funcInputChange={handleDetourInputChange}
                                    funcBlur={handleDetourBlur}
                                    showInput={false}
                                    percentStr={(100.0 * detourWeight / (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight)).toFixed(1) + "%"}
                                />
                                <CustomSliderInput
                                    id="input-slider-national-importance"
                                    label="Nat. Imp. Factor"
                                    value={nationalImpWeight}
                                    step={weightFactorStep}
                                    min={weightFactorMin}
                                    max={maxNationalImpWeight}
                                    funcHandleSlide={handleNationalImpChange}
                                    funcSliderChangeCommit={handleNationalImpChangeCommit}
                                    funcInputChange={handleNationalImpInputChange}
                                    funcBlur={handleNationalImpBlur}
                                    showInput={false}
                                    percentStr={(100.0 * nationalImpWeight / (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight)).toFixed(1) + "%"}
                                />
                                <CustomSliderInput
                                    id="input-slider-severity-index"
                                    label="Severity Index Factor"
                                    value={severityIndexWeight}
                                    step={weightFactorStep}
                                    min={weightFactorMin}
                                    max={maxSeverityIndexWeight}
                                    funcHandleSlide={handleSeverityIndexChange}
                                    funcSliderChangeCommit={handleSeverityIndexChangeCommit}
                                    funcInputChange={handleSeverityIndexInputChange}
                                    funcBlur={handleSeverityIndexBlur}
                                    showInput={false}
                                    percentStr={(100.0 * severityIndexWeight / (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight)).toFixed(1) + "%"}
                                />
                                <CustomSliderInput
                                    id="input-slider-growth"
                                    label="Growth Factor"
                                    value={growthWeight}
                                    step={weightFactorStep}
                                    min={weightFactorMin}
                                    max={maxGrowthWeight}
                                    funcHandleSlide={handleGrowthChange}
                                    funcSliderChangeCommit={handleGrowthChangeCommit}
                                    funcInputChange={handleGrowthInputChange}
                                    funcBlur={handleGrowthBlur}
                                    showInput={false}
                                    percentStr={(100.0 * growthWeight / (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight)).toFixed(1) + "%"}
                                />
                                <CustomSliderInput
                                    id="input-slider-seasonal"
                                    label="Seasonal Factor"
                                    value={seasonalWeight}
                                    step={weightFactorStep}
                                    min={weightFactorMin}
                                    max={maxSeasonalWeight}
                                    funcHandleSlide={handleSeasonalChange}
                                    funcSliderChangeCommit={handleSeasonalChangeCommit}
                                    funcInputChange={handleSeasonalInputChange}
                                    funcBlur={handleSeasonalBlur}
                                    showInput={false}
                                    percentStr={(100.0 * seasonalWeight / (detourWeight + nationalImpWeight + severityIndexWeight + growthWeight + seasonalWeight)).toFixed(1) + "%"}
                                />
                            </div>
                        </Paper>
                    </div>
                    <div style={{width: "100%", height: "calc(50% - 5px)"}}>
                        <Paper className='card' style={{height: '100%', marginTop: "5px", padding: "10px", overflow: "auto"}}>
                            <Typography variant="caption" style={{height:"16pt"}}>Probability Distribution Function</Typography>
                            <div style={{height: "calc(100% - 16pt)"}}>
                                {histData &&
                                <ResponsiveBar
                                    data={histData}
                                    keys={['Base Priority', 'Adj Priority']}
                                    indexBy="bin"
                                    groupMode="grouped"
                                    enableLabel={false}
                                    margin={{top: 5, right: 20, bottom: 75, left: 55}}
                                    colors={[kaiTheme.ncdot_blue, kaiTheme.ncdot_red]}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 50,
                                        legend: 'Bin',
                                        legendPosition: 'middle',
                                        legendOffset: 42
                                    }}
                                    axisLeft={{
                                        tickSize: 5,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        legend: 'Count',
                                        legendPosition: 'middle',
                                        legendOffset: -50
                                    }}
                                    legends={[
                                        {
                                            dataFrom: 'keys',
                                            anchor: 'bottom',
                                            direction: 'row',
                                            justify: false,
                                            translateX: 0,
                                            translateY: 75,
                                            itemsSpacing: 2,
                                            itemWidth: 100,
                                            itemHeight: 20,
                                            itemDirection: 'left-to-right',
                                            itemOpacity: 1.0,
                                            symbolSize: 20,
                                            effects: [
                                                {
                                                    on: 'hover',
                                                    style: {
                                                        itemOpacity: 0.85
                                                    }
                                                }
                                            ]
                                        }
                                    ]}
                                />
                                }
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
            {/*<div style={{height: "calc(35% - 5px)", width: "100%", paddingTop: "5px"}}>*/}
            {/*    <Paper style={{*/}
            {/*        height: 'calc(100% - 10px)',*/}
            {/*        marginTop: "5px",*/}
            {/*        marginBottom: "10px",*/}
            {/*        overflow: "auto"*/}
            {/*    }}>*/}
            {/*        <BasisPaginationGrid*/}
            {/*            tableData={props.primaryLayer}*/}
            {/*        />*/}
            {/*    </Paper>*/}
            {/*</div>*/}
        </div>
    )
}