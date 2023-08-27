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

  const getScale = () => {
    const values = statistics.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min, (min + max) / 2, max];
  };

  var colorScale = d3.scaleLinear(getScale(), [
    "#F4F3EE",
    "#969AFF",
    "#242424",
  ]);

  const mapElements = useMemo(() => {
    return mapData.features.map((d) => {
      const relevantStatistics = statistics.filter(
        (item) => item.name === d.properties.name
      )[0];
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

  if (statistics) {
    return (
      <svg className="map">
        <g className="map">{mapElements}</g>
      </svg>
    );
  } else {
    return <></>;
  }
}

export default Map;
