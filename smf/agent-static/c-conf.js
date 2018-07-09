fis.match('*.{png}', {
  useHash: false
});


// sandbox环境
fis.media('sandbox').match('*', {
  domain: 'https://pay.99bill.com/sandbox/html/agent-static'
})
//stage2
fis.media('st02').match('*', {
  domain: 'https://pay.99bill.com/stage2/html/agent-static'
})
// prod
fis.media('prod2').match('*', {
  domain: 'https://pay.99bill.com/prod/html/agent-static',
  deploy: fis.plugin('local-deliver', {
  		to: './_prod'
  })
})