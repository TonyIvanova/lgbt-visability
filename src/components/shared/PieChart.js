import React, { useRef, useMemo } from "react";

import * as d3 from "d3";
import styles from "./pie-chart.module.css";
export default function PieChart({ data }) {
  const width = 150;
  const height = width;

  const colors = [
    "#00876c",
    "#51a676",
    "#88c580",
    "#c2e38c",
    "#ffff9d",
    "#fdd172",
    "#f7a258",
    "#ea714e",
    "#d43d51",
  ];

    const getScale = () => {
      const values = data.map((item) => item.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      return [min, (min + max) / 2, max];
    };

    var colorScale = d3.scaleOrdinal(d3.schemeAccent);

    const ref = useRef(null);

    const radius = width / 2;

    const pie = useMemo(() => {
      const pieGenerator = d3.pie().value((d) => d.value);
      return pieGenerator(data);
    }, [data]);

    const arcGenerator = d3.arc();

    const shapes = pie.map((arc, i) => {
      const sliceInfo = {
        innerRadius: radius * 0.6,
        outerRadius: radius,
        startAngle: arc.startAngle,
        endAngle: arc.endAngle,
      };

      const slicePath = arcGenerator(sliceInfo);

      const color = arc?.data?.value ? colorScale(arc.data.value) : "lightgrey";

      return (
        <g
          key={i}
          className={styles.slice}
          onMouseEnter={() => {
            if (ref.current) {
              ref.current.classList.add(styles.hasHighlight);
            }
          }}
          onMouseLeave={() => {
            if (ref.current) {
              ref.current.classList.remove(styles.hasHighlight);
            }
          }}
          onClick={() => {
            // console.info(arc.data.name);
            // console.info(arc.data.value);
          }}
        >
          <path d={slicePath} fill={color} />
        </g>
      );
    });

    const legend = pie.map((arc, i) => {
      return (
        <>
          <div className={styles.legendText}>
            <div
              style={{
                background: colorScale(arc.data.value),
                width: 10,
                height: 10,
                "border-radius": 10,
              }}
            ></div>
            {arc.data.name}
          </div>
        </>
      );
    });

  return (
    <div className={styles.pieChart}>
      <svg width={width} height={height} style={{ display: "inline-block" }}>
        <g
          transform={`translate(${width / 2}, ${height / 2})`}
          className={styles.container}
          ref={ref}
        >
          {shapes}
        </g>
      </svg>
      <div className={styles.legendContainer}>{legend}</div>
    </div>
  );
}
