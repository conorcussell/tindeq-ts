const bytesArray = (n: number) => {
  const a = []
  a.unshift(n & 255)
  while (n >= 256) {
    n = n >>> 8
    a.unshift(n & 255)
  }
  return new Uint8Array(a).buffer
}

export { bytesArray }
