export async function raf() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

export async function wait(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
