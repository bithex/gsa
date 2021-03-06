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
import {parseInt} from 'gmp/parser';

import moment from 'gmp/models/date';

import {isDefined} from 'gmp/utils/identity';

class Login {

  constructor(elem) {
    this.clientAddress = elem.client_address;
    this.guest = elem.guest;
    this.locale = elem.i18n;
    this.role = elem.role;
    this.severity = elem.severity;
    this.timezone = elem.timezone;
    this.token = elem.token;
    this.vendorVersion = elem.vendor_version;
    this.version = elem.version;

    const unixSeconds = parseInt(elem.session);

    this.sessionTimeout = isDefined(unixSeconds) ?
      moment.unix(unixSeconds) : undefined;
  }
}

export default Login;

// vim: set ts=2 sw=2 tw=80:
