import React from "react";
import { select } from "d3";
import * as d3 from "d3-geo";

function Map({ mapData }) {
  const rn = React.useRef(null);

  // React.useEffect(() => {
  //   const renderMap = () => {
  //     const node = rn.current;

  //     const projection = d3
  //       .geoMercator()
  //       .scale(100)
  //       .rotate([-105, 0])
  //       .center([-10, 65]);

  //     select(node).append("g").classed("regions", true);

  //     const regions = select("g").selectAll("path").data(mapData.features);

  //     regions
  //       .enter()
  //       .append("path")
  //       .classed("region", true)
  //       .attr("stroke", "red")
  //       .attr("strokeWidth", 2)
  //       .each(function (d, i) {
  //         console.info(d);
  //         console.info(i);
  //         select(this).attr("d", d3.geoPath().projection(projection));
  //       });
  //   };

  //   renderMap();
  // }, [mapData]);
  const projection = d3
    .geoConicConformal()
    .scale(450)
    .rotate([-105, 0])
    .center([-10, 65]);

  const path = d3.geoPath().projection(projection);
  return (
    <svg className="map">
      <g className="map">
        {mapData.features.map((d) => {
          return (
            <>
              {console.info(d.properties)}
              <path
                key={d.properties.Name}
                name={d.properties.Name}
                d={path(d)}
                fill="#eee"
                stroke="#0e1724"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                onMouseEnter={(e) => {
                  select(e.target).attr("fill", "#000");
                }}
                onMouseOut={(e) => {
                  select(e.target).attr("fill", "#eee");
                }}
              />
            </>
          );
        })}
      </g>
    </svg>
  );
}

export default Map;
