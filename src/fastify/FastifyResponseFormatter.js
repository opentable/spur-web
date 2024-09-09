const format = function (reply, map) {
  const [contentFormat] = reply.request.headers['accept'].match(/\b(json|html)\b/) ?? ['text'];

  const formatMethod = map[contentFormat];
  if (formatMethod) {
    return formatMethod();
  }

  throw new Error(`Format method not found: '${contentFormat}'`);
};

module.exports = { format };
