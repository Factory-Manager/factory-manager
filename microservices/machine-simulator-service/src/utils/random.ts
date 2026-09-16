export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomOutsideRange(min: number, max: number): number {
  const margin = Math.max((max - min) * 0.1, 1)
  return random(max + 0.01, max + margin)
}
