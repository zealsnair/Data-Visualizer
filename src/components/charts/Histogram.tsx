import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useData } from '../../context/DataContext';

const HistogramComponent: React.FC = () => {
  const { data, selectedColumns, columnTypes } = useData();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || selectedColumns.length < 1) return;
    
    const column = selectedColumns[0];
    
    if (columnTypes[column] !== 'numeric') {
      return;
    }
    
    // Extract the numeric values for the selected column
    const values = data
      .map(row => Number(row[column]))
      .filter(val => !isNaN(val));
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([Math.min(...values), Math.max(...values)])
      .range([0, width]);
    
    // Set up the histogram bins
    const histogram = d3.bin()
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(20));
    
    const bins = histogram(values);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([height, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', '#6B7280')
      .style('font-size', '12px');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#6B7280')
      .style('font-size', '12px');
    
    // Add X axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .style('fill', '#6B7280')
      .text(column);
    
    // Add Y axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('fill', '#6B7280')
      .text('Frequency');
    
    // Add the bars
    svg.selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x0 || 0))
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('height', d => height - y(d.length))
      .attr('fill', '#3B82F6')
      .attr('rx', 2)
      .attr('ry', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#2563EB');
        
        // Add tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip');
        
        const rect = tooltip.append('rect')
          .attr('fill', 'white')
          .attr('stroke', '#E5E7EB')
          .attr('rx', 4)
          .attr('ry', 4);
        
        const text = tooltip.append('text')
          .attr('x', 8)
          .attr('y', 20)
          .style('font-size', '12px')
          .style('fill', '#1F2937');
        
        text.append('tspan')
          .text(`Range: ${d.x0?.toFixed(2)} to ${d.x1?.toFixed(2)}`)
          .attr('x', 8);
        
        text.append('tspan')
          .text(`Frequency: ${d.length}`)
          .attr('x', 8)
          .attr('dy', 20);
        
        const bbox = text.node()?.getBBox();
        if (bbox) {
          rect.attr('width', bbox.width + 16)
            .attr('height', bbox.height + 16);
        }
        
        const xPos = x(d.x0 || 0);
        const yPos = y(d.length) - 60;
        
        tooltip.attr('transform', `translate(${xPos},${yPos})`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#3B82F6');
        svg.selectAll('.tooltip').remove();
      });
    
    // Add mean line
    const mean = d3.mean(values) || 0;
    svg.append('line')
      .attr('x1', x(mean))
      .attr('x2', x(mean))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#F97316')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');
    
    svg.append('text')
      .attr('x', x(mean) + 5)
      .attr('y', 15)
      .attr('text-anchor', 'start')
      .style('fill', '#F97316')
      .style('font-size', '12px')
      .text(`Mean: ${mean.toFixed(2)}`);
    
  }, [data, selectedColumns, columnTypes]);
  
  if (selectedColumns.length < 1) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Please select a numeric column
      </div>
    );
  }
  
  if (columnTypes[selectedColumns[0]] !== 'numeric') {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Histogram requires a numeric column. "{selectedColumns[0]}" is {columnTypes[selectedColumns[0]]}.
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default HistogramComponent;