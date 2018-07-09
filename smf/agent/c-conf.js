fis.match('*.{png}', {
  useHash: false
});
// fis.media('prod2').match('*', {
//   domain: 'https://pay.99bill.com/prod/html/agent'
// });

// fis.media('prod2').match('*', {
//   domain: 'https://pay.99bill.com/prod/html/agent'
// })

fis.media('prod2').match('*', {
  domain: 'https://pay.99bill.com/stage2/html/agent'
})