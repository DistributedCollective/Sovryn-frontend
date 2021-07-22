// Pages always has `CF_PAGES` defined
console.log('Check if Cloudflare Pages', process.env);
if (!process.env.CF_PAGES) process.exit(1);
console.log('Building using Cloudflare Pages');
