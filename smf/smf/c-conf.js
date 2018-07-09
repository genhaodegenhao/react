fis.match('*.{png}', {
  useHash: false
});
fis.media('prod2').match('*', {
  domain: 'https://pay.99bill.com/prod/html/smf'
});

fis.media('stage2').match('*', {
  domain: 'https://pay.99bill.com/stage2/html/smf'
});

fis.media('build').match('*', {
  domain: 'https://pay.99bill.com/stage2/html/smf'
})
