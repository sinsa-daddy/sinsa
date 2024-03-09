const __defProp = Object.defineProperty;
const __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
const __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? `${key}` : key, value);
  return value;
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/utils/html.js
const HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3,
};
const raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
const resolveCallback = async (
  str,
  phase,
  preserveCallbacks,
  context,
  buffer,
) => {
  const { callbacks } = str;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(
    callbacks.map(c => c({ phase, buffer, context })),
  ).then(res =>
    Promise.all(
      res
        .filter(Boolean)
        .map(str2 => resolveCallback(str2, phase, false, context, buffer)),
    ).then(() => buffer[0]),
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/context.js
const __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError(`Cannot ${msg}`);
  }
};
const __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, 'read from private field');
  return getter ? getter.call(obj) : member.get(obj);
};
const __privateAdd = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError('Cannot add the same private member more than once');
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
const __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, 'write to private field');
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
const TEXT_PLAIN = 'text/plain; charset=UTF-8';
const setHeaders = (headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
};
let _status, _executionCtx, _headers, _preparedHeaders, _res, _isFresh;
const Context = class {
  constructor(req, options) {
    this.env = {};
    this._var = {};
    this.finalized = false;
    this.error = void 0;
    __privateAdd(this, _status, 200);
    __privateAdd(this, _executionCtx, void 0);
    __privateAdd(this, _headers, void 0);
    __privateAdd(this, _preparedHeaders, void 0);
    __privateAdd(this, _res, void 0);
    __privateAdd(this, _isFresh, true);
    this.layout = void 0;
    this.renderer = content => this.html(content);
    this.notFoundHandler = () => new Response();
    this.render = (...args) => this.renderer(...args);
    this.setLayout = layout => (this.layout = layout);
    this.getLayout = () => this.layout;
    this.setRenderer = renderer => {
      this.renderer = renderer;
    };
    this.header = (name, value, options2) => {
      if (value === void 0) {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).delete(name);
        } else if (__privateGet(this, _preparedHeaders)) {
          delete __privateGet(this, _preparedHeaders)[name.toLocaleLowerCase()];
        }
        if (this.finalized) {
          this.res.headers.delete(name);
        }
        return;
      }
      if (options2?.append) {
        if (!__privateGet(this, _headers)) {
          __privateSet(this, _isFresh, false);
          __privateSet(
            this,
            _headers,
            new Headers(__privateGet(this, _preparedHeaders)),
          );
          __privateSet(this, _preparedHeaders, {});
        }
        __privateGet(this, _headers).append(name, value);
      } else if (__privateGet(this, _headers)) {
        __privateGet(this, _headers).set(name, value);
      } else {
        __privateGet(this, _preparedHeaders) ??
          __privateSet(this, _preparedHeaders, {});
        __privateGet(this, _preparedHeaders)[name.toLowerCase()] = value;
      }
      if (this.finalized) {
        if (options2?.append) {
          this.res.headers.append(name, value);
        } else {
          this.res.headers.set(name, value);
        }
      }
    };
    this.status = status => {
      __privateSet(this, _isFresh, false);
      __privateSet(this, _status, status);
    };
    this.set = (key, value) => {
      this._var ?? (this._var = {});
      this._var[key] = value;
    };
    this.get = key => {
      return this._var ? this._var[key] : void 0;
    };
    this.newResponse = (data, arg, headers) => {
      if (
        __privateGet(this, _isFresh) &&
        !headers &&
        !arg &&
        __privateGet(this, _status) === 200
      ) {
        return new Response(data, {
          headers: __privateGet(this, _preparedHeaders),
        });
      }
      if (arg && typeof arg !== 'number') {
        const headers2 = setHeaders(
          new Headers(arg.headers),
          __privateGet(this, _preparedHeaders),
        );
        return new Response(data, {
          headers: headers2,
          status: arg.status ?? __privateGet(this, _status),
        });
      }
      const status =
        typeof arg === 'number' ? arg : __privateGet(this, _status);
      __privateGet(this, _preparedHeaders) ??
        __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _headers) ??
        __privateSet(this, _headers, new Headers());
      setHeaders(
        __privateGet(this, _headers),
        __privateGet(this, _preparedHeaders),
      );
      if (__privateGet(this, _res)) {
        __privateGet(this, _res).headers.forEach((v, k) => {
          __privateGet(this, _headers)?.set(k, v);
        });
        setHeaders(
          __privateGet(this, _headers),
          __privateGet(this, _preparedHeaders),
        );
      }
      headers ?? (headers = {});
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === 'string') {
          __privateGet(this, _headers).set(k, v);
        } else {
          __privateGet(this, _headers).delete(k);
          for (const v2 of v) {
            __privateGet(this, _headers).append(k, v2);
          }
        }
      }
      return new Response(data, {
        status,
        headers: __privateGet(this, _headers),
      });
    };
    this.body = (data, arg, headers) => {
      return typeof arg === 'number'
        ? this.newResponse(data, arg, headers)
        : this.newResponse(data, arg);
    };
    this.text = (text, arg, headers) => {
      if (!__privateGet(this, _preparedHeaders)) {
        if (__privateGet(this, _isFresh) && !headers && !arg) {
          return new Response(text);
        }
        __privateSet(this, _preparedHeaders, {});
      }
      __privateGet(this, _preparedHeaders)['content-type'] = TEXT_PLAIN;
      return typeof arg === 'number'
        ? this.newResponse(text, arg, headers)
        : this.newResponse(text, arg);
    };
    this.json = (object, arg, headers) => {
      const body = JSON.stringify(object);
      __privateGet(this, _preparedHeaders) ??
        __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)['content-type'] =
        'application/json; charset=UTF-8';
      return typeof arg === 'number'
        ? this.newResponse(body, arg, headers)
        : this.newResponse(body, arg);
    };
    this.html = (html, arg, headers) => {
      __privateGet(this, _preparedHeaders) ??
        __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)['content-type'] =
        'text/html; charset=UTF-8';
      if (typeof html === 'object') {
        if (!(html instanceof Promise)) {
          html = html.toString();
        }
        if (html instanceof Promise) {
          return html
            .then(html2 =>
              resolveCallback(
                html2,
                HtmlEscapedCallbackPhase.Stringify,
                false,
                {},
              ),
            )
            .then(html2 => {
              return typeof arg === 'number'
                ? this.newResponse(html2, arg, headers)
                : this.newResponse(html2, arg);
            });
        }
      }
      return typeof arg === 'number'
        ? this.newResponse(html, arg, headers)
        : this.newResponse(html, arg);
    };
    this.redirect = (location, status = 302) => {
      __privateGet(this, _headers) ??
        __privateSet(this, _headers, new Headers());
      __privateGet(this, _headers).set('Location', location);
      return this.newResponse(null, status);
    };
    this.notFound = () => {
      return this.notFoundHandler(this);
    };
    this.req = req;
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }

  get event() {
    if (
      __privateGet(this, _executionCtx) &&
      'respondWith' in __privateGet(this, _executionCtx)
    ) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error('This context has no FetchEvent');
    }
  }

  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error('This context has no ExecutionContext');
    }
  }

  get res() {
    __privateSet(this, _isFresh, false);
    return (
      __privateGet(this, _res) ||
      __privateSet(this, _res, new Response('404 Not Found', { status: 404 }))
    );
  }

  set res(_res2) {
    __privateSet(this, _isFresh, false);
    if (__privateGet(this, _res) && _res2) {
      __privateGet(this, _res).headers.delete('content-type');
      for (const [k, v] of __privateGet(this, _res).headers.entries()) {
        if (k === 'set-cookie') {
          const cookies = __privateGet(this, _res).headers.getSetCookie();
          _res2.headers.delete('set-cookie');
          for (const cookie of cookies) {
            _res2.headers.append('set-cookie', cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }

  get var() {
    return { ...this._var };
  }
};
_status = /* @__PURE__ */ new WeakMap();
_executionCtx = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_preparedHeaders = /* @__PURE__ */ new WeakMap();
_res = /* @__PURE__ */ new WeakMap();
_isFresh = /* @__PURE__ */ new WeakMap();

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/compose.js
const compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = (i === middleware.length && next) || void 0;
      }
      if (!handler) {
        if (
          context instanceof Context &&
          context.finalized === false &&
          onNotFound
        ) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/http-exception.js
const HTTPException = class extends Error {
  constructor(status = 500, options) {
    super(options?.message);
    this.res = options?.res;
    this.status = status;
  }

  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status,
    });
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/utils/body.js
const parseBody = async (request, options = { all: false }) => {
  const headers =
    request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get('Content-Type');
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
};
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return (
    contentType.startsWith('multipart/form-data') ||
    contentType.startsWith('application/x-www-form-urlencoded')
  );
}
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith('[]');
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
};
function isArrayField(field) {
  return Array.isArray(field);
}
var appendToExistingArray = (arr, value) => {
  arr.push(value);
};
var convertToNewArray = (form, key, value) => {
  form[key] = [form[key], value];
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/utils/url.js
const splitPath = path => {
  const paths = path.split('/');
  if (paths[0] === '') {
    paths.shift();
  }
  return paths;
};
const splitRoutingPath = routePath => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = path => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
const patternCache = {};
const getPattern = label => {
  if (label === '*') {
    return '*';
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
const getPath = request => {
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : '';
};
const getQueryStrings = url => {
  const queryIndex = url.indexOf('?', 8);
  return queryIndex === -1 ? '' : `?${url.slice(queryIndex + 1)}`;
};
const getPathNoStrict = request => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === '/'
    ? result.slice(0, -1)
    : result;
};
const mergePath = (...paths) => {
  let p = '';
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === '/') {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== '/') {
      path = `/${path}`;
    }
    if (path === '/' && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== '/') {
      p = `${p}${path}`;
    }
    if (path === '/' && p === '') {
      p = '/';
    }
  }
  return p;
};
const checkOptionalParameter = path => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split('/');
  const results = [];
  let basePath = '';
  segments.forEach(segment => {
    if (segment !== '' && !/\:/.test(segment)) {
      basePath += `/${segment}`;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === '') {
          results.push('/');
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace('?', '');
        basePath += `/${optionalSegment}`;
        results.push(basePath);
      } else {
        basePath += `/${segment}`;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
const _decodeURI = value => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf('+') !== -1) {
    value = value.replace(/\+/g, ' ');
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
const _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf('&', valueIndex);
        return _decodeURI(
          url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex),
        );
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return '';
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf('?', 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf('&', keyIndex + 1);
    let valueIndex = url.indexOf('=', keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1
        ? nextKeyIndex === -1
          ? void 0
          : nextKeyIndex
        : valueIndex,
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === '') {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = '';
    } else {
      value = url.slice(
        valueIndex + 1,
        nextKeyIndex === -1 ? void 0 : nextKeyIndex,
      );
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
};
const getQueryParam = _getQueryParam;
const getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/request.js
const __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError(`Cannot ${msg}`);
  }
};
const __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, 'read from private field');
  return getter ? getter.call(obj) : member.get(obj);
};
const __privateAdd2 = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError('Cannot add the same private member more than once');
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
const __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, 'write to private field');
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
let _validatedData, _matchResult;
var HonoRequest = class {
  constructor(request, path = '/', matchResult = [[]]) {
    __privateAdd2(this, _validatedData, void 0);
    __privateAdd2(this, _matchResult, void 0);
    this.routeIndex = 0;
    this.bodyCache = {};
    this.cachedBody = key => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      if (bodyCache.arrayBuffer) {
        return (async () => {
          return await new Response(bodyCache.arrayBuffer)[key]();
        })();
      }
      return (bodyCache[key] = raw2[key]());
    };
    this.raw = request;
    this.path = path;
    __privateSet2(this, _matchResult, matchResult);
    __privateSet2(this, _validatedData, {});
  }

  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }

  getDecodedParam(key) {
    const paramKey = __privateGet2(this, _matchResult)[0][this.routeIndex][1][
      key
    ];
    const param = this.getParamValue(paramKey);
    return param
      ? /\%/.test(param)
        ? decodeURIComponent_(param)
        : param
      : void 0;
  }

  getAllDecodedParams() {
    const decoded = {};
    const keys2 = Object.keys(
      __privateGet2(this, _matchResult)[0][this.routeIndex][1],
    );
    for (const key of keys2) {
      const value = this.getParamValue(
        __privateGet2(this, _matchResult)[0][this.routeIndex][1][key],
      );
      if (value && typeof value === 'string') {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }

  getParamValue(paramKey) {
    return __privateGet2(this, _matchResult)[1]
      ? __privateGet2(this, _matchResult)[1][paramKey]
      : paramKey;
  }

  query(key) {
    return getQueryParam(this.url, key);
  }

  queries(key) {
    return getQueryParams(this.url, key);
  }

  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }

  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }

  json() {
    return this.cachedBody('json');
  }

  text() {
    return this.cachedBody('text');
  }

  arrayBuffer() {
    return this.cachedBody('arrayBuffer');
  }

  blob() {
    return this.cachedBody('blob');
  }

  formData() {
    return this.cachedBody('formData');
  }

  addValidatedData(target, data) {
    __privateGet2(this, _validatedData)[target] = data;
  }

  valid(target) {
    return __privateGet2(this, _validatedData)[target];
  }

  get url() {
    return this.raw.url;
  }

  get method() {
    return this.raw.method;
  }

  get matchedRoutes() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route);
  }

  get routePath() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route)[
      this.routeIndex
    ].path;
  }
};
_validatedData = /* @__PURE__ */ new WeakMap();
_matchResult = /* @__PURE__ */ new WeakMap();

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router.js
const METHOD_NAME_ALL = 'ALL';
const METHOD_NAME_ALL_LOWERCASE = 'all';
const METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch'];
const MESSAGE_MATCHER_IS_ALREADY_BUILT =
  'Can not add a route since the matcher is already built.';
