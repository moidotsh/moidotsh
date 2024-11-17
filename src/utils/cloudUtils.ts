// src/utils/cloudUtils.ts

export function generateSoftCloudPath() {
  const points: string[] = [];
  const centerY = 25 + Math.random() * 10;
  const width = 80 + Math.random() * 40;
  const height = 30 + Math.random() * 20;

  // Start from left side with a gentle curve
  points.push(`M 10 ${centerY}`);

  // Generate 4-6 control points for the top curve
  const numPoints = 4 + Math.floor(Math.random() * 3);
  let prevX = 10;
  let prevY = centerY;

  for (let i = 0; i < numPoints; i++) {
    const nextX = prevX + (width - 10) / (numPoints - 1);
    const nextY = centerY - height / 2 + Math.random() * height;

    // Create smooth curve between points
    const cp1x = prevX + (nextX - prevX) * (0.3 + Math.random() * 0.2);
    const cp1y = prevY + (nextY - prevY) * (Math.random() - 0.5) * 0.8;
    const cp2x = nextX - (nextX - prevX) * (0.3 + Math.random() * 0.2);
    const cp2y = nextY + (prevY - nextY) * (Math.random() - 0.5) * 0.8;

    points.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${nextX} ${nextY}`);

    prevX = nextX;
    prevY = nextY;
  }

  // Close the path with a gentle bottom curve
  points.push(
    `C ${width + 10} ${prevY} ${width} ${centerY + height / 4} ${width - 10} ${centerY + height / 3}`,
  );
  points.push(
    `C ${width / 2} ${centerY + height / 2} ${width / 4} ${centerY + height / 3} 10 ${centerY}`,
  );

  return points.join(" ");
}

export interface CloudLayer {
  path: string;
  transform: string;
  opacity: number;
}

export function generateCloudLayers(): CloudLayer[] {
  const basePath = generateSoftCloudPath();
  const numLayers = 2 + Math.floor(Math.random() * 2);
  const layers = [];

  for (let i = 0; i < numLayers; i++) {
    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 10;
    const scale = 0.95 + Math.random() * 0.1;

    layers.push({
      path: basePath,
      transform: `translate(${offsetX} ${offsetY}) scale(${scale})`,
      opacity: 0.4 + Math.random() * 0.3,
    });
  }

  return layers;
}
