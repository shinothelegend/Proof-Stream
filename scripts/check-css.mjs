async function main() {
  const html = await fetch('http://localhost:3000/submit/kalimantan-clean-water').then(r => r.text());
  const cssMatches = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)];
  for (const match of cssMatches) {
    const url = 'http://localhost:3000' + match[1];
    console.log('Fetching CSS:', url);
    const css = await fetch(url).then(r => r.text());
    console.log('Length:', css.length);
    console.log('Includes .bg-pix-accent:', css.includes('bg-pix-accent'));
    console.log('Includes .border-pix-accent:', css.includes('border-pix-accent'));
    const rules = css.match(/\.bg-pix-accent[^{]*\{[^}]*\}/g);
    console.log('Rules:', rules);
  }
}
main().catch(console.error);
