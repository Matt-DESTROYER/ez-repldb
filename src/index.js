let _url = process.env.REPLIT_DB_URL || "";
const _host = "kv.replit.com";
let _path = _url.substr(21);

const _cache = new Map();
const _cacheProxy = new Proxy(_cache, Object.freeze({
	get(cache, key, value) {
		if (value) {
			return db.set(key, value);
		}
		return cache.get(prop);
	}
}));
let _cachingEnabled = true;

const db = {
	get url() { return _url; },
	set url(value) {
		_url = value;
		_path = _url.substr(21);
	},
	get host() { return _host; },
	set host(value) { },
	get path() { return _path; },
	set path(value) { },
	get cache() { return _cacheProxy; },
	set cache(value) { },
	get cachingEnabled() { return _cachingEnabled; },
	set cachingEnabled(value) { _cachingEnabled = Boolean(value); },
	get: (...args) => new Promise(function(resolve, reject) {
		if (args.length === 0) {
			resolve(null);
		} else if (args.length === 1) {
			if (_cachingEnabled && _cache.get(args[0])) {
				return resolve(_cache.get(args[0]));
			}
			fetch(_url + "/" + encodeURIComponent(args[0].toString())).then(function(t) {
				return t.text()
			}).then(function(n) {
				resolve(_cacheProxy[args[0]] = JSON.parse(n))
			}).catch(function() {
				resolve(null)
			})
		} else {
			let n = Array(args.length);
			for (let r = 0; r < args.length; r++) {
				let c = r;
				n[c] = new Promise(function(e) {
					if (_cachingEnabled && args[c] in _cacheProxy) return e(_cacheProxy[args[c]]);
					fetch(_url + "/" + encodeURIComponent(args[c].toString())).then(function(t) {
						return t.text()
					}).then(function(n) {
						e(_cacheProxy[args[c]] = JSON.parse(n))
					}).catch(function() {
						e(null)
					})
				})
			}
			Promise.all(n).then(function(t) {
				resolve(t)
			})
		}
	}),
	set(...args) {
		let e = [];
		for (let i = 0; i < args.length - 1; i += 2) {
			_cacheProxy[args[i]] = args[i + 1];
			e.push(encodeURIComponent(args[i].toString()) + "=" + encodeURIComponent(JSON.stringify(args[i + 1])));
		}
		return fetch(_url + "?" + e.join("&"), {
			method: "POST"
		})
			.then(function() {
				return true
			})
			.catch(function() {
				return false
			});
	},
	delete: (...args) => new Promise(function(e) {
		if (0 === args.length) e(true);
		else if (1 === args.length) args[0] in _cacheProxy && delete _cacheProxy[args[0]], fetch(_url + "/" + encodeURIComponent(args[0].toString()), {
			method: "DELETE"
		}).then(function() {
			e(true)
		}).catch(function() {
			e(false)
		});
		else {
			let n = Array(args.length);
			for (let r = 0; r < args.length; r++) n[r] = new Promise(function(e) {
				args[r] in _cacheProxy && delete _cacheProxy[args[r]], fetch(_url + "/" + encodeURIComponent(args[r].toString()), {
					method: "DELETE"
				}).then(function() {
					e(true)
				}).catch(function() {
					e(false)
				})
			});
			Promise.all(n).then(function(t) {
				e(t)
			})
		}
	}),
	list: (path = "") => fetch(_url + "?encode=true&prefix=" + encodeURIComponent(path.toString())).then(function(t) {
		return t.text()
	}).then(function(t) {
		if ("" === t) return [];
		let e = t.split("\n");
		for (let n = 0; n < e.length; n++) e[n] = decodeURIComponent(e[n]);
		return e
	}).catch(function() {
		return []
	}),
	getAll() {
		if (_cachingEnabled) {
			return new Promise(function(t, e) {
				let n = {};
				for (let r in _cacheProxy) n[r] = _cacheProxy[r];
				t(n)
			});
		}
		let t = {};
		return fetch(_url + "?encode=true&prefix=").then(function(t) {
			return t.text()
		}).then(function(e) {
			if ("" === e) return t;
			let n = e.split("\n");
			for (let r = 0; r < n.length; r++) n[r] = decodeURIComponent(n[r]);
			let c = [];
			for (let u = 0; u < n.length; u++) {
				let l = n[u];
				c.push(fetch(_url + "/" + encodeURIComponent(l.toString())).then(function(t) {
					return t.text()
				}).then(function(e) {
					return e = JSON.parse(e), _cacheProxy[l] = e, t[l] = e, t[l]
				}).catch(function() {
					return t[l] = _cacheProxy[l] || null, t[l]
				}))
			}
			return Promise.all(c).then(function() {
				return console.log(t), t
			}).catch(function() {
				return t
			})
		}).catch(function() {
			return t
		})
	},
	cache: () => fetch(_url + "?encode=true&prefix=").then(function(t) {
		return t.text()
	}).then(function(t) {
		if ("" === t) return true;
		let e = t.split("\n");
		for (let n = 0; n < e.length; n++) e[n] = decodeURIComponent(e[n]);
		let r = [];
		for (let c = 0; c < e.length; c++) {
			let u = c;
			r.push(fetch(_url + "/" + encodeURIComponent(e[u].toString())).then(function(t) {
				return t.text()
			}).then(function(t) {
				return _cacheProxy[e[u]] = JSON.parse(t)
			}).catch(function() {
				return null
			}))
		}
		return Promise.all(r).then(function() {
			return true
		}).catch(function() {
			return false
		})
	}).catch(function() {
		return false
	}),
	clear: () => fetch(_url + "?encode=true&prefix=").then(function(t) {
		return t.text()
	}).then(function(t) {
		if ("" === t) return [];
		let e = t.split("\n");
		for (let n = 0; n < e.length; n++) e[n] = decodeURIComponent(e[n]);
		let r = [];
		for (let c = 0; c < e.length; c++) {
			let u = c;
			r.push(new Promise(function(t) {
				fetch(_url + "/" + encodeURIComponent(e[u]), {
					method: "DELETE"
				}).then(function() {
					keys[u] in _cacheProxy && delete _cacheProxy[keys[u]], t(true)
				}).catch(function() {
					t(false)
				})
			}))
		}
		return Promise.all(r).then(function(t) {
			return t
		}).catch(function(t) {
			return t
		})
	}),
	getObject(t) {
		let e = [];
		for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e.push(new Promise(function(e) {
			fetch(_url + "/" + encodeURIComponent(n)).then(function(t) {
				return t.text()
			}).then(function(r) {
				_cacheProxy[n] = t[n] = JSON.parse(r), e()
			}).catch(function() {
				_cacheProxy[n] = t[n] = t[n] || null, e()
			})
		}));
		return Promise.all(e).then(function() {
			return t
		}).catch(function() {
			return t
		})
	},
	applyObject(t) {
		let e = [];
		for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && (_cacheProxy[n] = t[n], e.push(n + "=" + decodeURIComponent(JSON.stringify(t[n]))));
		return fetch(_url + "?" + e.join("&"), {
			method: "POST"
		}).then(function() {
			return true
		}).catch(function() {
			return false
		})
	},
	import: t => fetch(t + "?encode=true&prefix=").then(function(t) {
		return t.text()
	}).then(function(e) {
		if ("" === e) return console.log("Input database is empty."), true;
		let n = e.split("\n"),
			r = Array(n.length),
			c = [];
		for (let u = 0; u < n.length; u++) {
			let l = u;
			n[l] = decodeURIComponent(n[l]), c.push(fetch(t + "/" + encodeURIComponent(n[l])).then(function(t) {
				return t.text()
			}).then(function(t) {
				return _cacheProxy[n[l]] = r[l] = JSON.parse(t)
			}).catch(function() {
				return _cacheProxy[n[l]] = r[l] = null
			}))
		}
		return Promise.all(c).then(function() {
			let t = [];
			for (let e = 0; e < n.length; e++) t.push(encodeURIComponent(n[e].toString()) + "=" + encodeURIComponent(JSON.stringify(r[e])));
			return fetch(_url + "?" + t.join("&"), {
				method: "POST"
			}).then(function() {
				console.log("Imported the following keys: " + n.map(function(t) {
					return '"' + t + '"'
				}).join(", "));
				for (let t = 0; t < r.length; t++) null !== r[t] && (n.splice(t, 1), r.splice(t, 1));
				return n.length > 0 && console.warn("The following keys returned null values (this may indicate an error at some point during the import process or in the processes that generated these keys in the first place): " + n.map(function(t) {
					return '"' + t + '"'
				}).join(", ")), true
			}).catch(function() {
				return console.warn("An unexpected error occurred attempting to set the key-value pairs in the current database."), false
			})
		}).catch(function() {
			return console.warn("An unexpected error occurred reading from the input database (please ensure you use the correct URL)."), false
		})
	}).catch(function() {
		return console.warn("An unexpected error occurred reading from the input database (please ensure you use the correct URL)."), false
	})
};

module.exports = db;