const UnsupportedPathError = class extends Error {};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/hono-base.js
const __accessCheck3 = (obj, member, msg) => {
  if (!member.has(obj)) {
    throw TypeError(`Cannot ${msg}`);
  }
};
const __privateGet3 = (obj, member, getter) => {
  __accessCheck3(obj, member, 'read from private field');
  return getter ? getter.call(obj) : member.get(obj);
};
const __privateAdd3 = (obj, member, value) => {
  if (member.has(obj)) {
    throw TypeError('Cannot add the same private member more than once');
  }
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
const __privateSet3 = (obj, member, value, setter) => {
  __accessCheck3(obj, member, 'write to private field');
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
const COMPOSED_HANDLER = Symbol('composedHandler');
function defineDynamicClass() {
  return class {};
}
const notFoundHandler = c => {
  return c.text('404 Not Found', 404);
};
const errorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.text('Internal Server Error', 500);
};
let _path;
var _Hono = class extends defineDynamicClass() {
  constructor(options = {}) {
    super();
    this._basePath = '/';
    __privateAdd3(this, _path, '/');
    this.routes = [];
    this.notFoundHandler = notFoundHandler;
    this.errorHandler = errorHandler;
    this.onError = handler => {
      this.errorHandler = handler;
      return this;
    };
    this.notFound = handler => {
      this.notFoundHandler = handler;
      return this;
    };
    this.fetch = (request, Env, executionCtx) => {
      return this.dispatch(request, executionCtx, Env, request.method);
    };
    this.request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        if (requestInit !== void 0) {
          input = new Request(input, requestInit);
        }
        return this.fetch(input, Env, executionCtx);
      }
      input = input.toString();
      const path = /^https?:\/\//.test(input)
        ? input
        : `http://localhost${mergePath('/', input)}`;
      const req = new Request(path, requestInit);
      return this.fetch(req, Env, executionCtx);
    };
    this.fire = () => {
      addEventListener('fetch', event => {
        event.respondWith(
          this.dispatch(event.request, event, void 0, event.request.method),
        );
      });
    };
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.map(method => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === 'string') {
          __privateSet3(this, _path, args1);
        } else {
          this.addRoute(method, __privateGet3(this, _path), args1);
        }
        args.map(handler => {
          if (typeof handler !== 'string') {
            this.addRoute(method, __privateGet3(this, _path), handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      if (!method) {
        return this;
      }
      for (const p of [path].flat()) {
        __privateSet3(this, _path, p);
        for (const m of [method].flat()) {
          handlers.map(handler => {
            this.addRoute(m.toUpperCase(), __privateGet3(this, _path), handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === 'string') {
        __privateSet3(this, _path, arg1);
      } else {
        __privateSet3(this, _path, '*');
        handlers.unshift(arg1);
      }
      handlers.map(handler => {
        this.addRoute(METHOD_NAME_ALL, __privateGet3(this, _path), handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }

  clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath,
    });
    clone.routes = this.routes;
    return clone;
  }

  route(path, app2) {
    const subApp = this.basePath(path);
    if (!app2) {
      return subApp;
    }
    app2.routes.map(r => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) =>
          (await compose([], app2.errorHandler)(c, () => r.handler(c, next)))
            .res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }

  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }

  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === '/' ? 0 : mergedPath.length;
    const handler = async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {}
      const options = optionHandler
        ? optionHandler(c)
        : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL(
            (c.req.path.slice(pathPrefixLength) || '/') + queryStrings,
            c.req.url,
          ),
          c.req.raw,
        ),
        ...optionsArray,
      );
      if (res) {
        return res;
      }
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path, '*'), handler);
    return this;
  }

  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }

  matchRoute(method, path) {
    return this.router.match(method, path);
  }

  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }

  dispatch(request, executionCtx, env, method) {
    if (method === 'HEAD') {
      return (async () =>
        new Response(
          null,
          await this.dispatch(request, executionCtx, env, 'GET'),
        ))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request, path, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler,
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise
        ? res
            .then(
              resolved =>
                resolved || (c.finalized ? c.res : this.notFoundHandler(c)),
            )
            .catch(err => this.handleError(err, c))
        : res;
    }
    const composed = compose(
      matchResult[0],
      this.errorHandler,
      this.notFoundHandler,
    );
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            'Context is not finalized. You may forget returning Response object or `await next()`',
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
};
const Hono = _Hono;
_path = /* @__PURE__ */ new WeakMap();

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/reg-exp-router/node.js
const LABEL_REG_EXP_STR = '[^/]+';
const ONLY_WILDCARD_REG_EXP_STR = '.*';
const TAIL_WILDCARD_REG_EXP_STR = '(?:|/.*)';
const PATH_ERROR = Symbol();
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? (a < b ? -1 : 1) : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (
    b === ONLY_WILDCARD_REG_EXP_STR ||
    b === TAIL_WILDCARD_REG_EXP_STR
  ) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? (a < b ? -1 : 1) : b.length - a.length;
}
var Node = class {
  constructor() {
    this.children = {};
  }

  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern =
      token === '*'
        ? restTokens.length === 0
          ? ['', '', ONLY_WILDCARD_REG_EXP_STR]
          : ['', '', LABEL_REG_EXP_STR]
        : token === '/*'
        ? ['', '', TAIL_WILDCARD_REG_EXP_STR]
        : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, '(?:');
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (
          Object.keys(this.children).some(
            k =>
              k !== ONLY_WILDCARD_REG_EXP_STR &&
              k !== TAIL_WILDCARD_REG_EXP_STR,
          )
        ) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node();
        if (name !== '') {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== '') {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (
          Object.keys(this.children).some(
            k =>
              k.length > 1 &&
              k !== ONLY_WILDCARD_REG_EXP_STR &&
              k !== TAIL_WILDCARD_REG_EXP_STR,
          )
        ) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }

  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map(k => {
      const c = this.children[k];
      return (
        (typeof c.varIndex === 'number' ? `(${k})@${c.varIndex}` : k) +
        c.buildRegExpStr()
      );
    });
    if (typeof this.index === 'number') {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return '';
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return `(?:${strList.join('|')})`;
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/reg-exp-router/trie.js
const Trie = class {
  constructor() {
    this.context = { varIndex: 0 };
    this.root = new Node();
  }

  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, m => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(
      tokens,
      index,
      paramAssoc,
      this.context,
      pathErrorCheckOnly,
    );
    return paramAssoc;
  }

  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === '') {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(
      /#(\d+)|@(\d+)|\.\*\$/g,
      (_, handlerIndex, paramIndex) => {
        if (typeof handlerIndex !== 'undefined') {
          indexReplacementMap[++captureIndex] = Number(handlerIndex);
          return '$()';
        }
        if (typeof paramIndex !== 'undefined') {
          paramReplacementMap[Number(paramIndex)] = ++captureIndex;
          return '';
        }
        return '';
      },
    );
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/reg-exp-router/router.js
const emptyParam = [];
const nullMatcher = [/^$/, [], {}];
let wildcardRegExpCache = {};
function buildWildcardRegExp(path) {
  return (
    wildcardRegExpCache[path] ??
    (wildcardRegExpCache[path] = new RegExp(
      path === '*' ? '' : `^${path.replace(/\/\*/, '(?:|/.*)')}$`,
    ))
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = {};
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes
    .map(route => [!/\*|\/:/.test(route[0]), ...route])
    .sort(([isStaticA, pathA], [isStaticB, pathB]) =>
      isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length,
    );
  const staticMap = {};
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, {}]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = {};
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys2 = Object.keys(map);
      for (let k = 0, len3 = keys2.length; k < len3; k++) {
        map[keys2[k]] = paramReplacementMap[map[keys2[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
const RegExpRouter = class {
  constructor() {
    this.name = 'RegExpRouter';
    this.middleware = { [METHOD_NAME_ALL]: {} };
    this.routes = { [METHOD_NAME_ALL]: {} };
  }

  add(method, path, handler) {
    let _a;
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach(handlerMap => {
        handlerMap[method] = {};
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach(p => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === '/*') {
      path = '*';
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach(m => {
          let _a2;
          (_a2 = middleware[m])[path] ||
            (_a2[path] =
              findMiddleware(middleware[m], path) ||
              findMiddleware(middleware[METHOD_NAME_ALL], path) ||
              []);
        });
      } else {
        (_a = middleware[method])[path] ||
          (_a[path] =
            findMiddleware(middleware[method], path) ||
            findMiddleware(middleware[METHOD_NAME_ALL], path) ||
            []);
      }
      Object.keys(middleware).forEach(m => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach(p => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach(m => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            p => re.test(p) && routes[m][p].push([handler, paramCount]),
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach(m => {
        let _a2;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a2 = routes[m])[path2] ||
            (_a2[path2] = [
              ...(findMiddleware(middleware[m], path2) ||
                findMiddleware(middleware[METHOD_NAME_ALL], path2) ||
                []),
            ]);
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }

  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf('', 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }

  buildAllMatchers() {
    const matchers = {};
    [...Object.keys(this.routes), ...Object.keys(this.middleware)].forEach(
      method => {
        matchers[method] || (matchers[method] = this.buildMatcher(method));
      },
    );
    this.middleware = this.routes = void 0;
    return matchers;
  }

  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach(r => {
      const ownRoute = r[method]
        ? Object.keys(r[method]).map(path => [path, r[method][path]])
        : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute || (hasOwnRoute = true);
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map(path => [
            path,
            r[METHOD_NAME_ALL][path],
          ]),
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/smart-router/router.js
const SmartRouter = class {
  constructor(init) {
    this.name = 'SmartRouter';
    this.routers = [];
    this.routes = [];
    Object.assign(this, init);
  }

  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }

  match(method, path) {
    if (!this.routes) {
      throw new Error('Fatal error');
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach(args => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error('Fatal error');
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }

  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error('No active router has been determined yet.');
    }
    return this.routers[0];
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  constructor(method, handler, children) {
    this.order = 0;
    this.params = {};
    this.children = children || {};
    this.methods = [];
    this.name = '';
    if (method && handler) {
      const m = {};
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }

  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    const parentPatterns = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        parentPatterns.push(...curNode.patterns);
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        parentPatterns.push(...curNode.patterns);
        possibleKeys.push(pattern[1]);
      }
      parentPatterns.push(...curNode.patterns);
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = {};
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order,
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }

  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length; i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = {};
        handlerSet.possibleKeys.forEach(key => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] =
            params[key] && !processed
              ? params[key]
              : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }

  search(method, path) {
    const handlerSets = [];
    this.params = {};
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children['*']) {
              handlerSets.push(
                ...this.gHSets(nextNode.children['*'], method, node.params, {}),
              );
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, {}));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.patterns.length; k < len3; k++) {
          const pattern = node.patterns[k];
          const params = { ...node.params };
          if (pattern === '*') {
            const astNode = node.children['*'];
            if (astNode) {
              handlerSets.push(
                ...this.gHSets(astNode, method, node.params, {}),
              );
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === '') {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join('/');
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(
              ...this.gHSets(child, method, node.params, params),
            );
            continue;
          }
          if (
            matcher === true ||
            (matcher instanceof RegExp && matcher.test(part))
          ) {
            if (typeof key === 'string') {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(
                  ...this.gHSets(child, method, params, node.params),
                );
                if (child.children['*']) {
                  handlerSets.push(
                    ...this.gHSets(
                      child.children['*'],
                      method,
                      params,
                      node.params,
                    ),
                  );
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/router/trie-router/router.js
const TrieRouter = class {
  constructor() {
    this.name = 'TrieRouter';
    this.node = new Node2();
  }

  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }

  match(method, path) {
    return this.node.search(method, path);
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/hono.js
const Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router =
      options.router ??
      new SmartRouter({
        routers: [new RegExpRouter(), new TrieRouter()],
      });
  }
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/middleware/logger/index.js
const humanize = times => {
  const [delimiter, separator] = [',', '.'];
  const orderTimes = times.map(v =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`),
  );
  return orderTimes.join(separator);
};
const time = start => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? `${delta}ms` : `${Math.round(delta / 1e3)}s`]);
};
const colorStatus = status => {
  const out = {
    7: `\x1B[35m${status}\x1B[0m`,
    5: `\x1B[31m${status}\x1B[0m`,
    4: `\x1B[33m${status}\x1B[0m`,
    3: `\x1B[36m${status}\x1B[0m`,
    2: `\x1B[32m${status}\x1B[0m`,
    1: `\x1B[32m${status}\x1B[0m`,
    0: `\x1B[33m${status}\x1B[0m`,
  };
  const calculateStatus = (status / 100) | 0;
  return out[calculateStatus];
};
function log(fn, prefix, method, path, status = 0, elapsed) {
  const out =
    prefix === '<--'
      ? `  ${prefix} ${method} ${path}`
      : `  ${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}
const logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, '<--', method, path);
    const start = Date.now();
    await next();
    log(fn, '-->', method, path, c.res.status, time(start));
  };
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/utils/cookie.js
const validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
const validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
const parse = (cookie, name) => {
  const pairs = cookie.trim().split(';');
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf('=');
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (
      (name && name !== cookieName) ||
      !validCookieNameRegEx.test(cookieName)
    ) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    }
    return parsedCookie;
  }, {});
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/helper/cookie/index.js
const getCookie = (c, key) => {
  const cookie = c.req.raw.headers.get('Cookie');
  if (typeof key === 'string') {
    if (!cookie) {
      return void 0;
    }
    const obj2 = parse(cookie, key);
    return obj2[key];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/utils/buffer.js
const bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return response.formData();
};

// ../../node_modules/.pnpm/hono@4.0.10/node_modules/hono/dist/validator/validator.js
const validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header('Content-Type');
    switch (target) {
      case 'json':
        if (!contentType || !contentType.startsWith('application/json')) {
          const message = `Invalid HTTP header: Content-Type=${contentType}`;
          throw new HTTPException(400, { message });
        }
        if (c.req.bodyCache.json) {
          value = await c.req.bodyCache.json;
          break;
        }
        try {
          const arrayBuffer =
            c.req.bodyCache.arrayBuffer ?? (await c.req.raw.arrayBuffer());
          value = await new Response(arrayBuffer).json();
          c.req.bodyCache.json = value;
          c.req.bodyCache.arrayBuffer = arrayBuffer;
        } catch {
          const message = 'Malformed JSON in request body';
          throw new HTTPException(400, { message });
        }
        break;
      case 'form': {
        if (c.req.bodyCache.formData) {
          value = c.req.bodyCache.formData;
          break;
        }
        try {
          const contentType2 = c.req.header('Content-Type');
          if (contentType2) {
            const arrayBuffer =
              c.req.bodyCache.arrayBuffer ?? (await c.req.raw.arrayBuffer());
            const formData = await bufferToFormData(arrayBuffer, contentType2);
            const form = {};
            formData.forEach((value2, key) => {
              form[key] = value2;
            });
            value = form;
            c.req.bodyCache.formData = formData;
            c.req.bodyCache.arrayBuffer = arrayBuffer;
          }
        } catch (e) {
          let message = 'Malformed FormData request.';
          message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
          throw new HTTPException(400, { message });
        }
        break;
      }
      case 'query':
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          }),
        );
        break;
      case 'param':
        value = c.req.param();
        break;
      case 'header':
        value = c.req.header();
        break;
      case 'cookie':
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    await next();
  };
};

// ../../node_modules/.pnpm/@hono+zod-validator@0.2.0_hono@4.0.10_zod@3.22.4/node_modules/@hono/zod-validator/dist/esm/index.js
const zValidator = (target, schema, hook) =>
  // @ts-expect-error not typed well
  validator(target, async (value, c) => {
    const result = await schema.safeParseAsync(value);
    if (hook) {
      const hookResult = hook({ data: value, ...result }, c);
      if (hookResult) {
        if (hookResult instanceof Response || hookResult instanceof Promise) {
          return hookResult;
        }
        if ('response' in hookResult) {
          return hookResult.response;
        }
      }
    }
    if (!result.success) {
      return c.json(result, 400);
    }
    const { data } = result;
    return data;
  });

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_freeGlobal.js
const freeGlobal =
  typeof global === 'object' && global && global.Object === Object && global;
const freeGlobal_default = freeGlobal;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_root.js
const freeSelf =
  typeof self === 'object' && self && self.Object === Object && self;
const root = freeGlobal_default || freeSelf || Function('return this')();
const root_default = root;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Symbol.js
const Symbol2 = root_default.Symbol;
const Symbol_default = Symbol2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getRawTag.js
const objectProto = Object.prototype;
const { hasOwnProperty } = objectProto;
const nativeObjectToString = objectProto.toString;
const symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {}
  const result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
const getRawTag_default = getRawTag;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_objectToString.js
const objectProto2 = Object.prototype;
const nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
const objectToString_default = objectToString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetTag.js
const nullTag = '[object Null]';
const undefinedTag = '[object Undefined]';
const symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value)
    ? getRawTag_default(value)
    : objectToString_default(value);
}
const baseGetTag_default = baseGetTag;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value === 'object';
}
const isObjectLike_default = isObjectLike;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isSymbol.js
const symbolTag = '[object Symbol]';
function isSymbol(value) {
  return (
    typeof value === 'symbol' ||
    (isObjectLike_default(value) && baseGetTag_default(value) == symbolTag)
  );
}
const isSymbol_default = isSymbol;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
const arrayMap_default = arrayMap;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArray.js
const { isArray } = Array;
const isArray_default = isArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseToString.js
const INFINITY = 1 / 0;
const symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
const symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (isArray_default(value)) {
    return `${arrayMap_default(value, baseToString)}`;
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  const result = `${value}`;
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
const baseToString_default = baseToString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isObject.js
function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
const isObject_default = isObject;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
const identity_default = identity;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isFunction.js
const asyncTag = '[object AsyncFunction]';
const funcTag = '[object Function]';
const genTag = '[object GeneratorFunction]';
const proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  const tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
const isFunction_default = isFunction;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_coreJsData.js
const coreJsData = root_default['__core-js_shared__'];
const coreJsData_default = coreJsData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isMasked.js
const maskSrcKey = (function () {
  const uid = /[^.]+$/.exec(
    (coreJsData_default &&
      coreJsData_default.keys &&
      coreJsData_default.keys.IE_PROTO) ||
      '',
  );
  return uid ? `Symbol(src)_1.${uid}` : '';
})();
function isMasked(func) {
  return Boolean(maskSrcKey) && maskSrcKey in func;
}
const isMasked_default = isMasked;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toSource.js
const funcProto = Function.prototype;
const funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return `${func}`;
    } catch (e) {}
  }
  return '';
}
const toSource_default = toSource;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsNative.js
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reIsHostCtor = /^\[object .+?Constructor\]$/;
const funcProto2 = Function.prototype;
const objectProto3 = Object.prototype;
const funcToString2 = funcProto2.toString;
const hasOwnProperty2 = objectProto3.hasOwnProperty;
const reIsNative = RegExp(
  `^${funcToString2
    .call(hasOwnProperty2)
    .replace(reRegExpChar, '\\$&')
    .replace(
      /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
      '$1.*?',
    )}$`,
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  const pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
const baseIsNative_default = baseIsNative;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
const getValue_default = getValue;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  const value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
const getNative_default = getNative;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_WeakMap.js
const WeakMap2 = getNative_default(root_default, 'WeakMap');
const WeakMap_default = WeakMap2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
const apply_default = apply;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_shortOut.js
const HOT_COUNT = 800;
const HOT_SPAN = 16;
const nativeNow = Date.now;
function shortOut(func) {
  let count = 0;
  let lastCalled = 0;
  return function () {
    const stamp = nativeNow();
    const remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
const shortOut_default = shortOut;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/constant.js
function constant(value) {
  return function () {
    return value;
  };
}
const constant_default = constant;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_defineProperty.js
const defineProperty = (function () {
  try {
    const func = getNative_default(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
})();
const defineProperty_default = defineProperty;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSetToString.js
const baseSetToString = !defineProperty_default
  ? identity_default
  : function (func, string) {
      return defineProperty_default(func, 'toString', {
        configurable: true,
        enumerable: false,
        value: constant_default(string),
        writable: true,
      });
    };
const baseSetToString_default = baseSetToString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToString.js
const setToString = shortOut_default(baseSetToString_default);
const setToString_default = setToString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIndex.js
const MAX_SAFE_INTEGER = 9007199254740991;
const reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  const type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return (
    Boolean(length) &&
    (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}
const isIndex_default = isIndex;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty_default) {
    defineProperty_default(object, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
  } else {
    object[key] = value;
  }
}
const baseAssignValue_default = baseAssignValue;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}
const eq_default = eq;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assignValue.js
const objectProto4 = Object.prototype;
const hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value) {
  const objValue = object[key];
  if (
    !(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) ||
    (value === void 0 && !(key in object))
  ) {
    baseAssignValue_default(object, key, value);
  }
}
const assignValue_default = assignValue;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overRest.js
const nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function () {
    const args = arguments;
    let index = -1;
    const length = nativeMax(args.length - start, 0);
    const array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    const otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
const overRest_default = overRest;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isLength.js
const MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return (
    typeof value === 'number' &&
    value > -1 &&
    value % 1 == 0 &&
    value <= MAX_SAFE_INTEGER2
  );
}
const isLength_default = isLength;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return (
    value != null &&
    isLength_default(value.length) &&
    !isFunction_default(value)
  );
}
const isArrayLike_default = isArrayLike;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isPrototype.js
const objectProto5 = Object.prototype;
function isPrototype(value) {
  const Ctor = value && value.constructor;
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto5;
  return value === proto;
}
const isPrototype_default = isPrototype;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  let index = -1;
  const result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
const baseTimes_default = baseTimes;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsArguments.js
const argsTag = '[object Arguments]';
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
const baseIsArguments_default = baseIsArguments;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isArguments.js
const objectProto6 = Object.prototype;
const hasOwnProperty4 = objectProto6.hasOwnProperty;
const { propertyIsEnumerable } = objectProto6;
const isArguments = baseIsArguments_default(
  (function () {
    return arguments;
  })(),
)
  ? baseIsArguments_default
  : function (value) {
      return (
        isObjectLike_default(value) &&
        hasOwnProperty4.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee')
      );
    };
const isArguments_default = isArguments;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
const stubFalse_default = stubFalse;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isBuffer.js
const freeExports =
  typeof exports === 'object' && exports && !exports.nodeType && exports;
const freeModule =
  freeExports &&
  typeof module === 'object' &&
  module &&
  !module.nodeType &&
  module;
const moduleExports = freeModule && freeModule.exports === freeExports;
const Buffer2 = moduleExports ? root_default.Buffer : void 0;
const nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
const isBuffer = nativeIsBuffer || stubFalse_default;
const isBuffer_default = isBuffer;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsTypedArray.js
const argsTag2 = '[object Arguments]';
const arrayTag = '[object Array]';
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const funcTag2 = '[object Function]';
const mapTag = '[object Map]';
const numberTag = '[object Number]';
const objectTag = '[object Object]';
const regexpTag = '[object RegExp]';
const setTag = '[object Set]';
const stringTag = '[object String]';
const weakMapTag = '[object WeakMap]';
const arrayBufferTag = '[object ArrayBuffer]';
const dataViewTag = '[object DataView]';
const float32Tag = '[object Float32Array]';
const float64Tag = '[object Float64Array]';
const int8Tag = '[object Int8Array]';
const int16Tag = '[object Int16Array]';
const int32Tag = '[object Int32Array]';
const uint8Tag = '[object Uint8Array]';
const uint8ClampedTag = '[object Uint8ClampedArray]';
const uint16Tag = '[object Uint16Array]';
const uint32Tag = '[object Uint32Array]';
const typedArrayTags = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    true;
typedArrayTags[argsTag2] =
  typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] =
  typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] =
  typedArrayTags[dateTag] =
  typedArrayTags[errorTag] =
  typedArrayTags[funcTag2] =
  typedArrayTags[mapTag] =
  typedArrayTags[numberTag] =
  typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] =
  typedArrayTags[setTag] =
  typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] =
    false;
function baseIsTypedArray(value) {
  return (
    isObjectLike_default(value) &&
    isLength_default(value.length) &&
    Boolean(typedArrayTags[baseGetTag_default(value)])
  );
}
const baseIsTypedArray_default = baseIsTypedArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}
const baseUnary_default = baseUnary;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nodeUtil.js
const freeExports2 =
  typeof exports === 'object' && exports && !exports.nodeType && exports;
const freeModule2 =
  freeExports2 &&
  typeof module === 'object' &&
  module &&
  !module.nodeType &&
  module;
const moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
const freeProcess = moduleExports2 && freeGlobal_default.process;
const nodeUtil = (function () {
  try {
    const types =
      freeModule2 && freeModule2.require && freeModule2.require('util').types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
})();
const nodeUtil_default = nodeUtil;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isTypedArray.js
const nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
const isTypedArray = nodeIsTypedArray
  ? baseUnary_default(nodeIsTypedArray)
  : baseIsTypedArray_default;
const isTypedArray_default = isTypedArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayLikeKeys.js
const objectProto7 = Object.prototype;
const hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  const isArr = isArray_default(value);
  const isArg = !isArr && isArguments_default(value);
  const isBuff = !isArr && !isArg && isBuffer_default(value);
  const isType = !isArr && !isArg && !isBuff && isTypedArray_default(value);
  const skipIndexes = isArr || isArg || isBuff || isType;
  const result = skipIndexes ? baseTimes_default(value.length, String) : [];
  const { length } = result;
  for (const key in value) {
    if (
      (inherited || hasOwnProperty5.call(value, key)) &&
      !(
        skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
          (isBuff && (key == 'offset' || key == 'parent')) || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (isType &&
            (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) || // Skip index properties.
          isIndex_default(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}
const arrayLikeKeys_default = arrayLikeKeys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}
const overArg_default = overArg;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeKeys.js
const nativeKeys = overArg_default(Object.keys, Object);
const nativeKeys_default = nativeKeys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseKeys.js
const objectProto8 = Object.prototype;
const hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  const result = [];
  for (const key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}
const baseKeys_default = baseKeys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object)
    ? arrayLikeKeys_default(object)
    : baseKeys_default(object);
}
const keys_default = keys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKey.js
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  const type = typeof value;
  if (
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ||
    value == null ||
    isSymbol_default(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
}
const isKey_default = isKey;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_nativeCreate.js
const nativeCreate = getNative_default(Object, 'create');
const nativeCreate_default = nativeCreate;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
const hashClear_default = hashClear;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  const result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
const hashDelete_default = hashDelete;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashGet.js
const HASH_UNDEFINED = '__lodash_hash_undefined__';
const objectProto9 = Object.prototype;
const hasOwnProperty7 = objectProto9.hasOwnProperty;
function hashGet(key) {
  const data = this.__data__;
  if (nativeCreate_default) {
    const result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty7.call(data, key) ? data[key] : void 0;
}
const hashGet_default = hashGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashHas.js
const objectProto10 = Object.prototype;
const hasOwnProperty8 = objectProto10.hasOwnProperty;
function hashHas(key) {
  const data = this.__data__;
  return nativeCreate_default
    ? data[key] !== void 0
    : hasOwnProperty8.call(data, key);
}
const hashHas_default = hashHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hashSet.js
const HASH_UNDEFINED2 = '__lodash_hash_undefined__';
function hashSet(key, value) {
  const data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] =
    nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
const hashSet_default = hashSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Hash.js
function Hash(entries) {
  let index = -1;
  const length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype.delete = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
const Hash_default = Hash;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
const listCacheClear_default = listCacheClear;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  let { length } = array;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
const assocIndexOf_default = assocIndexOf;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheDelete.js
const arrayProto = Array.prototype;
const { splice } = arrayProto;
function listCacheDelete(key) {
  const data = this.__data__;
  const index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  const lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
const listCacheDelete_default = listCacheDelete;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  const data = this.__data__;
  const index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
const listCacheGet_default = listCacheGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
const listCacheHas_default = listCacheHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  const data = this.__data__;
  const index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
const listCacheSet_default = listCacheSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  let index = -1;
  const length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype.delete = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
const ListCache_default = ListCache;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Map.js
const Map2 = getNative_default(root_default, 'Map');
const Map_default = Map2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    hash: new Hash_default(),
    map: new (Map_default || ListCache_default)(),
    string: new Hash_default(),
  };
}
const mapCacheClear_default = mapCacheClear;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  const type = typeof value;
  return type == 'string' ||
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean'
    ? value !== '__proto__'
    : value === null;
}
const isKeyable_default = isKeyable;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMapData.js
function getMapData(map, key) {
  const data = map.__data__;
  return isKeyable_default(key)
    ? data[typeof key === 'string' ? 'string' : 'hash']
    : data.map;
}
const getMapData_default = getMapData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  const result = getMapData_default(this, key).delete(key);
  this.size -= result ? 1 : 0;
  return result;
}
const mapCacheDelete_default = mapCacheDelete;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
const mapCacheGet_default = mapCacheGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
const mapCacheHas_default = mapCacheHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  const data = getMapData_default(this, key);
  const { size } = data;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
const mapCacheSet_default = mapCacheSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  let index = -1;
  const length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype.delete = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
const MapCache_default = MapCache;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/memoize.js
const FUNC_ERROR_TEXT = 'Expected a function';
function memoize(func, resolver) {
  if (
    typeof func !== 'function' ||
    (resolver != null && typeof resolver !== 'function')
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  const memoized = function () {
    const args = arguments;
    const key = resolver ? resolver.apply(this, args) : args[0];
    const { cache } = memoized;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
memoize.Cache = MapCache_default;
const memoize_default = memoize;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_memoizeCapped.js
const MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  const result = memoize_default(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var { cache } = result;
  return result;
}
const memoizeCapped_default = memoizeCapped;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stringToPath.js
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const stringToPath = memoizeCapped_default(function (string) {
  const result = [];
  if (string.charCodeAt(0) === 46) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(
      quote ? subString.replace(reEscapeChar, '$1') : number || match,
    );
  });
  return result;
});
const stringToPath_default = stringToPath;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toString.js
function toString(value) {
  return value == null ? '' : baseToString_default(value);
}
const toString_default = toString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object)
    ? [value]
    : stringToPath_default(toString_default(value));
}
const castPath_default = castPath;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_toKey.js
const INFINITY2 = 1 / 0;
function toKey(value) {
  if (typeof value === 'string' || isSymbol_default(value)) {
    return value;
  }
  const result = `${value}`;
  return result == '0' && 1 / value == -INFINITY2 ? '-0' : result;
}
const toKey_default = toKey;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  let index = 0;
  const { length } = path;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
const baseGet_default = baseGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  const result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
const get_default = get;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values) {
  let index = -1;
  const { length } = values;
  const offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
const arrayPush_default = arrayPush;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isFlattenable.js
const spreadableSymbol = Symbol_default
  ? Symbol_default.isConcatSpreadable
  : void 0;
function isFlattenable(value) {
  return (
    isArray_default(value) ||
    isArguments_default(value) ||
    Boolean(spreadableSymbol && value && value[spreadableSymbol])
  );
}
const isFlattenable_default = isFlattenable;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFlatten.js
function baseFlatten(array, depth, predicate, isStrict, result) {
  let index = -1;
  const { length } = array;
  predicate || (predicate = isFlattenable_default);
  result || (result = []);
  while (++index < length) {
    const value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush_default(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
const baseFlatten_default = baseFlatten;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/flatten.js
function flatten(array) {
  const length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
const flatten_default = flatten;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_flatRest.js
function flatRest(func) {
  return setToString_default(
    overRest_default(func, void 0, flatten_default),
    `${func}`,
  );
}
const flatRest_default = flatRest;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
const stackClear_default = stackClear;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  const data = this.__data__;
  const result = data.delete(key);
  this.size = data.size;
  return result;
}
const stackDelete_default = stackDelete;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
const stackGet_default = stackGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
const stackHas_default = stackHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_stackSet.js
const LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  let data = this.__data__;
  if (data instanceof ListCache_default) {
    const pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
const stackSet_default = stackSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Stack.js
function Stack(entries) {
  const data = (this.__data__ = new ListCache_default(entries));
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype.delete = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
const Stack_default = Stack;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  let resIndex = 0;
  const result = [];
  while (++index < length) {
    const value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
const arrayFilter_default = arrayFilter;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
const stubArray_default = stubArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getSymbols.js
const objectProto11 = Object.prototype;
const propertyIsEnumerable2 = objectProto11.propertyIsEnumerable;
const nativeGetSymbols = Object.getOwnPropertySymbols;
const getSymbols = !nativeGetSymbols
  ? stubArray_default
  : function (object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter_default(nativeGetSymbols(object), function (symbol) {
        return propertyIsEnumerable2.call(object, symbol);
      });
    };
const getSymbols_default = getSymbols;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  const result = keysFunc(object);
  return isArray_default(object)
    ? result
    : arrayPush_default(result, symbolsFunc(object));
}
const baseGetAllKeys_default = baseGetAllKeys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
const getAllKeys_default = getAllKeys;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_DataView.js
const DataView2 = getNative_default(root_default, 'DataView');
const DataView_default = DataView2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Promise.js
const Promise2 = getNative_default(root_default, 'Promise');
const Promise_default = Promise2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Set.js
const Set2 = getNative_default(root_default, 'Set');
const Set_default = Set2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getTag.js
const mapTag2 = '[object Map]';
const objectTag2 = '[object Object]';
const promiseTag = '[object Promise]';
const setTag2 = '[object Set]';
const weakMapTag2 = '[object WeakMap]';
const dataViewTag2 = '[object DataView]';
const dataViewCtorString = toSource_default(DataView_default);
const mapCtorString = toSource_default(Map_default);
const promiseCtorString = toSource_default(Promise_default);
const setCtorString = toSource_default(Set_default);
const weakMapCtorString = toSource_default(WeakMap_default);
let getTag = baseGetTag_default;
if (
  (DataView_default &&
    getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2) ||
  (Map_default && getTag(new Map_default()) != mapTag2) ||
  (Promise_default && getTag(Promise_default.resolve()) != promiseTag) ||
  (Set_default && getTag(new Set_default()) != setTag2) ||
  (WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2)
) {
  getTag = function (value) {
    const result = baseGetTag_default(value);
    const Ctor = result == objectTag2 ? value.constructor : void 0;
    const ctorString = Ctor ? toSource_default(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
const getTag_default = getTag;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_Uint8Array.js
const Uint8Array2 = root_default.Uint8Array;
const Uint8Array_default = Uint8Array2;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheAdd.js
const HASH_UNDEFINED3 = '__lodash_hash_undefined__';
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
const setCacheAdd_default = setCacheAdd;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
const setCacheHas_default = setCacheHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_SetCache.js
function SetCache(values) {
  let index = -1;
  const length = values == null ? 0 : values.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
const SetCache_default = SetCache;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
const arraySome_default = arraySome;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
const cacheHas_default = cacheHas;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalArrays.js
const COMPARE_PARTIAL_FLAG = 1;
const COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  const isPartial = bitmask & COMPARE_PARTIAL_FLAG;
  const arrLength = array.length;
  const othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  const arrStacked = stack.get(array);
  const othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  let index = -1;
  let result = true;
  const seen =
    bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index];
    const othValue = other[index];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (
        !arraySome_default(other, function (othValue2, othIndex) {
          if (
            !cacheHas_default(seen, othIndex) &&
            (arrValue === othValue2 ||
              equalFunc(arrValue, othValue2, bitmask, customizer, stack))
          ) {
            return seen.push(othIndex);
          }
        })
      ) {
        result = false;
        break;
      }
    } else if (
      !(
        arrValue === othValue ||
        equalFunc(arrValue, othValue, bitmask, customizer, stack)
      )
    ) {
      result = false;
      break;
    }
  }
  stack.delete(array);
  stack.delete(other);
  return result;
}
const equalArrays_default = equalArrays;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mapToArray.js
function mapToArray(map) {
  let index = -1;
  const result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}
const mapToArray_default = mapToArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  let index = -1;
  const result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}
const setToArray_default = setToArray;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalByTag.js
const COMPARE_PARTIAL_FLAG2 = 1;
const COMPARE_UNORDERED_FLAG2 = 2;
const boolTag2 = '[object Boolean]';
const dateTag2 = '[object Date]';
const errorTag2 = '[object Error]';
const mapTag3 = '[object Map]';
const numberTag2 = '[object Number]';
const regexpTag2 = '[object RegExp]';
const setTag3 = '[object Set]';
const stringTag2 = '[object String]';
const symbolTag2 = '[object Symbol]';
const arrayBufferTag2 = '[object ArrayBuffer]';
const dataViewTag3 = '[object DataView]';
const symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
const symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag3:
      if (
        object.byteLength != other.byteLength ||
        object.byteOffset != other.byteOffset
      ) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag2:
      if (
        object.byteLength != other.byteLength ||
        !equalFunc(
          new Uint8Array_default(object),
          new Uint8Array_default(other),
        )
      ) {
        return false;
      }
      return true;
    case boolTag2:
    case dateTag2:
    case numberTag2:
      return eq_default(Number(object), Number(other));
    case errorTag2:
      return object.name == other.name && object.message == other.message;
    case regexpTag2:
    case stringTag2:
      return object == `${other}`;
    case mapTag3:
      var convert = mapToArray_default;
    case setTag3:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(
        convert(object),
        convert(other),
        bitmask,
        customizer,
        equalFunc,
        stack,
      );
      stack.delete(object);
      return result;
    case symbolTag2:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
const equalByTag_default = equalByTag;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_equalObjects.js
const COMPARE_PARTIAL_FLAG3 = 1;
const objectProto12 = Object.prototype;
const hasOwnProperty9 = objectProto12.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  const isPartial = bitmask & COMPARE_PARTIAL_FLAG3;
  const objProps = getAllKeys_default(object);
  const objLength = objProps.length;
  const othProps = getAllKeys_default(other);
  const othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  let index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty9.call(other, key))) {
      return false;
    }
  }
  const objStacked = stack.get(object);
  const othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  let result = true;
  stack.set(object, other);
  stack.set(other, object);
  let skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    const objValue = object[key];
    const othValue = other[key];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    if (
      !(compared === void 0
        ? objValue === othValue ||
          equalFunc(objValue, othValue, bitmask, customizer, stack)
        : compared)
    ) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    const objCtor = object.constructor;
    const othCtor = other.constructor;
    if (
      objCtor != othCtor &&
      'constructor' in object &&
      'constructor' in other &&
      !(
        typeof objCtor === 'function' &&
        objCtor instanceof objCtor &&
        typeof othCtor === 'function' &&
        othCtor instanceof othCtor
      )
    ) {
      result = false;
    }
  }
  stack.delete(object);
  stack.delete(other);
  return result;
}
const equalObjects_default = equalObjects;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqualDeep.js
const COMPARE_PARTIAL_FLAG4 = 1;
const argsTag3 = '[object Arguments]';
const arrayTag2 = '[object Array]';
const objectTag3 = '[object Object]';
const objectProto13 = Object.prototype;
const hasOwnProperty10 = objectProto13.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  let objIsArr = isArray_default(object);
  const othIsArr = isArray_default(other);
  let objTag = objIsArr ? arrayTag2 : getTag_default(object);
  let othTag = othIsArr ? arrayTag2 : getTag_default(other);
  objTag = objTag == argsTag3 ? objectTag3 : objTag;
  othTag = othTag == argsTag3 ? objectTag3 : othTag;
  let objIsObj = objTag == objectTag3;
  const othIsObj = othTag == objectTag3;
  const isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object)
      ? equalArrays_default(
          object,
          other,
          bitmask,
          customizer,
          equalFunc,
          stack,
        )
      : equalByTag_default(
          object,
          other,
          objTag,
          bitmask,
          customizer,
          equalFunc,
          stack,
        );
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    const objIsWrapped =
      objIsObj && hasOwnProperty10.call(object, '__wrapped__');
    const othIsWrapped =
      othIsObj && hasOwnProperty10.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      const objUnwrapped = objIsWrapped ? object.value() : object;
      const othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(
    object,
    other,
    bitmask,
    customizer,
    equalFunc,
    stack,
  );
}
const baseIsEqualDeep_default = baseIsEqualDeep;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (
    value == null ||
    other == null ||
    (!isObjectLike_default(value) && !isObjectLike_default(other))
  ) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(
    value,
    other,
    bitmask,
    customizer,
    baseIsEqual,
    stack,
  );
}
const baseIsEqual_default = baseIsEqual;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIsMatch.js
const COMPARE_PARTIAL_FLAG5 = 1;
const COMPARE_UNORDERED_FLAG3 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  let index = matchData.length;
  const length = index;
  const noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (
      noCustomizer && data[2]
        ? data[1] !== object[data[0]]
        : !(data[0] in object)
    ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    const key = data[0];
    const objValue = object[key];
    const srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      const stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (
        !(result === void 0
          ? baseIsEqual_default(
              srcValue,
              objValue,
              COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3,
              customizer,
              stack,
            )
          : result)
      ) {
        return false;
      }
    }
  }
  return true;
}
const baseIsMatch_default = baseIsMatch;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
const isStrictComparable_default = isStrictComparable;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  const result = keys_default(object);
  let { length } = result;
  while (length--) {
    const key = result[length];
    const value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
const getMatchData_default = getMatchData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return (
      object[key] === srcValue && (srcValue !== void 0 || key in Object(object))
    );
  };
}
const matchesStrictComparable_default = matchesStrictComparable;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  const matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
const baseMatches_default = baseMatches;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
const baseHasIn_default = baseHasIn;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_hasPath.js
function hasPath(object, path, hasFunc) {
  path = castPath_default(path, object);
  let index = -1;
  let { length } = path;
  let result = false;
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return (
    Boolean(length) &&
    isLength_default(length) &&
    isIndex_default(key, length) &&
    (isArray_default(object) || isArguments_default(object))
  );
}
const hasPath_default = hasPath;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/hasIn.js
function hasIn(object, path) {
  return object != null && hasPath_default(object, path, baseHasIn_default);
}
const hasIn_default = hasIn;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMatchesProperty.js
const COMPARE_PARTIAL_FLAG6 = 1;
const COMPARE_UNORDERED_FLAG4 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey_default(path) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path), srcValue);
  }
  return function (object) {
    const objValue = get_default(object, path);
    return objValue === void 0 && objValue === srcValue
      ? hasIn_default(object, path)
      : baseIsEqual_default(
          srcValue,
          objValue,
          COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4,
        );
  };
}
const baseMatchesProperty_default = baseMatchesProperty;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function (object) {
    return object == null ? void 0 : object[key];
  };
}
const baseProperty_default = baseProperty;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path) {
  return function (object) {
    return baseGet_default(object, path);
  };
}
const basePropertyDeep_default = basePropertyDeep;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/property.js
function property(path) {
  return isKey_default(path)
    ? baseProperty_default(toKey_default(path))
    : basePropertyDeep_default(path);
}
const property_default = property;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value === 'function') {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value === 'object') {
    return isArray_default(value)
      ? baseMatchesProperty_default(value[0], value[1])
      : baseMatches_default(value);
  }
  return property_default(value);
}
const baseIteratee_default = baseIteratee;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    let index = -1;
    const iterable = Object(object);
    const props = keysFunc(object);
    let { length } = props;
    while (length--) {
      const key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
const createBaseFor_default = createBaseFor;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseFor.js
const baseFor = createBaseFor_default();
const baseFor_default = baseFor;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
const baseForOwn_default = baseForOwn;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/mapValues.js
function mapValues(object, iteratee) {
  const result = {};
  iteratee = baseIteratee_default(iteratee, 3);
  baseForOwn_default(object, function (value, key, object2) {
    baseAssignValue_default(result, key, iteratee(value, key, object2));
  });
  return result;
}
const mapValues_default = mapValues;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSet.js
function baseSet(object, path, value, customizer) {
  if (!isObject_default(object)) {
    return object;
  }
  path = castPath_default(path, object);
  let index = -1;
  const { length } = path;
  const lastIndex = length - 1;
  let nested = object;
  while (nested != null && ++index < length) {
    const key = toKey_default(path[index]);
    let newValue = value;
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }
    if (index != lastIndex) {
      const objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_default(objValue)
          ? objValue
          : isIndex_default(path[index + 1])
          ? []
          : {};
      }
    }
    assignValue_default(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
const baseSet_default = baseSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePickBy.js
function basePickBy(object, paths, predicate) {
  let index = -1;
  const { length } = paths;
  const result = {};
  while (++index < length) {
    const path = paths[index];
    const value = baseGet_default(object, path);
    if (predicate(value, path)) {
      baseSet_default(result, castPath_default(path, object), value);
    }
  }
  return result;
}
const basePickBy_default = basePickBy;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePick.js
function basePick(object, paths) {
  return basePickBy_default(object, paths, function (value, path) {
    return hasIn_default(object, path);
  });
}
const basePick_default = basePick;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/pick.js
const pick = flatRest_default(function (object, paths) {
  return object == null ? {} : basePick_default(object, paths);
});
const pick_default = pick;

// ../../node_modules/.pnpm/zod@3.22.4/node_modules/zod/lib/index.mjs
let util;
(function (util2) {
  util2.assertEqual = val => val;
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = items => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = obj => {
    const validKeys = util2
      .objectKeys(obj)
      .filter(k => typeof obj[obj[k]] !== 'number');
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = obj => {
    return util2.objectKeys(obj).map(function (e) {
      return obj[e];
    });
  };
  util2.objectKeys =
    typeof Object.keys === 'function'
      ? obj => Object.keys(obj)
      : object => {
          const keys2 = [];
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              keys2.push(key);
            }
          }
          return keys2;
        };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item)) {
        return item;
      }
    }
    return void 0;
  };
  util2.isInteger =
    typeof Number.isInteger === 'function'
      ? val => Number.isInteger(val)
      : val =>
          typeof val === 'number' && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = ' | ') {
    return array
      .map(val => (typeof val === 'string' ? `'${val}'` : val))
      .join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
let objectUtil;
(function (objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second,
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  'string',
  'nan',
  'number',
  'integer',
  'float',
  'boolean',
  'date',
  'bigint',
  'symbol',
  'function',
  'undefined',
  'null',
  'array',
  'object',
  'unknown',
  'promise',
  'void',
  'never',
  'map',
  'set',
]);
const getParsedType = data => {
  const t = typeof data;
  switch (t) {
    case 'undefined':
      return ZodParsedType.undefined;
    case 'string':
      return ZodParsedType.string;
    case 'number':
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case 'boolean':
      return ZodParsedType.boolean;
    case 'function':
      return ZodParsedType.function;
    case 'bigint':
      return ZodParsedType.bigint;
    case 'symbol':
      return ZodParsedType.symbol;
    case 'object':
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (
        data.then &&
        typeof data.then === 'function' &&
        data.catch &&
        typeof data.catch === 'function'
      ) {
        return ZodParsedType.promise;
      }
      if (typeof Map !== 'undefined' && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== 'undefined' && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== 'undefined' && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  'invalid_type',
  'invalid_literal',
  'custom',
  'invalid_union',
  'invalid_union_discriminator',
  'invalid_enum_value',
  'unrecognized_keys',
  'invalid_arguments',
  'invalid_return_type',
  'invalid_date',
  'invalid_string',
  'too_small',
  'too_big',
  'invalid_intersection_types',
  'not_multiple_of',
  'not_finite',
]);
const quotelessJson = obj => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, '$1:');
};
const ZodError = class extends Error {
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = sub => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = 'ZodError';
    this.issues = issues;
  }

  get errors() {
    return this.issues;
  }

  format(_mapper) {
    const mapper =
      _mapper ||
      function (issue) {
        return issue.message;
      };
    const fieldErrors = { _errors: [] };
    const processError = error => {
      for (const issue of error.issues) {
        if (issue.code === 'invalid_union') {
          issue.unionErrors.map(processError);
        } else if (issue.code === 'invalid_return_type') {
          processError(issue.returnTypeError);
        } else if (issue.code === 'invalid_arguments') {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }

  toString() {
    return this.message;
  }

  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }

  get isEmpty() {
    return this.issues.length === 0;
  }

  flatten(mapper = issue => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }

  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = issues => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = 'Required';
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer,
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(
        issue.keys,
        ', ',
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(
        issue.options,
      )}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(
        issue.options,
      )}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('includes' in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === 'number') {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ('startsWith' in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ('endsWith' in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== 'regex') {
        message = `Invalid ${issue.validation}`;
      } else {
        message = 'Invalid';
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === 'array') {
        message = `Array must contain ${
          issue.exact ? 'exactly' : issue.inclusive ? `at least` : `more than`
        } ${issue.minimum} element(s)`;
      } else if (issue.type === 'string') {
        message = `String must contain ${
          issue.exact ? 'exactly' : issue.inclusive ? `at least` : `over`
        } ${issue.minimum} character(s)`;
      } else if (issue.type === 'number') {
        message = `Number must be ${
          issue.exact
            ? `exactly equal to `
            : issue.inclusive
            ? `greater than or equal to `
            : `greater than `
        }${issue.minimum}`;
      } else if (issue.type === 'date') {
        message = `Date must be ${
          issue.exact
            ? `exactly equal to `
            : issue.inclusive
            ? `greater than or equal to `
            : `greater than `
        }${new Date(Number(issue.minimum))}`;
      } else {
        message = 'Invalid input';
      }
      break;
    case ZodIssueCode.too_big:
      if (issue.type === 'array') {
        message = `Array must contain ${
          issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`
        } ${issue.maximum} element(s)`;
      } else if (issue.type === 'string') {
        message = `String must contain ${
          issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`
        } ${issue.maximum} character(s)`;
      } else if (issue.type === 'number') {
        message = `Number must be ${
          issue.exact
            ? `exactly`
            : issue.inclusive
            ? `less than or equal to`
            : `less than`
        } ${issue.maximum}`;
      } else if (issue.type === 'bigint') {
        message = `BigInt must be ${
          issue.exact
            ? `exactly`
            : issue.inclusive
            ? `less than or equal to`
            : `less than`
        } ${issue.maximum}`;
      } else if (issue.type === 'date') {
        message = `Date must be ${
          issue.exact
            ? `exactly`
            : issue.inclusive
            ? `smaller than or equal to`
            : `smaller than`
        } ${new Date(Number(issue.maximum))}`;
      } else {
        message = 'Invalid input';
      }
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = 'Number must be finite';
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = params => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...(issueData.path || [])];
  const fullIssue = {
    ...issueData,
    path: fullPath,
  };
  let errorMessage = '';
  const maps = errorMaps
    .filter(m => Boolean(m))
    .slice()
    .reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: issueData.message || errorMessage,
  };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      getErrorMap(),
      errorMap,
      // then global default map
    ].filter(x => Boolean(x)),
  });
  ctx.common.issues.push(issue);
}
const ParseStatus = class _ParseStatus {
  constructor() {
    this.value = 'valid';
  }

  dirty() {
    if (this.value === 'valid') {
      this.value = 'dirty';
    }
  }

  abort() {
    if (this.value !== 'aborted') {
      this.value = 'aborted';
    }
  }

  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === 'aborted') {
        return INVALID;
      }
      if (s.status === 'dirty') {
        status.dirty();
      }
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }

  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      syncPairs.push({
        key: await pair.key,
        value: await pair.value,
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }

  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === 'aborted') {
        return INVALID;
      }
      if (value.status === 'aborted') {
        return INVALID;
      }
      if (key.status === 'dirty') {
        status.dirty();
      }
      if (value.status === 'dirty') {
        status.dirty();
      }
      if (
        key.value !== '__proto__' &&
        (typeof value.value !== 'undefined' || pair.alwaysSet)
      ) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: 'aborted',
});
const DIRTY = value => ({ status: 'dirty', value });
const OK = value => ({ status: 'valid', value });
const isAborted = x => x.status === 'aborted';
const isDirty = x => x.status === 'dirty';
const isValid = x => x.status === 'valid';
const isAsync = x => typeof Promise !== 'undefined' && x instanceof Promise;
let errorUtil;
(function (errorUtil2) {
  errorUtil2.errToObj = message =>
    typeof message === 'string' ? { message } : message || {};
  errorUtil2.toString = message =>
    typeof message === 'string'
      ? message
      : message === null || message === void 0
      ? void 0
      : message.message;
})(errorUtil || (errorUtil = {}));
const ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }

  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error('Validation failed but no issues detected.');
    }
    return {
      success: false,
      get error() {
        if (this._error) {
          return this._error;
        }
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      },
    };
  }
};
function processCreateParams(params) {
  if (!params) {
    return {};
  }
  const {
    errorMap: errorMap2,
    invalid_type_error,
    required_error,
    description,
  } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  }
  if (errorMap2) {
    return { errorMap: errorMap2, description };
  }
  const customMap = (iss, ctx) => {
    if (iss.code !== 'invalid_type') {
      return { message: ctx.defaultError };
    }
    if (typeof ctx.data === 'undefined') {
      return {
        message:
          required_error !== null && required_error !== void 0
            ? required_error
            : ctx.defaultError,
      };
    }
    return {
      message:
        invalid_type_error !== null && invalid_type_error !== void 0
          ? invalid_type_error
          : ctx.defaultError,
    };
  };
  return { errorMap: customMap, description };
}
const ZodType = class {
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
  }

  get description() {
    return this._def.description;
  }

  _getType(input) {
    return getParsedType(input.data);
  }

  _getOrReturnCtx(input, ctx) {
    return (
      ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      }
    );
  }

  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent,
      },
    };
  }

  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error('Synchronous parse encountered promise.');
    }
    return result;
  }

  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }

  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success) {
      return result.data;
    }
    throw result.error;
  }

  safeParse(data, params) {
    let _a;
    const ctx = {
      common: {
        issues: [],
        async:
          (_a =
            params === null || params === void 0 ? void 0 : params.async) !==
            null && _a !== void 0
            ? _a
            : false,
        contextualErrorMap:
          params === null || params === void 0 ? void 0 : params.errorMap,
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }

  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success) {
      return result.data;
    }
    throw result.error;
  }

  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap:
          params === null || params === void 0 ? void 0 : params.errorMap,
        async: true,
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data),
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult)
      ? maybeAsyncResult
      : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }

  refine(check, message) {
    const getIssueProperties = val => {
      if (typeof message === 'string' || typeof message === 'undefined') {
        return { message };
      } else if (typeof message === 'function') {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () =>
        ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val),
        });
      if (typeof Promise !== 'undefined' && result instanceof Promise) {
        return result.then(data => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }

  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(
          typeof refinementData === 'function'
            ? refinementData(val, ctx)
            : refinementData,
        );
        return false;
      } else {
        return true;
      }
    });
  }

  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: 'refinement', refinement },
    });
  }

  superRefine(refinement) {
    return this._refinement(refinement);
  }

  optional() {
    return ZodOptional.create(this, this._def);
  }

  nullable() {
    return ZodNullable.create(this, this._def);
  }

  nullish() {
    return this.nullable().optional();
  }

  array() {
    return ZodArray.create(this, this._def);
  }

  promise() {
    return ZodPromise.create(this, this._def);
  }

  or(option) {
    return ZodUnion.create([this, option], this._def);
  }

  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }

  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: 'transform', transform },
    });
  }

  default(def) {
    const defaultValueFunc = typeof def === 'function' ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
    });
  }

  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def),
    });
  }

  catch(def) {
    const catchValueFunc = typeof def === 'function' ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
    });
  }

  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description,
    });
  }

  pipe(target) {
    return ZodPipeline.create(this, target);
  }

  readonly() {
    return ZodReadonly.create(this);
  }

  isOptional() {
    return this.safeParse(void 0).success;
  }

  isNullable() {
    return this.safeParse(null).success;
  }
};
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[a-z][a-z0-9]*$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const emailRegex =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
const ipv4Regex =
  /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
