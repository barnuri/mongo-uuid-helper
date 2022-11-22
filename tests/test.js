if(BinData(3, 'S9p5wcj6SU63EGzCr72b0w==').toCSUUID().toBinData().toHex() != BinData(3, 'S9p5wcj6SU63EGzCr72b0w==').toHex()) {
    throw new Error('toCSUUID \\ toBinData \\ toHex is broken');
}

console.log("test passed");
