/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
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
import logger from '../log';
import {isArray, isDefined} from '../utils/identity';

const log = logger.getLogger('gmp.locale.detector');

export const BROWSER_LANGUAGE = 'Browser Language';

const detectLanguageFromStorage = options => options.storage.locale;

const detectLanguageFromNavigator = () => {
  if (typeof navigator !== 'undefined') {
    if (navigator.languages) {
      return [...navigator.languages];
    }
    if (navigator.language) {
      return navigator.language;
    }
    if (navigator.userLanguage) {
      return navigator.userLanguage;
    }
  }

  return undefined;
};

class LanguageDetector {

  static type = 'languageDetector';

  init(services, options = {}, i18nOptions = {}) {
    this.services = services;
    this.options = {
      ...i18nOptions,
      ...options,
    };
  }

  detect(...options) {
    const detectors = [detectLanguageFromStorage, detectLanguageFromNavigator];
    let detected = [];

    for (const detector of detectors) {
      const lookup = detector(this.options);
      if (isArray(lookup)) {
        detected = [
          ...detected,
          ...lookup,
        ];
      }
      else {
        detected.push(lookup);
      }
    }

    detected = detected.filter(l => isDefined(l) && l !== BROWSER_LANGUAGE);

    let lang;
    for (const l of detected) {
      const cleaned = this.services.languageUtils.formatLanguageCode(l);
      if (this.services.languageUtils.isWhitelisted(cleaned)) {
        lang = cleaned;
        break;
      }
    }

    if (!isDefined(lang)) {
      const {fallbackLng} = this.options;
      lang = isArray(fallbackLng) ? fallbackLng[0] : fallbackLng;
    }

    log.debug('Detected language', lang);
    return lang;
  }

  cacheUserLanguage() {
    // don't cache anything
  }
}

export default LanguageDetector;

// vim: set ts=2 sw=2 tw=80:
