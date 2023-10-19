import React, { useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import styles from "./pie-chart.module.css";
import {useYear } from "../../contexts/yearContext";


export default function PieChart({ data, onArcClick = () => {} }) {
  // const [selectedArc, setSelectedArc] = useState(null);

  const handleArcClick = (name) => {
    // setSelectedArc(name);
    onArcClick(name);
  };

  // Chart setup
  const width = 150;
  const height = width;

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

    // Add highlight for selected arc
    // if (selectedArc === arc?.data?.name) {
    //   return (
    //     <g
    //       key={i}
    //       className={styles.slice}
    //       onMouseEnter={() => {
    //         if (ref.current) {
    //           ref.current.classList.add(styles.hasHighlight);
    //         }
    //       }}
    //       onMouseLeave={() => {
    //         if (ref.current) {
    //           ref.current.classList.remove(styles.hasHighlight);
    //         }
    //       }}
    //       onClick={() => {
    //         handleArcClick(arc.data.name);
    //       }}
    //     >
    //       <path d={slicePath} fill={color} />
    //     </g>
    //   );
    // } else {}
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
          handleArcClick(arc.data.name);
        }}
      >
        <path d={slicePath} fill={color} className={styles.active} />
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
