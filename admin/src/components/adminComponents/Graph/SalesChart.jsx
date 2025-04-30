import React, { useEffect, useRef } from 'react';

const SalesChart = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - (i * height / 5);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 12; i++) {
      const x = i * width / 12;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();
    
    // Draw x-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    const xLabels = ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'];
    xLabels.forEach((label, i) => {
      const x = (i + 0.5) * width / 12;
      ctx.fillText(label, x, height - 5);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    const yLabels = ['20%', '40%', '60%', '80%', '100%'];
    yLabels.forEach((label, i) => {
      const y = height - ((i + 1) * height / 5) - 5;
      ctx.fillText(label, 30, y);
    });
    
    // Sample data points
    const dataPoints = [
      { x: 0.5 * width / 12, y: 0.2 * height },
      { x: 1.5 * width / 12, y: 0.3 * height },
      { x: 2.5 * width / 12, y: 0.45 * height },
      { x: 3.5 * width / 12, y: 0.35 * height },
      { x: 4.5 * width / 12, y: 0.5 * height },
      { x: 5.5 * width / 12, y: 0.45 * height },
      { x: 6.5 * width / 12, y: 0.9 * height },
      { x: 7.5 * width / 12, y: 0.55 * height },
      { x: 8.5 * width / 12, y: 0.45 * height },
      { x: 9.5 * width / 12, y: 0.6 * height },
      { x: 10.5 * width / 12, y: 0.5 * height },
      { x: 11.5 * width / 12, y: 0.55 * height },
    ];
    
    // Draw line chart
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, height - dataPoints[0].y);
    for (let i = 1; i < dataPoints.length; i++) {
      ctx.lineTo(dataPoints[i].x, height - dataPoints[i].y);
    }
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fill area under the line
    ctx.lineTo(dataPoints[dataPoints.length - 1].x, height);
    ctx.lineTo(dataPoints[0].x, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fill();
    
    // Draw data points
    dataPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, height - point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw peak label
    const peakPoint = dataPoints.reduce((max, point) => 
      point.y > max.y ? point : max, dataPoints[0]);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(peakPoint.x - 40, height - peakPoint.y - 30, 80, 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('64,364.77', peakPoint.x, height - peakPoint.y - 16);
    
  }, []);
  
  return (
    <div className="w-full h-64">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300} 
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

export default SalesChart;