import React, { useMemo } from "react";
import * as d3 from "d3";
import * as d3geo from "d3-geo";
import Tooltip from "./Tooltip";
import mapData from "./../../assets/geodata/mapData.json";

function Map({ statistics }) {
  const projection = d3geo
    .geoConicConformal()
    .scale(300)
    .center([54, 44])
    .rotate([-105, 0]);

  const path = d3geo.geoPath().projection(projection);

  var colorScale = d3.scaleLinear([0, 13, 25], ["green", "orange", "red"]);

  const mapElements = useMemo(() => {
    return mapData.features.map((d) => {
      const relevantStatistics = statistics.filter(
        (item) => item.name === d.properties.name
      )[0];
      console.info(relevantStatistics);
      const color = relevantStatistics
        ? colorScale(relevantStatistics?.value)
        : "lightgrey";
      return (
        <>
          <path
            key={d.properties.name}
            name={d.properties.name}
            d={path(d)}
            fill={color}
            stroke="#0e1724"
            strokeWidth="0.5"
            strokeOpacity="0.5"
            opacity="0.9"
            onMouseEnter={(e) => {
              d3.select(e.target).attr("opacity", 1);
            }}
            onMouseOut={(e) => {
              d3.select(e.target).attr("opacity", 0.9);
            }}
          />
        </>
      );
    });
  }, [mapData, statistics]);

  return (
    <svg className="map">
      <g className="map">{mapElements}</g>
    </svg>
  );
}

export default Map;
