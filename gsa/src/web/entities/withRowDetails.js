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

import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import {isFunction} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';

import Theme from 'web/utils/theme';

import Icon from 'web/components/icon/icon';

import Layout from 'web/components/layout/layout';

import DetailsLink from 'web/components/link/detailslink';

import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

const Indent = styled.div`
  display: flex;
  width: 3em;
  border-right: 2px solid ${Theme.black};
  margin-right: 1em;
  flex-shrink: 0; /* don't shrink at all */
`;

Indent.displayName = 'Indent';

const StyledTableRow = styled(TableRow)`
  &, &:hover {
    background-color: ${Theme.white} !important;
  };
`;

const withRowDetails = (type, colSpan = '10') => Component => {
  const RowDetailsWrapper = ({entity, links = true, ...props}) => (
    <StyledTableRow>
      <TableData
        colSpan={colSpan}
        flex
        align={['start', 'stretch']}
      >
        {links &&
          <Layout flex align={['start', 'start']}>
            <DetailsLink
              type={isFunction(type) ? type(entity) : type}
              id={entity.id}
            >
              <Icon
                img="details.svg"
                size="small"
                title={_('Open all details')}
              />
            </DetailsLink>
          </Layout>
        }
        <Indent/>
        <Component
          {...props}
          links={links}
          entity={entity}
        />
      </TableData>
    </StyledTableRow>
  );

  RowDetailsWrapper.propTypes = {
    entity: PropTypes.model.isRequired,
    links: PropTypes.bool,
  };
  return RowDetailsWrapper;
};

export default withRowDetails;

// vim: set ts=2 sw=2 tw=80:
