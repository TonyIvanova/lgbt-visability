import React, { useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import styles from "./pie-chart.module.css";

export function PieChart({ data, onArcClick, topicKey }) {
  // Conditional click handler based on topicKey
  const handleClick = topicKey === 'openness' ? () => { } : onArcClick;

  const handleArcClick = (name) => {
    // setSelectedArc(name);
    onArcClick(name);
  };


  // Chart setup
  const width = 150;
  const height = width;
  const radius = width / 2;
  var colorScale = d3.scaleOrdinal(d3.schemeAccent);

  // Reference to the SVG group containing the arcs for adding/removing highlight class
  const ref = useRef(null);


  // Compute the pie layout for the given data
  const pie = useMemo(() => {
    const pieGenerator = d3.pie().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  // Arc generator to create arc shapes for pie chart
  const arcGenerator = d3.arc();

  // Function to slightly alter the color
  const adjustColor = (color) => {
    return d3.color(color).darker(0.15).toString();
  }
  const assignedColors = {};

  // Create SVG shapes for each pie slice
  const shapes = pie.map((arc, i) => {
    // Define the properties for each slice
    const sliceInfo = {
      innerRadius: radius * 0.6,
      outerRadius: radius,
      startAngle: arc.startAngle,
      endAngle: arc.endAngle,
    };

    // Generate the SVG path data for the slice
    const slicePath = arcGenerator(sliceInfo);


    // Determine the fill color for the slice
    let color = arc?.data?.value ? colorScale(arc.data.value) : "lightgrey";

    // Check if this color has already been used, and adjust if necessary
    if (assignedColors[color]) {
      color = adjustColor(color);
    }
    assignedColors[color] = true; // Mark this color as used

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

    // Return SVG group for each pie slice with interaction handlers
    return (
      <g
        key={i}
        className={styles.slice}
        onClick={() => {
          handleArcClick(arc.data.name);
        }}
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

      >
        <path d={slicePath} fill={color} className={styles.active} />
      </g>
    );
  });

  const legend = pie.map((arc, i) => {
    return (
      <div className={styles.legendItem} key={i} style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            background: colorScale(arc.data.value),
            width: 10,
            height: 10,
            borderRadius: '50%',
            marginRight: '10px', // add some space between the color box and the text
          }}
        />
        <span>{arc.data.name}</span>
      </div>
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