const ipv6Regex =
  /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
const datetimeRegex = args => {
  if (args.precision) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
      );
    } else {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`,
      );
    }
  } else if (args.precision === 0) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
      );
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
    }
  } else if (args.offset) {
    return new RegExp(
      `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`,
    );
  } else {
    return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
  }
};
function isValidIP(ip, version) {
  if ((version === 'v4' || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === 'v6' || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
const ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(
        ctx2,
        {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType,
        },
        //
      );
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: 'string',
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: 'string',
            inclusive: true,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'length') {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: 'string',
              inclusive: true,
              exact: true,
              message: check.message,
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: 'string',
              inclusive: true,
              exact: true,
              message: check.message,
            });
          }
          status.dirty();
        }
      } else if (check.kind === 'email') {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'email',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'emoji') {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, 'u');
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'emoji',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'uuid') {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'uuid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'cuid') {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'cuid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'cuid2') {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'cuid2',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'ulid') {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'ulid',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'url') {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'url',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'regex') {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'regex',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'trim') {
        input.data = input.data.trim();
      } else if (check.kind === 'includes') {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'toLowerCase') {
        input.data = input.data.toLowerCase();
      } else if (check.kind === 'toUpperCase') {
        input.data = input.data.toUpperCase();
      } else if (check.kind === 'startsWith') {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'endsWith') {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'datetime') {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: 'datetime',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'ip') {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: 'ip',
            code: ZodIssueCode.invalid_string,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }

  _regex(regex, validation, message) {
    return this.refinement(data => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message),
    });
  }

  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  email(message) {
    return this._addCheck({ kind: 'email', ...errorUtil.errToObj(message) });
  }

  url(message) {
    return this._addCheck({ kind: 'url', ...errorUtil.errToObj(message) });
  }

  emoji(message) {
    return this._addCheck({ kind: 'emoji', ...errorUtil.errToObj(message) });
  }

  uuid(message) {
    return this._addCheck({ kind: 'uuid', ...errorUtil.errToObj(message) });
  }

  cuid(message) {
    return this._addCheck({ kind: 'cuid', ...errorUtil.errToObj(message) });
  }

  cuid2(message) {
    return this._addCheck({ kind: 'cuid2', ...errorUtil.errToObj(message) });
  }

  ulid(message) {
    return this._addCheck({ kind: 'ulid', ...errorUtil.errToObj(message) });
  }

  ip(options) {
    return this._addCheck({ kind: 'ip', ...errorUtil.errToObj(options) });
  }

  datetime(options) {
    let _a;
    if (typeof options === 'string') {
      return this._addCheck({
        kind: 'datetime',
        precision: null,
        offset: false,
        message: options,
      });
    }
    return this._addCheck({
      kind: 'datetime',
      precision:
        typeof (options === null || options === void 0
          ? void 0
          : options.precision) === 'undefined'
          ? null
          : options === null || options === void 0
          ? void 0
          : options.precision,
      offset:
        (_a =
          options === null || options === void 0 ? void 0 : options.offset) !==
          null && _a !== void 0
          ? _a
          : false,
      ...errorUtil.errToObj(
        options === null || options === void 0 ? void 0 : options.message,
      ),
    });
  }

  regex(regex, message) {
    return this._addCheck({
      kind: 'regex',
      regex,
      ...errorUtil.errToObj(message),
    });
  }

  includes(value, options) {
    return this._addCheck({
      kind: 'includes',
      value,
      position:
        options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(
        options === null || options === void 0 ? void 0 : options.message,
      ),
    });
  }

  startsWith(value, message) {
    return this._addCheck({
      kind: 'startsWith',
      value,
      ...errorUtil.errToObj(message),
    });
  }

  endsWith(value, message) {
    return this._addCheck({
      kind: 'endsWith',
      value,
      ...errorUtil.errToObj(message),
    });
  }

  min(minLength, message) {
    return this._addCheck({
      kind: 'min',
      value: minLength,
      ...errorUtil.errToObj(message),
    });
  }

  max(maxLength, message) {
    return this._addCheck({
      kind: 'max',
      value: maxLength,
      ...errorUtil.errToObj(message),
    });
  }

  length(len, message) {
    return this._addCheck({
      kind: 'length',
      value: len,
      ...errorUtil.errToObj(message),
    });
  }

  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }

  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'trim' }],
    });
  }

  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'toLowerCase' }],
    });
  }

  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: 'toUpperCase' }],
    });
  }

  get isDatetime() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'datetime'));
  }

  get isEmail() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'email'));
  }

  get isURL() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'url'));
  }

  get isEmoji() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'emoji'));
  }

  get isUUID() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'uuid'));
  }

  get isCUID() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'cuid'));
  }

  get isCUID2() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'cuid2'));
  }

  get isULID() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'ulid'));
  }

  get isIP() {
    return Boolean(this._def.checks.find(ch => ch.kind === 'ip'));
  }

  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) {
          min = ch.value;
        }
      }
    }
    return min;
  }

  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) {
          max = ch.value;
        }
      }
    }
    return max;
  }
};
ZodString.create = params => {
  let _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce:
      (_a = params === null || params === void 0 ? void 0 : params.coerce) !==
        null && _a !== void 0
        ? _a
        : false,
    ...processCreateParams(params),
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split('.')[1] || '').length;
  const stepDecCount = (step.toString().split('.')[1] || '').length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace('.', ''));
  const stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
  return (valInt % stepInt) / Math.pow(10, decCount);
}
const ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }

  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === 'int') {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: 'integer',
            received: 'float',
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'min') {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: 'number',
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: 'number',
            inclusive: check.inclusive,
            exact: false,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'multipleOf') {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'finite') {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }

  gte(value, message) {
    return this.setLimit('min', value, true, errorUtil.toString(message));
  }

  gt(value, message) {
    return this.setLimit('min', value, false, errorUtil.toString(message));
  }

  lte(value, message) {
    return this.setLimit('max', value, true, errorUtil.toString(message));
  }

  lt(value, message) {
    return this.setLimit('max', value, false, errorUtil.toString(message));
  }

  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }

  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  int(message) {
    return this._addCheck({
      kind: 'int',
      message: errorUtil.toString(message),
    });
  }

  positive(message) {
    return this._addCheck({
      kind: 'min',
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }

  negative(message) {
    return this._addCheck({
      kind: 'max',
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }

  nonpositive(message) {
    return this._addCheck({
      kind: 'max',
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }

  nonnegative(message) {
    return this._addCheck({
      kind: 'min',
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }

  multipleOf(value, message) {
    return this._addCheck({
      kind: 'multipleOf',
      value,
      message: errorUtil.toString(message),
    });
  }

  finite(message) {
    return this._addCheck({
      kind: 'finite',
      message: errorUtil.toString(message),
    });
  }

  safe(message) {
    return this._addCheck({
      kind: 'min',
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message),
    })._addCheck({
      kind: 'max',
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message),
    });
  }

  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) {
          min = ch.value;
        }
      }
    }
    return min;
  }

  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) {
          max = ch.value;
        }
      }
    }
    return max;
  }

  get isInt() {
    return Boolean(
      this._def.checks.find(
        ch =>
          ch.kind === 'int' ||
          (ch.kind === 'multipleOf' && util.isInteger(ch.value)),
      ),
    );
  }

  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (
        ch.kind === 'finite' ||
        ch.kind === 'int' ||
        ch.kind === 'multipleOf'
      ) {
        return true;
      } else if (ch.kind === 'min') {
        if (min === null || ch.value > min) {
          min = ch.value;
        }
      } else if (ch.kind === 'max') {
        if (max === null || ch.value < max) {
          max = ch.value;
        }
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = params => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce:
      (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params),
  });
};
const ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }

  _parse(input) {
    if (this._def.coerce) {
      input.data = BigInt(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        const tooSmall = check.inclusive
          ? input.data < check.value
          : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: 'bigint',
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        const tooBig = check.inclusive
          ? input.data > check.value
          : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: 'bigint',
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message,
          });
          status.dirty();
        }
      } else if (check.kind === 'multipleOf') {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message,
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }

  gte(value, message) {
    return this.setLimit('min', value, true, errorUtil.toString(message));
  }

  gt(value, message) {
    return this.setLimit('min', value, false, errorUtil.toString(message));
  }

  lte(value, message) {
    return this.setLimit('max', value, true, errorUtil.toString(message));
  }

  lt(value, message) {
    return this.setLimit('max', value, false, errorUtil.toString(message));
  }

  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message),
        },
      ],
    });
  }

  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  positive(message) {
    return this._addCheck({
      kind: 'min',
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }

  negative(message) {
    return this._addCheck({
      kind: 'max',
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message),
    });
  }

  nonpositive(message) {
    return this._addCheck({
      kind: 'max',
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }

  nonnegative(message) {
    return this._addCheck({
      kind: 'min',
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message),
    });
  }

  multipleOf(value, message) {
    return this._addCheck({
      kind: 'multipleOf',
      value,
      message: errorUtil.toString(message),
    });
  }

  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) {
          min = ch.value;
        }
      }
    }
    return min;
  }

  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) {
          max = ch.value;
        }
      }
    }
    return max;
  }
};
ZodBigInt.create = params => {
  let _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce:
      (_a = params === null || params === void 0 ? void 0 : params.coerce) !==
        null && _a !== void 0
        ? _a
        : false,
    ...processCreateParams(params),
  });
};
const ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = params => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce:
      (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params),
  });
};
const ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date,
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === 'min') {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: 'date',
          });
          status.dirty();
        }
      } else if (check.kind === 'max') {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: 'date',
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime()),
    };
  }

  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  min(minDate, message) {
    return this._addCheck({
      kind: 'min',
      value: minDate.getTime(),
      message: errorUtil.toString(message),
    });
  }

  max(maxDate, message) {
    return this._addCheck({
      kind: 'max',
      value: maxDate.getTime(),
      message: errorUtil.toString(message),
    });
  }

  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'min') {
        if (min === null || ch.value > min) {
          min = ch.value;
        }
      }
    }
    return min != null ? new Date(min) : null;
  }

  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === 'max') {
        if (max === null || ch.value < max) {
          max = ch.value;
        }
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = params => {
  return new ZodDate({
    checks: [],
    coerce:
      (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params),
  });
};
const ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = params => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params),
  });
};
const ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = params => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params),
  });
};
const ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = params => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params),
  });
};
const ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }

  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = params => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params),
  });
};
const ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }

  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = params => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params),
  });
};
const ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType,
    });
    return INVALID;
  }
};
ZodNever.create = params => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params),
  });
};
const ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = params => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params),
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: 'array',
          inclusive: true,
          exact: true,
          message: def.exactLength.message,
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: 'array',
          inclusive: true,
          exact: false,
          message: def.minLength.message,
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: 'array',
          inclusive: true,
          exact: false,
          message: def.maxLength.message,
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all(
        [...ctx.data].map((item, i) => {
          return def.type._parseAsync(
            new ParseInputLazyPath(ctx, item, ctx.path, i),
          );
        }),
      ).then(result2 => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(
        new ParseInputLazyPath(ctx, item, ctx.path, i),
      );
    });
    return ParseStatus.mergeArray(status, result);
  }

  get element() {
    return this._def.type;
  }

  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) },
    });
  }

  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) },
    });
  }

  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) },
    });
  }

  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params),
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape,
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element),
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map(item => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }

  _getCached() {
    if (this._cached !== null) {
      return this._cached;
    }
    const shape = this._def.shape();
    const keys2 = util.objectKeys(shape);
    return (this._cached = { shape, keys: keys2 });
  }

  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType,
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (
      !(
        this._def.catchall instanceof ZodNever &&
        this._def.unknownKeys === 'strip'
      )
    ) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: 'valid', value: key },
        value: keyValidator._parse(
          new ParseInputLazyPath(ctx, value, ctx.path, key),
        ),
        alwaysSet: key in ctx.data,
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const { unknownKeys } = this._def;
      if (unknownKeys === 'passthrough') {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: 'valid', value: key },
            value: { status: 'valid', value: ctx.data[key] },
          });
        }
      } else if (unknownKeys === 'strict') {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys,
          });
          status.dirty();
        }
      } else if (unknownKeys === 'strip') {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const { catchall } = this._def;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: 'valid', value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key),
            // , ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data,
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve()
        .then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            syncPairs.push({
              key,
              value: await pair.value,
              alwaysSet: pair.alwaysSet,
            });
          }
          return syncPairs;
        })
        .then(syncPairs => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }

  get shape() {
    return this._def.shape();
  }

  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: 'strict',
      ...(message !== void 0
        ? {
            errorMap: (issue, ctx) => {
              let _a, _b, _c, _d;
              const defaultError =
                (_c =
                  (_b = (_a = this._def).errorMap) === null || _b === void 0
                    ? void 0
                    : _b.call(_a, issue, ctx).message) !== null && _c !== void 0
                  ? _c
                  : ctx.defaultError;
              if (issue.code === 'unrecognized_keys') {
                return {
                  message:
                    (_d = errorUtil.errToObj(message).message) !== null &&
                    _d !== void 0
                      ? _d
                      : defaultError,
                };
              }
              return {
                message: defaultError,
              };
            },
          }
        : {}),
    });
  }

  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: 'strip',
    });
  }

  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: 'passthrough',
    });
  }

  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation,
      }),
    });
  }

  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape(),
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject,
    });
    return merged;
  }

  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }

  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index,
    });
  }

  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach(key => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }

  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach(key => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape,
    });
  }

  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }

  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach(key => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }

  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach(key => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape,
    });
  }

  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: 'strip',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: 'strict',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: 'strip',
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params),
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const { options } = this._def;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === 'valid') {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === 'dirty') {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map(
        result => new ZodError(result.ctx.common.issues),
      );
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(
        options.map(async option => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: [],
            },
            parent: null,
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx,
            }),
            ctx: childCtx,
          };
        }),
      ).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: [],
          },
          parent: null,
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx,
        });
        if (result.status === 'valid') {
          return result;
        } else if (result.status === 'dirty' && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map(issues2 => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors,
      });
      return INVALID;
    }
  }

  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params),
  });
};
const getDiscriminator = type => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return Object.keys(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else {
    return null;
  }
};
const ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const { discriminator } = this;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator],
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
    }
  }

  get discriminator() {
    return this._def.discriminator;
  }

  get options() {
    return this._def.options;
  }

  get optionsMap() {
    return this._def.optionsMap;
  }

  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues) {
        throw new Error(
          `A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`,
        );
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(
            `Discriminator property ${String(
              discriminator,
            )} has duplicate value ${String(value)}`,
          );
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params),
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util
      .objectKeys(a)
      .filter(key => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (
    aType === ZodParsedType.date &&
    bType === ZodParsedType.date &&
    Number(a) === Number(b)
  ) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types,
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(
        this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
        this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        }),
      );
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params),
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: 'array',
      });
      return INVALID;
    }
    const { rest } = this._def;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: 'array',
      });
      status.dirty();
    }
    const items = [...ctx.data]
      .map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema) {
          return null;
        }
        return schema._parse(
          new ParseInputLazyPath(ctx, item, ctx.path, itemIndex),
        );
      })
      .filter(x => Boolean(x));
    if (ctx.common.async) {
      return Promise.all(items).then(results => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }

  get items() {
    return this._def.items;
  }

  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest,
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error('You must pass an array of schemas to z.tuple([ ... ])');
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params),
  });
};
const ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }

  get valueSchema() {
    return this._def.valueType;
  }

  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const pairs = [];
    const { keyType } = this._def;
    const { valueType } = this._def;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(
          new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key),
        ),
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }

  get element() {
    return this._def.valueType;
  }

  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third),
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second),
    });
  }
};
const ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }

  get valueSchema() {
    return this._def.valueType;
  }

  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const { keyType } = this._def;
    const { valueType } = this._def;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(
          new ParseInputLazyPath(ctx, key, ctx.path, [index, 'key']),
        ),
        value: valueType._parse(
          new ParseInputLazyPath(ctx, value, ctx.path, [index, 'value']),
        ),
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === 'aborted' || value.status === 'aborted') {
            return INVALID;
          }
          if (key.status === 'dirty' || value.status === 'dirty') {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const { key } = pair;
        const { value } = pair;
        if (key.status === 'aborted' || value.status === 'aborted') {
          return INVALID;
        }
        if (key.status === 'dirty' || value.status === 'dirty') {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params),
  });
};
const ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: 'set',
          inclusive: true,
          exact: false,
          message: def.minSize.message,
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: 'set',
          inclusive: true,
          exact: false,
          message: def.maxSize.message,
        });
        status.dirty();
      }
    }
    const { valueType } = this._def;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === 'aborted') {
          return INVALID;
        }
        if (element.status === 'dirty') {
          status.dirty();
        }
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) =>
      valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)),
    );
    if (ctx.common.async) {
      return Promise.all(elements).then(elements2 => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }

  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) },
    });
  }

  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) },
    });
  }

  size(size, message) {
    return this.min(size, message).max(size, message);
  }

  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params),
  });
};
const ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }

  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap,
        ].filter(x => Boolean(x)),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error,
        },
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap,
        ].filter(x => Boolean(x)),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error,
        },
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function (...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args
          .parseAsync(args, params)
          .catch(e => {
            error.addIssue(makeArgsIssue(args, e));
            throw error;
          });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type
          .parseAsync(result, params)
          .catch(e => {
            error.addIssue(makeReturnsIssue(result, e));
            throw error;
          });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function (...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }

  parameters() {
    return this._def.args;
  }

  returnType() {
    return this._def.returns;
  }

  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create()),
    });
  }

  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType,
    });
  }

  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }

  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }

  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params),
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }

  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params),
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value,
      });
      return INVALID;
    }
    return { status: 'valid', value: input.data };
  }

  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params),
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params),
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== 'string') {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (this._def.values.indexOf(input.data) === -1) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }

  get options() {
    return this._def.values;
  }

  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }

  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }

  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }

  extract(values) {
    return _ZodEnum.create(values);
  }

  exclude(values) {
    return _ZodEnum.create(this.options.filter(opt => !values.includes(opt)));
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (
      ctx.parsedType !== ZodParsedType.string &&
      ctx.parsedType !== ZodParsedType.number
    ) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type,
      });
      return INVALID;
    }
    if (nativeEnumValues.indexOf(input.data) === -1) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues,
      });
      return INVALID;
    }
    return OK(input.data);
  }

  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params),
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }

  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (
      ctx.parsedType !== ZodParsedType.promise &&
      ctx.common.async === false
    ) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    const promisified =
      ctx.parsedType === ZodParsedType.promise
        ? ctx.data
        : Promise.resolve(ctx.data);
    return OK(
      promisified.then(data => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap,
        });
      }),
    );
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params),
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }

  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }

  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: arg => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      },
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === 'preprocess') {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.issues.length) {
        return {
          status: 'dirty',
          value: ctx.data,
        };
      }
      if (ctx.common.async) {
        return Promise.resolve(processed).then(processed2 => {
          return this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx,
          });
        });
      } else {
        return this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx,
        });
      }
    }
    if (effect.type === 'refinement') {
      const executeRefinement = acc => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error(
            'Async refinement encountered during synchronous parse operation. Use .parseAsync instead.',
          );
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inner.status === 'aborted') {
          return INVALID;
        }
        if (inner.status === 'dirty') {
          status.dirty();
        }
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then(inner => {
            if (inner.status === 'aborted') {
              return INVALID;
            }
            if (inner.status === 'dirty') {
              status.dirty();
            }
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
      }
    }
    if (effect.type === 'transform') {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (!isValid(base)) {
          return base;
        }
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(
            `Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`,
          );
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema
          ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
          .then(base => {
            if (!isValid(base)) {
              return base;
            }
            return Promise.resolve(effect.transform(base.value, checkCtx)).then(
              result => ({ status: status.value, value: result }),
            );
          });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params),
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: 'preprocess', transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params),
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }

  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params),
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }

  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params),
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let { data } = ctx;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }

  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue:
      typeof params.default === 'function'
        ? params.default
        : () => params.default,
    ...processCreateParams(params),
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: [],
      },
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx,
      },
    });
    if (isAsync(result)) {
      return result.then(result2 => {
        return {
          status: 'valid',
          value:
            result2.status === 'valid'
              ? result2.value
              : this._def.catchValue({
                  get error() {
                    return new ZodError(newCtx.common.issues);
                  },
                  input: newCtx.data,
                }),
        };
      });
    } else {
      return {
        status: 'valid',
        value:
          result.status === 'valid'
            ? result.value
            : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data,
              }),
      };
    }
  }

  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue:
      typeof params.catch === 'function' ? params.catch : () => params.catch,
    ...processCreateParams(params),
  });
};
const ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType,
      });
      return INVALID;
    }
    return { status: 'valid', value: input.data };
  }
};
ZodNaN.create = params => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params),
  });
};
const BRAND = Symbol('zod_brand');
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const { data } = ctx;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx,
    });
  }

  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx,
        });
        if (inResult.status === 'aborted') {
          return INVALID;
        }
        if (inResult.status === 'dirty') {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx,
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx,
      });
      if (inResult.status === 'aborted') {
        return INVALID;
      }
      if (inResult.status === 'dirty') {
        status.dirty();
        return {
          status: 'dirty',
          value: inResult.value,
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx,
        });
      }
    }
  }

  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline,
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    if (isValid(result)) {
      result.value = Object.freeze(result.value);
    }
    return result;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params),
  });
};
const custom = (check, params = {}, fatal) => {
  if (check) {
    return ZodAny.create().superRefine((data, ctx) => {
      let _a, _b;
      if (!check(data)) {
        const p =
          typeof params === 'function'
            ? params(data)
            : typeof params === 'string'
            ? { message: params }
            : params;
        const _fatal =
          (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !==
            null && _b !== void 0
            ? _b
            : true;
        const p2 = typeof p === 'string' ? { message: p } : p;
        ctx.addIssue({ code: 'custom', ...p2, fatal: _fatal });
      }
    });
  }
  return ZodAny.create();
};
const late = {
  object: ZodObject.lazycreate,
};
let ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2.ZodString = 'ZodString';
  ZodFirstPartyTypeKind2.ZodNumber = 'ZodNumber';
  ZodFirstPartyTypeKind2.ZodNaN = 'ZodNaN';
  ZodFirstPartyTypeKind2.ZodBigInt = 'ZodBigInt';
  ZodFirstPartyTypeKind2.ZodBoolean = 'ZodBoolean';
  ZodFirstPartyTypeKind2.ZodDate = 'ZodDate';
  ZodFirstPartyTypeKind2.ZodSymbol = 'ZodSymbol';
  ZodFirstPartyTypeKind2.ZodUndefined = 'ZodUndefined';
  ZodFirstPartyTypeKind2.ZodNull = 'ZodNull';
  ZodFirstPartyTypeKind2.ZodAny = 'ZodAny';
  ZodFirstPartyTypeKind2.ZodUnknown = 'ZodUnknown';
  ZodFirstPartyTypeKind2.ZodNever = 'ZodNever';
  ZodFirstPartyTypeKind2.ZodVoid = 'ZodVoid';
  ZodFirstPartyTypeKind2.ZodArray = 'ZodArray';
  ZodFirstPartyTypeKind2.ZodObject = 'ZodObject';
  ZodFirstPartyTypeKind2.ZodUnion = 'ZodUnion';
  ZodFirstPartyTypeKind2.ZodDiscriminatedUnion = 'ZodDiscriminatedUnion';
  ZodFirstPartyTypeKind2.ZodIntersection = 'ZodIntersection';
  ZodFirstPartyTypeKind2.ZodTuple = 'ZodTuple';
  ZodFirstPartyTypeKind2.ZodRecord = 'ZodRecord';
  ZodFirstPartyTypeKind2.ZodMap = 'ZodMap';
  ZodFirstPartyTypeKind2.ZodSet = 'ZodSet';
  ZodFirstPartyTypeKind2.ZodFunction = 'ZodFunction';
  ZodFirstPartyTypeKind2.ZodLazy = 'ZodLazy';
  ZodFirstPartyTypeKind2.ZodLiteral = 'ZodLiteral';
  ZodFirstPartyTypeKind2.ZodEnum = 'ZodEnum';
  ZodFirstPartyTypeKind2.ZodEffects = 'ZodEffects';
  ZodFirstPartyTypeKind2.ZodNativeEnum = 'ZodNativeEnum';
  ZodFirstPartyTypeKind2.ZodOptional = 'ZodOptional';
  ZodFirstPartyTypeKind2.ZodNullable = 'ZodNullable';
  ZodFirstPartyTypeKind2.ZodDefault = 'ZodDefault';
  ZodFirstPartyTypeKind2.ZodCatch = 'ZodCatch';
  ZodFirstPartyTypeKind2.ZodPromise = 'ZodPromise';
  ZodFirstPartyTypeKind2.ZodBranded = 'ZodBranded';
  ZodFirstPartyTypeKind2.ZodPipeline = 'ZodPipeline';
  ZodFirstPartyTypeKind2.ZodReadonly = 'ZodReadonly';
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const instanceOfType = (
  cls,
  params = {
    message: `Input not instance of ${cls.name}`,
  },
) => custom(data => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
  string: arg => ZodString.create({ ...arg, coerce: true }),
  number: arg => ZodNumber.create({ ...arg, coerce: true }),
  boolean: arg =>
    ZodBoolean.create({
      ...arg,
      coerce: true,
    }),
  bigint: arg => ZodBigInt.create({ ...arg, coerce: true }),
  date: arg => ZodDate.create({ ...arg, coerce: true }),
};
const NEVER = INVALID;
const z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  enum: enumType,
  function: functionType,
  instanceof: instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  null: nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  undefined: undefinedType,
  union: unionType,
  unknown: unknownType,
  void: voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError,
});

// src/services/feishu/client/index.ts
let client = null;
const AppAccessTokenResultSchema = z.object({
  code: z.number(),
  msg: z.string(),
  app_access_token: z.string(),
  expire: z.number(),
});
const Client = class {
  constructor(options) {
    __publicField(this, '_appId');
    __publicField(this, '_appSecret');
    __publicField(this, '_lastRequestAppAccessTokenExpiredTime');
    __publicField(this, '_appAccessToken');
    this._appId = options.appId;
    this._appSecret = options.appSecret;
  }

  async getAndSaveAppAccessToken() {
    const now = Date.now();
    if (
      this._appAccessToken &&
      typeof this._lastRequestAppAccessTokenExpiredTime === 'number' &&
      now > this._lastRequestAppAccessTokenExpiredTime
    ) {
      return this._appAccessToken;
    }
    const response = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          app_id: this._appId,
          app_secret: this._appSecret,
        }),
      },
    );
    const parsed = AppAccessTokenResultSchema.safeParse(await response.json());
    if (parsed.success && parsed.data.code === 0) {
      this._appAccessToken = parsed.data.app_access_token;
      this._lastRequestAppAccessTokenExpiredTime =
        now + parsed.data.expire * 1e3;
      return parsed.data.app_access_token;
    } else {
      throw new HTTPException(500, { res: response });
    }
  }
};
function getOrCreateClient(c) {
  const { env } = c;
  if (client) {
    return client;
  }
  const newOne = new Client({
    appId: env.FEISHU_UPLOAD_APP_ID,
    appSecret: env.FEISHU_UPLOAD_APP_SECRET,
  });
  client = newOne;
  return client;
}

// src/services/feishu/index.ts
const feishu = new Hono2();
feishu.post(
  '/access-token',
  zValidator(
    'json',
    z.object({
      code: z.string(),
    }),
  ),
  async ctx => {
    const body = ctx.req.valid('json');
    const client2 = getOrCreateClient(ctx);
    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: body.code,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await client2.getAndSaveAppAccessToken()}`,
        },
      },
    );
    const responseJson = await response.json();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);
