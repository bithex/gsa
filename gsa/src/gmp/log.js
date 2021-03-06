/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 - 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import 'core-js/fn/object/entries';
import 'core-js/fn/object/values';

import {isDefined, isString} from './utils/identity';

export const DEFAULT_LOG_LEVEL = 'error';

const GREENBONE_GREEN = '#66c430';

export const LogLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5,
};

const isValidLogLevel = level => isString(level) &&
  level.toLowerCase() in LogLevels;

const getLogLevel = loglevel => isValidLogLevel(loglevel) ?
  LogLevels[loglevel.toLowerCase()] : undefined;

function noop() {};

/* eslint-disable no-console */

class Logger {

  constructor(name, level = DEFAULT_LOG_LEVEL) {
    this.name = name;
    this.setDefaultLevel(level);
  }

  _updateLogging(newLogValue) {
    for (const [logName, logValue] of Object.entries(LogLevels)) {
      if (logValue === LogLevels.silent) {
        continue;
      }

      this[logName] = logValue < newLogValue ? noop : (...args) => { // eslint-disable-line no-loop-func
        return console[logName]('%c' + this.name, 'color: ' + GREENBONE_GREEN,
          ...args);
      };
    }
  }

  setDefaultLevel(level) {
    let logValue = getLogLevel(level);

    if (!isDefined(logValue)) {
      console.error('Unknown loglevel ', level, ' for Logger ', this.name);
      logValue = LogLevels.silent;
    }

    this.defaultLogValue = logValue;

    if (!isDefined(this.logValue)) {
      this._updateLogging(logValue);
    }
  }

  setLevel(level) {
    let logValue = getLogLevel(level);

    if (!isDefined(logValue)) {
      console.error('Unknown loglevel ', level, ' for Logger ', this.name);
      logValue = LogLevels.silent;
    }

    this.logValue = logValue;

    this._updateLogging(logValue);
  }
}

export class RootLogger {

  constructor() {
    this.loggers = {};
    this.level = DEFAULT_LOG_LEVEL;
  }

  init({loglevel}) {
    return this.setDefaultLevel(loglevel);
  }

  setDefaultLevel(level) {
    if (isValidLogLevel(level)) {
      level = level.toLowerCase();
      this.level = level;
      for (const logger of Object.values(this.loggers)) {
        logger.setDefaultLevel(level);
      }
      return true;
    }
    return false;
  }

  getLogger(name) {
    name = isString(name) ? name : 'unknown';
    let logger = this.loggers[name];

    if (!isDefined(logger)) {
      logger = new Logger(name, this.level);
      this.loggers[name] = logger;
    }
    return logger;
  }
}

/* eslint-enable no-console */

const logger = new RootLogger();

export default logger;

// vim: set ts=2 sw=2 tw=80:
