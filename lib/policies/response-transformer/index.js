const transformObject = require('../request-transformer/transform-object');

module.exports = {
  schema: {
    ...require('../request-transformer/schema'),
    $id: 'http://express-gateway.io/schemas/policies/response-transformer.json'
  },
  policy: params => {
    return (req, res, next) => {
      if (params.body) {
        const _write = res.write;
        res.write = (data) => {
          try {
            const originalBody = JSON.parse(data);
            req.egContext.res.body = originalBody;
            const newBody = transformObject(params.body, req.egContext, originalBody);
            const bodyData = JSON.stringify(newBody);

            res.setHeader('Content-Length', Buffer.byteLength(bodyData));
            _write.call(res, bodyData);
          } catch (e) {
            _write.call(res, data);
          }
        };
      }

      if (params.headers) {
        const _writeHead = res.writeHead;

        res.writeHead = (statusCode, statusMessage, headers) => {
          res._headers = transformObject(params.headers, req.egContext, res.getHeaders());
          return _writeHead.call(res, statusCode, statusMessage, headers);
        };
      }
      next();
    };
  }
};
