/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
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
import React from 'react';

import {connect} from 'react-redux';

import _ from 'gmp/locale';

import PropTypes from '../../utils/proptypes';

import Loading from '../../components/loading/loading';

import * as fromDashboardData from 'web/components/dashboard2/data/selectors';

import Display, {
  DISPLAY_HEADER_HEIGHT,
} from 'web/components/dashboard2/display';

let ChartDisplay = ({
  children,
  data,
  height,
  id,
  isLoading = false,
  title,
  width,
  onRemoveClick,
}) => {
  height = height - DISPLAY_HEADER_HEIGHT;
  return (
    <Display
      title={isLoading ? _('Loading') : title({data, id})}
      onRemoveClick={onRemoveClick}
    >
      {isLoading ?
        <Loading/> :
        children({
          id,
          data,
          width,
          height,
        })
      }
    </Display>
  );
};

ChartDisplay.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.object,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
};

const mapStateToProps = (rootState, {dataId}) => {
  const state = fromDashboardData.getDashboardDataById(rootState, dataId);
  return {
    data: fromDashboardData.getData(state),
    isLoading: fromDashboardData.getIsLoading(state),
  };
};

ChartDisplay = connect(mapStateToProps)(ChartDisplay);

export default ChartDisplay;

// vim: set ts=2 sw=2 tw=80:
