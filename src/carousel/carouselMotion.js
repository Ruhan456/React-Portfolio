const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const perspectiveFor = (stageWidth) => clamp(stageWidth * 0.42, 380, 760);

/**
 * Places a card from its continuous distance to the centre. The centre card
 * faces the viewer; neighbours swing almost edge-on and slide to the viewport
 * edges like panels on a corridor wall, so perspective flares their outer edge.
 */
export function placeCard(offset, layout) {
  const { stageWidth, cardWidth } = layout;
  const distance = Math.abs(offset);
  const side = Math.sign(offset) || 0;
  const near = clamp(distance, 0, 1);
  const slide = 0.3 * near + 0.7 * near * near;
  const swing = 0.45 * near + 0.55 * easeInOut(near);
  const beyond = Math.max(0, distance - 1);
  const compact = stageWidth < 720;

  const edge = stageWidth / 2 + cardWidth * (compact ? 0.04 : 0.14);
  const x = side * (edge * slide + beyond * cardWidth * 1.2);
  const rotate = -side * (80 * swing + 6 * clamp(beyond, 0, 1));
  const depth = -cardWidth * (compact ? 0.5 : 0.62) * slide - beyond * cardWidth * 0.8;
  const opacity = distance <= 1.25 ? 1 : clamp(1 - (distance - 1.25) / 0.6, 0, 1);

  return {
    transform: `translate3d(${x.toFixed(2)}px, 0, ${depth.toFixed(2)}px) rotateY(${rotate.toFixed(2)}deg)`,
    opacity,
    tail: clamp((distance - 0.1) / 0.6, 0, 1),
    shade: 0.55 * easeOutCubic(near),
    side,
    zIndex: 100 - Math.round(distance * 10),
    visible: opacity > 0.001,
  };
}

export { clamp };
