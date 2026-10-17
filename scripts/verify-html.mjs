async function main() {
  const html = await fetch('http://localhost:3000/submit/kalimantan-clean-water').then(r => r.text());
  const nestedA = html.match(/<a[^>]*>[^<]*<a/g);
  console.log('Nested <a> tags:', nestedA);

  const submitMatch = html.match(/<a[^>]*href="\/submit[^"]*"[^>]*>/);
  console.log('Submit button tag:', submitMatch ? submitMatch[0] : 'None');

  const questsMatch = html.match(/<a[^>]*href="\/campaigns"[^>]*>/);
  console.log('Quests button tag:', questsMatch ? questsMatch[0] : 'None');
}
main().catch(console.error);
