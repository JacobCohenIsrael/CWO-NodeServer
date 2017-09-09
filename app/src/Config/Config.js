import common_config from "./common_config";

export default class Config
{
	constructor() {
		this.config = common_config;
	}

	/**
	 *
	 * @param {string} key
	 * @returns {*}
	 */
	get(key) {
		return this.config[key];
	}

	set(key, value) {
		this.config[key] = value;
	}
}
