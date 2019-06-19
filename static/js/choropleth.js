d3.json('static/data/us-states.json').then(statesData => {

    d3.csv('static/data/year_state_av_avg.csv').then(warData => {

        warData.forEach(d => {
            statesData.features.forEach(f => {
                if(d.state === f.properties.abbr){
                    f.properties.avg = d.war
                }
            });
        });

        statesData.features.forEach(f =>{
            warData.forEach(d => {
                if(d.Year === '2015'){
                    if(d.state === f.properties.abbr){
                        f.properties.war = d.av
                        // console.log(f.properties.war);
                    }
                }
            });
        });
        //-163.3, 15.45
        //-44.47, 65.36
        var corner1 = L.latLng(15.45, -163.3),
        corner2 = L.latLng(65.36, -44.47),
        bounds = L.latLngBounds(corner1, corner2);

        const map = L.map('map', {
            maxBounds: bounds
        }).setView([37.8, -96], 4);

        L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>, <br> Created by Jonathan Randolph",
            maxZoom: 6,
            minZoom: 3,
            // bounds: bounds,
            maxBounds: map.getBounds(),
            // maxBoundsViscosity: 1,
            id: "mapbox.light",
            accessToken: MAPBOX_KEY
        }).addTo(map);

        // map.setMaxBounds(map.getBounds());


        L.geoJson(statesData).addTo(map);

        let smList = warData.map(d => d.av);

        var scale = d3.scaleLinear()
            // .range([d3.rgb(94, 16, 249), d3.rgb(214, 245, 0), d3.rgb(213, 222, 217)])
            .range(['#1b8a5a', '#fbb021', '#f68838', '#ee3e32'])
            .domain([0, 4 ,7.5]);

        function style(feature) {
            // console.log(feature.properties.av)
            return {
                fillColor: scale(feature.properties.war), //colorScale(feature.properties.av),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        var geojson;

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4> Average War Rating Per state</h4>' + (props ?
                '<b>' + props.abbr + '</b><br />' + props.war + ' War'
                : 'Hover over a state');
            
        };

        info.addTo(map);

        let legend = L.control({
            position: 'bottomright'
        });

        legend.onAdd = function (map) {
            let div = L.DomUtil.create('div', 'info legend'),
                grades = [d3.min(smList), d3.mean(smList), d3.max(smList)],
                labels = [];

                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + scale(parseInt(grades[i]) + 1) + '"></i> ' +
                        parseInt(grades[i]) + (parseInt(grades[i + 1]) ? '&ndash;' + parseInt(grades[i + 1]) + '<br>' : '+');
                }
                
            return div;
        }

        legend.addTo(map);
    });
});