feishu.post(
  '/refresh-token',
  zValidator(
    'json',
    z.object({
      refresh_token: z.string(),
    }),
  ),
  async ctx => {
    const body = ctx.req.valid('json');
    const client2 = getOrCreateClient(ctx);
    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/oidc/refresh_access_token',
      {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: body.refresh_token,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await client2.getAndSaveAppAccessToken()}`,
        },
      },
    );
    const responseJson = await response.json();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);
const AuthorizationHeaderSchema = z.object({
  authorization: z.string().startsWith('Bearer u-'),
});
feishu.get(
  '/profile',
  zValidator('header', AuthorizationHeaderSchema),
  async ctx => {
    const header = ctx.req.valid('header');
    const response = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/user_info',
      {
        headers: {
          Authorization: header.authorization,
        },
      },
    );
    const responseJson = await response.json();
    return ctx.json(responseJson, responseJson.code !== 0 ? 500 : 200);
  },
);
feishu.get(
  '/latest-copilots',
  zValidator('header', AuthorizationHeaderSchema),
  zValidator(
    'query',
    z.object({
      pageSize: z.coerce.number(),
    }),
  ),
  async ctx => {
    const header = ctx.req.valid('header');
    const query = ctx.req.valid('query');
    const { env } = ctx;
    const params = new URLSearchParams();
    params.append('page_size', `${query.pageSize}`);
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${
        env.FEISHU_COPILOT_APP_ID
      }/tables/${
        env.FEISHU_COPILOT_HEAD_TABLE_ID
      }/records/search?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          Authorization: header.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sort: [
            {
              desc: true,
              field_name: 'created_time',
            },
          ],
        }),
      },
    );
    const responseJson = await response.json();
    const formattedData = get_default(responseJson.data, ['items'], []);
    if (Array.isArray(formattedData)) {
      return ctx.json({
        ...responseJson,
        data: formattedData
          .map(item => {
            const fields = get_default(item, 'fields');
            if (fields) {
              const values = pick_default(fields, [
                'created_time',
                'created_by',
                'copilot_id',
                'term_id',
                'href',
                'score',
              ]);
              return mapValues_default(values, val => {
                if (
                  Array.isArray(val) &&
                  get_default(val, [0, 'type']) === 'text'
                ) {
                  return get_default(val, [0, 'text']);
                }
                return val;
              });
            }
            return void 0;
          })
          .filter(Boolean),
      });
    }
    return ctx.json(
      {
        ...responseJson,
        data: [],
      },
      500,
    );
  },
);
const feishu_default = feishu;

// src/index.ts
const app = new Hono2().basePath('/api-worker');
app.use(logger());
app.route('/feishu', feishu_default);
const onRequest = ctx => {
  return app.fetch(ctx.request, ctx.env, ctx);
};
export { onRequest };
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
