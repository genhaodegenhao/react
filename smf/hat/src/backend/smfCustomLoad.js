/* eslint-disable */
const smfCustomLoadOpen = (size, c) => { // smf自定义load打开
  const loadIconSize = size || '50';
  const loadIconColor = c || 'red';
  $$('#smfCustomModal').remove();
  $$('#smfCustomLoad').remove();
  const str = '<div id="smfCustomModal"></div><div id="smfCustomLoad" style="margin-left: ' + (-loadIconSize / 2) + 'px; margin-top: ' + (-loadIconSize / 2) + 'px;"><svg width=' + loadIconSize + ' height=' + loadIconSize + ' viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke=' + loadIconColor + '><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /></circle></g></svg></div>';
  $$('body').append(str);
}

const smfCustomLoadClose = () => {
  $$('#smfCustomModal').remove();
  $$('#smfCustomLoad').remove();
}

export { smfCustomLoadOpen, smfCustomLoadClose}
