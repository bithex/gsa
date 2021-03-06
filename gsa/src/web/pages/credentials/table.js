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
import _ from 'gmp/locale';

import {createEntitiesFooter} from '../../entities/footer.js';
import {createEntitiesHeader} from '../../entities/header.js';
import {createEntitiesTable} from '../../entities/table.js';
import withRowDetails from '../../entities/withRowDetails.js';

import CredentialDetails from './details.js';
import Row from './row.js';

export const SORT_FIELDS = [
  ['name', _('Name'), '36%'],
  ['type', _('Type'), '31%'],
  ['allow_insecure', _('Allow insecure use'), '10%'],
  ['login', _('Login'), '15%'],
];

const CredentialsTable = createEntitiesTable({
  emptyTitle: _('No credentials available'),
  header: createEntitiesHeader(SORT_FIELDS),
  row: Row,
  rowDetails: withRowDetails('credential', 10)(CredentialDetails),
  footer: createEntitiesFooter({
    download: 'credentials.xml',
    span: 6,
    trash: true,
  }),
});

export default CredentialsTable;

// vim: set ts=2 sw=2 tw=80:
