/* Greenbone Security Assistant
 *
 * Authors:
 * Steffen Waterkamp <steffen.watekamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
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

import {CERTBUND_FILTER_FILTER} from 'gmp/models/filter';

import Theme from 'web/utils/theme';

import DataTableDisplay from 'web/components/dashboard/display/datatabledisplay'; // eslint-disable-line max-len
import transformCreated from 'web/components/dashboard/display/created/createdtransform'; // eslint-disable-line max-len
import CreatedDisplay from 'web/components/dashboard/display/created/createddisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {CertBundCreatedLoader} from './loaders';

export const CertBundCreatedDisplay = createDisplay({
  loaderComponent: CertBundCreatedLoader,
  displayComponent: CreatedDisplay,
  title: ({data: tdata}) => _('CERT-Bund Advisories by Creation Time'),
  yAxisLabel: _('# of created CERT-Bund Advisories'),
  y2AxisLabel: _('Total CERT-Bund Advisories'),
  xAxisLabel: _('Time'),
  yLine: {
    color: Theme.darkGreen,
    label: _('Created CERT-Bund Advs'),
  },
  y2Line: {
    color: Theme.darkGreen,
    dashArray: '3, 2',
    label: _('Total CERT-Bund Advs'),
  },
  displayId: 'cert_bund_adv-by-created',
  displayName: 'CertBundCreatedDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

export const CertBundCreatedTableDisplay = createDisplay({
  loaderComponent: CertBundCreatedLoader,
  displayComponent: DataTableDisplay,
  title: ({data: tdata}) => _('CERT-Bund Advisories by Creation Time'),
    dataTitles: [
      _('Creation Time'),
      _('# of CERT-Bund Advs'),
      _('Total CERT-Bund Advs')],
  dataRow: row => [row.label, row.y, row.y2],
  dataTransform: transformCreated,
  displayId: 'cert_bund_adv-by-created-table',
  displayName: 'CertBundCreatedTableDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

registerDisplay(CertBundCreatedTableDisplay.displayId,
  CertBundCreatedTableDisplay, {
    title: _('Table: CERT-Bund Advisories by Creation Time'),
  });

registerDisplay(CertBundCreatedDisplay.displayId,
  CertBundCreatedDisplay, {
    title: _('Chart: CERT-Bund Advisories by Creation Time'),
  });

// vim: set ts=2 sw=2 tw=80:
