module.exports = (client, info) => {
  if(info.includes('VOICE') || info.includes('[VOICE_SERVER_UPDATE]')) return;
  client.logger.debug(info);
};
