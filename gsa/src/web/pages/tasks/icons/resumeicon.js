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

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities.js';

import Icon from 'web/components/icon/icon.js';

const ResumeIcon = ({
  capabilities,
  size,
  task,
  onClick,
}) => {
  if (task.isContainer()) {
    return (
      <Icon
        size={size}
        img="resume_inactive.svg"
        alt={_('Resume')}
        title={_('Task is a container')}
      />
    );
  }

  if (isDefined(task.schedule)) {
    return (
      <Icon
        size={size}
        img="resume_inactive.svg"
        alt={_('Resume')}
        title={_('Task is scheduled')}
      />
    );
  }

  if (task.isStopped() || task.isInterrupted()) {
    if (capabilities.mayOp('resume_task')) {
      return (
        <Icon
          size={size}
          title={_('Resume')}
          img="resume.svg"
          value={task}
          onClick={onClick}
        />
      );
    }
    return (
      <Icon
        size={size}
        img="resume_inactive.svg"
        alt={_('Resume')}
        title={_('Permission to resume task denied')}
      />
    );
  }

  return (
    <Icon
      size={size}
      img="resume_inactive.svg"
      alt={_('Resume')}
      title={_('Task is not stopped')}
    />
  );
};

ResumeIcon.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  size: PropTypes.iconSize,
  task: PropTypes.model.isRequired,
  onClick: PropTypes.func,
};

export default withCapabilities(ResumeIcon);

// vim: set ts=2 sw=2 tw=80:
