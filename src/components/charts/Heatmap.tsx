import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useData } from '../../context/DataContext';
import { getChartData } from '../../utils/dataAnalysis';

const HeatmapComponent: React.FC = () => {
  const { data, selectedColumns, columnTypes } = useData();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || selectedColumns.length < 2) return;
    
    const [rowColumn, colColumn] = selectedColumns;
    const chartData = getChartData(data, 'heatmap', [rowColumn, colColumn], columnTypes);
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 60, right: 50, bottom: 100, left: 100 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Extract all unique x and y values
    const xValues = Array.from(new Set(chartData.map(d => d.x)));
    const yValues = Array.from(new Set(chartData.map(d => d.y)));
    
    // X scale
    const x = d3.scaleBand()
      .domain(xValues)
      .range([0, width])
      .padding(0.05);
    
    // Y scale
    const y = d3.scaleBand()
      .domain(yValues)
      .range([0, height])
      .padding(0.05);
    
    // Color scale
    const maxValue = d3.max(chartData, d => d.value) || 0;
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, maxValue]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
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
      .attr('y', height + margin.bottom - 20)
      .style('fill', '#6B7280')
      .text(colColumn);
    
    // Add Y axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 30)
      .style('fill', '#6B7280')
      .text(rowColumn);
    
    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .style('font-size', '16px')
      .style('fill', '#1F2937')
      .style('font-weight', 500)
      .text(`Heatmap of ${rowColumn} vs ${colColumn}`);
    
    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)')
      .style('font-size', '12px')
      .style('opacity', 0);
    
    // Add cells
    svg.selectAll('rect')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x) || 0)
      .attr('y', d => y(d.y) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('rx', 2)
      .attr('ry', 2)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .style('stroke', '#1F2937')
          .style('stroke-width', 2);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        
        tooltip.html(`
          <strong>${rowColumn}:</strong> ${d.y}<br/>
          <strong>${colColumn}:</strong> ${d.x}<br/>
          <strong>Count:</strong> ${d.value}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('stroke', 'none');
        
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    // Add color legend
    const legendWidth = 20;
    const legendHeight = height * 0.7;
    
    const legendScale = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain([0, maxValue]);
    
    const legendAxis = d3.axisRight()
      .scale(d3.scaleLinear()
        .domain([0, maxValue])
        .range([legendHeight, 0]))
      .ticks(5);
    
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, ${(height - legendHeight) / 2})`);
    
    // Create gradient for legend
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'color-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    
    // Add color stops to gradient
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops;
      const stopColor = legendScale(offset * maxValue);
      
      gradient.append('stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', stopColor);
    }
    
    // Add gradient rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#color-gradient)');
    
    // Add legend axis
    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll('text')
      .style('fill', '#6B7280')
      .style('font-size', '10px');
    
    // Add legend title
    legend.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .style('fill', '#6B7280')
      .style('font-size', '12px')
      .text('Count');
    
    // Clean up on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, selectedColumns, columnTypes]);
  
  if (selectedColumns.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Please select two columns for the heatmap
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default HeatmapComponent;