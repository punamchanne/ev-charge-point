const dns = require('dns');

const srvHostname = '_mongodb._tcp.cluster0.ftf6uag.mongodb.net';

console.log(`Checking DNS SRV records for: ${srvHostname}...`);

dns.resolveSrv(srvHostname, (err, addresses) => {
  if (err) {
    console.error("❌ DNS SRV Lookup FAILED!");
    console.error("Reason:", err.code);
    console.error("This means your computer's internet provider or router is actively BLOCKING the MongoDB database connection.");
    console.error("Fix: Use Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1) on your WiFi adapter.");
  } else {
    console.log("✅ DNS SRV Lookup SUCCESS!");
    console.log("Addresses found:", addresses);
    console.log("If you still get connection errors, it means your IP Address is NOT whitelisted in MongoDB Atlas Network Access!");
  }
});
