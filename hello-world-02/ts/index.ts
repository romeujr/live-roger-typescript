async function main(): Promise<void> {
    console.log('Meu primeiro programa em TypeScript em NodeJs!');

    for (let x = 1; x <= 10; x++) {
      console.log();
      console.log(`Tabuada do ${x}:`);
      for (let y = 1; y <= 10; y++) {
        const value = x * y;
        console.log(`  ${x} * ${y} = ${value}`);
      }
    }
}

main().catch((e) => {
    throw e;
});