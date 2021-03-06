/* Greenbone Security Assistant
 *
 * Authors:
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
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
import 'core-js/fn/object/values';

import React from 'react';

import {withRouter} from 'react-router-dom';

import _ from 'gmp/locale';

import {isDefined, hasValue} from 'gmp/utils/identity';

import {HOSTS_FILTER_FILTER} from 'gmp/models/filter';

import PropTypes from 'web/utils/proptypes';
import compose from 'web/utils/compose';

import TopologyChart from 'web/components/chart/topology';
import DataDisplay from 'web/components/dashboard/display/datadisplay';
import withFilterSelection from 'web/components/dashboard/display/withFilterSelection'; // eslint-disable-line max-len
import {registerDisplay} from 'web/components/dashboard/registry';

import {HostsTopologyLoader} from './loaders';

const transformTopologyData = (data = []) => {
  if (!hasValue(data)) {
    return {};
  }

  const hostsObject = {};
  const routes = new Set();
  const links = [];

  data.forEach(host => {
    const {name, severity, isScanner, details, id} = host;
    const {traceroute} = details;

    hostsObject[name] = {
      id: name,
      uuid: id,
      name,
      severity,
      isScanner,
      links: [],
    };

    if (isDefined(traceroute)) {
      const splitTraceroute = traceroute.value.split(',');

      for (let i = splitTraceroute.length - 1; i > 0; i--) {
        const source = splitTraceroute[i];
        let target = splitTraceroute[i - 1];

        if (target === '* * *' && source === '* * *') {
          continue;
        }

        if (target === '* * *' && i > 1) {
          target = splitTraceroute[i - 2];
        }

        const route = `${source}>${target}`;

        if (routes.has(route)) {
          continue;
        }

        routes.add(route);

        const newLink = {
          source,
          target,
        };

        const sourceHost = hostsObject[source];

        if (isDefined(sourceHost)) {
          sourceHost.links.push(newLink);
        }
        else {
          hostsObject[source] = {
            id: source,
            name: source,
            links: [newLink],
          };
        }

        const targetHost = hostsObject[target];

        if (isDefined(targetHost)) {
          targetHost.links.push(newLink);
        }
        else {
          hostsObject[target] = {
            id: target,
            name: target,
            links: [newLink],
          };
        }

        links.push(newLink);
      }
    };
  });

  const hosts = Object.values(hostsObject);
  return {hosts, links};
};

export class HostsTopologyDisplay extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleDataClick = this.handleDataClick.bind(this);
  }

  handleDataClick(data) {
    const {history} = this.props;

    history.push(`/host/${data.id}`);
  }

  render() {
    const {
      filter,
      ...props
    } = this.props;
    return (
      <HostsTopologyLoader
        filter={filter}
      >
        {loaderProps => (
          <DataDisplay
            {...props}
            {...loaderProps}
            filter={filter}
            dataTransform={transformTopologyData}
            title={() => _('Hosts Topology')}
          >
            {({width, height, data: tdata, svgRef}) => (
              <TopologyChart
                svgRef={svgRef}
                width={width}
                height={height}
                data={tdata}
                onDataClick={this.handleDataClick}
              />
            )}
          </DataDisplay>
        )}
      </HostsTopologyLoader>
    );
  }
}

HostsTopologyDisplay.propTypes = {
  filter: PropTypes.filter,
  history: PropTypes.object.isRequired,
};

const DISPLAY_ID = 'host-by-topology';

HostsTopologyDisplay = compose(
  withRouter,
  withFilterSelection({
    filtersFilter: HOSTS_FILTER_FILTER,
  }),
)(HostsTopologyDisplay);

HostsTopologyDisplay.displayId = DISPLAY_ID;

registerDisplay(DISPLAY_ID, HostsTopologyDisplay, {
  title: _('Chart: Hosts Topology'),
});

// vim: set ts=2 sw=2 tw=80:
