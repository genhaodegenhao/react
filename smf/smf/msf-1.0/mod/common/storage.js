let sessionStorage = window.sessionStorage || {};
let localStorage = window.localStorage || {};
function copy(o, sub) {
	let key, value;
	for (key in sub) {
		value = sub[key];
		if (typeof value === "function") {
			o.__proto__[key] = value;
		} else {
			o[key] = value;
		}
	}
	return o;
}
let storage = {
	_vstr: function (key, fun) {
		let sf  = this["__stringify__"],
		    jk  = "!" + key,
		    ind = sf.indexOf(jk);
		if (fun == "set") {
			if (ind === -1) {
				return (this["__stringify__"] += jk);
			}
			else {
				return this["__stringify__"];
			}
		}
		else if (fun == "get") {
			if (ind === -1) {
				return false;
			}
			else {
				return this["__stringify__"];
			}
		}
		else if (fun == "del") {
			if (ind === -1) {
				return this["__stringify__"];
			}
			else {
				return (this["__stringify__"] = this["__stringify__"].replace(jk, ""));
			}
		}
	},
	set  : function (key, value) {
		if (typeof value === "string") {
			this[key] = value;
		} else {
			this[key] = JSON.stringify(value);
			this._vstr(key, "set");
		}
	},
	get  : function (key, def) {
        let value;
		try {
			if (this._vstr(key, "get")) {
				value = JSON.parse(this[key]);
			} else {
				value = this[key];
			}
		} catch (error) {
			value = this[key];
		}
		if (!value && def) {
			this.set(key, def);
			return def;
		}
		return value;
	},
	del  : function (key) {
		this._vstr(key, "del");
		return this.removeItem(key);
	}
};
let session = copy(sessionStorage, storage),
    local   = copy(localStorage, storage);
session.get("__stringify__", "__stringify__");
local.get("__stringify__", "__stringify__");
module.exports = {
	session: session,
	local  : local
};
