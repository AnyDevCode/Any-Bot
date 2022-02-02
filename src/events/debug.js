const colors = require('colors');

module.exports = (client, info) => {
  //Check info
  if (!info) return;
  if (info.includes('[VOICE]') || info.includes('[VOICE_STATE_UPDATE]') || info.includes('[VOICE_SERVER_UPDATE]') || info.includes('VOICE') || info.includes('Sending a heartbeat.')) return;
  if (info.includes("Heartbeat acknowledged, latency of")){
    let latency = info.split("Heartbeat acknowledged, latency of ")[1].split("ms")[0];
    if((latency < 1000) && (latency > 500)) {
      return client.logger.debug(`[PING] ${colors.green(latency)}ms`);
    } else
    if((latency >= 1000) && (latency < 5000)) {
      return client.logger.debug(`[PING] ${colors.yellow(latency)}ms`);
    } else
    if(latency >= 5000) {
      return client.logger.debug(`[PING] ${colors.red(latency)}ms`);
    } else return
  }
  client.logger.debug(info);

};

