'use strict';

const http = require('http');
const { map } = require('celia');

const response = Object.create(http.ServerResponse.prototype);
const { STATUS_CODES } = http;

module.exports = (ctx) => {
  const {
    res
  } = ctx;

  if (res.___compatible) {
    return res;
  }

  Object.assign(response, {

    locals: ctx.state,

    status(code) {
      ctx.status = code;
      return this;
    },

    links(links) {
      let link = this.get('Link') || '';
      if (link) {
        link += ', ';
      }
      return this.set('Link', link + map(links, (val, rel) => {
        return '<' + val + '>; rel="' + rel + '"';
      }).join(', '));
    },

    send(body) {
      ctx.app.handleRequest(ctx, async (ctx) => {
        ctx.body = body;
      });
      return this;
    },

    json(obj) {
      return this.send(obj);
    },

    sendStatus(statusCode) {
      const body = STATUS_CODES[statusCode] || String(statusCode);
      return this.status(statusCode).send(body);
    },

    type(type) {
      ctx.type = type;
      return this;
    },

    attachment(filename) {
      ctx.attachment(filename);
      return this;
    },

    append(field, val) {
      ctx.append(field, val);
      return this;
    },

    set() {
      ctx.set(...arguments);
      return this;
    },

    get(field) {
      return ctx.get(field);
    },

    clearCookie(name, options) {
      let opts = Object.assign({
        expires: new Date(1),
        path: '/'
      }, options);
      return this.cookie(name, '', opts);
    },

    cookie(name, value, options) {
      ctx.cookies.set(name, value, options);
      return this;
    },

    redirect(url, alt) {
      ctx.redirect(url, alt);
    }

  });

  Object.assign(response, {
    contentType: response.type,

    header: response.set
  });

  Object.setPrototypeOf(res, response);

  ['write', 'end', 'pipe'].forEach((key) => {
    const fn = res[key];
    res[key] = function () {
      ctx.respond = false;
      fn.apply(res, arguments);
    };
  });
  res.___compatible = true;

  return res;
};
