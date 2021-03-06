/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
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

import Theme from 'web/utils/theme';

import PropTypes from 'web/utils/proptypes';
import withIconSize from 'web/components/icon/withIconSize';

let StyledCloseButton = styled.div`
  display: flex;
  border: 1px solid ${Theme.darkGreen};
  font-weight: bold;
  font-size: 12px;
  font-family: ${Theme.Font.default};
  color: ${Theme.darkGreen};
  cursor: pointer;
  background: ${Theme.lighGreen};
  border-radius: 4px;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  :hover {
    color: ${Theme.white};
    background: ${Theme.darkGreen};
  };
`;

StyledCloseButton = withIconSize('medium')(StyledCloseButton);

const CloseButton = ({
  size,
  title = _('Close'),
  ...props
}) => (
  <StyledCloseButton
    {...props}
    size={size}
    title={title}
  >
    ×{/* Javascript unicode: \u00D7 */}
  </StyledCloseButton>
);

CloseButton.propTypes = {
  size: PropTypes.iconSize,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;

// vim: set ts=2 sw=2 tw=80:
