export function range(
  start: number,
  stop: number,
  prefix: string,
  step_size: number = 1,
  reverse: boolean = false
): Iterable<string> {
  let array: string[] = [];

  for (let i = start; i <= stop; i += step_size) {
    array.push(prefix + i.toString());
  }

  if (reverse) array.reverse();

  return array;
}
