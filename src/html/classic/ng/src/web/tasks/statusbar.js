/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 Greenbone Networks GmbH
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

import '../css/statusbar.css';

const TaskStatusBar = props => {
  let {status = 'Unknown', progress = '0'} = props;
  let text = status;
  let st = status.toLowerCase();
  let css_class = st;

  if (st === 'new' || st === 'done' || st === 'container' ||
      st.indexOf('requested') !== -1) {
    progress = '100';
  }

  let style = {
    width: progress + 'px',
  };

  if (st === 'stopped' || st.indexOf('requested') !== -1) {
    css_class = 'request';
  }
  else if (st.indexOf('error') !== -1) {
    css_class = 'error';
  }
  else if (st === 'uploading' || st === 'container') {
    css_class = 'done';
  }

  if (st === 'stopped') {
    text = status + ' at ' + progress + ' %';
  }
  else if (st === 'running') {
    text = progress + ' %';
  }

  return (
    <div className="statusbar statusbar-box" title={status}>
      <div className={'statusbar ' + css_class} style={style}></div>
      <p>{text}</p>
    </div>
  );
};

TaskStatusBar.propTypes = {
  status: React.PropTypes.string,
  progress: React.PropTypes.string,
  suffix: React.PropTypes.string,
};

export default TaskStatusBar;

// vim: set ts=2 sw=2 tw=80: