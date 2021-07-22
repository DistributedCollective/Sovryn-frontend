// Pages always has `CF_PAGES` defined
if (!process.env.CF_PAGES) process.exit(1);
console.log('Building using Cloudflare Pages');
