import React, { useMemo } from "react";
import { select } from "d3";
import * as d3 from "d3-geo";
import Tooltip from "./Tooltip";
function Map({ mapData }) {
  const projection = d3
    .geoConicConformal()
    .scale(300)
    .center([54, 44])
    .rotate([-105, 0]);

  const path = d3.geoPath().projection(projection);

  const mapElements = useMemo(() => {
    return mapData.features.map((d) => {
      return (
        <>
          <path
            key={d.properties.Name}
            name={d.properties.Name}
            d={path(d)}
            fill="#eee"
            stroke="#0e1724"
            strokeWidth="0.5"
            strokeOpacity="0.5"
            onMouseEnter={(e) => {
              select(e.target).attr("fill", "#969AFF");
            }}
            onMouseOut={(e) => {
              select(e.target).attr("fill", "#f4f3ee");
            }}
          />
        </>
      );
    });
  }, [mapData]);

  return (
    <svg className="map">
      <g className="map">{mapElements}</g>
    </svg>
  );
}

export default Map;
