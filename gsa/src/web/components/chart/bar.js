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

import styled from 'styled-components';

import {scaleBand, scaleLinear} from 'd3-scale';

import {shorten} from 'gmp/utils/string';
import {isDefined} from 'gmp/utils/identity';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';

import Axis from './axis';
import Group from './group';
import Legend from './legend';
import ToolTip from './tooltip';
import Svg from './svg';

const StyledLayout = styled(Layout)`
  overflow: hidden;
`;

const LEGEND_MARGIN = 20;

const margin = {
  top: 40,
  right: 20,
  bottom: 40,
  left: 60,
};

const MAX_LABEL_LENGTH = 25;
const LABEL_HEIGHT = 10;

const tickFormat = val => {
  return shorten(val.toString(), MAX_LABEL_LENGTH);
};

class BarChart extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.data !== nextProps.data;
  }

  render() {
    const {
      data = [],
      displayLegend = true,
      height,
      xLabel,
      yLabel,
      horizontal = false,
      svgRef,
      onDataClick,
      onLegendItemClick,
    } = this.props;
    let {width} = this.props;

    if (this.legend) {
      const {width: legendWidth} = this.legend.getBoundingClientRect();
      width = width - legendWidth - LEGEND_MARGIN;
    }

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    const yMax = Math.max(...yValues);

    const maxLabelLength = Math.max(...xValues.map(
      val => val.toString().length), MAX_LABEL_LENGTH);

    // adjust left margin for label length on horizontal bars
    // 4px for each letter is just a randomly chosen value
    const marginLeft = horizontal ? margin.left +
      Math.min(MAX_LABEL_LENGTH, maxLabelLength) * 4 : margin.left;

    const maxWidth = width - marginLeft - margin.right;
    let maxHeight = height - margin.top - margin.bottom;

    if (isDefined(xLabel)) {
      // adjust height for x axis label
      maxHeight = maxHeight - LABEL_HEIGHT;
    }

    const xScale = scaleBand()
      .rangeRound(horizontal ? [maxHeight, 0] : [0, maxWidth])
      .domain(xValues)
      .padding(0.125);

    const yScale = scaleLinear()
      .range(horizontal ? [0, maxWidth] : [maxHeight, 0])
      .domain([0, yMax])

      /*
        nice seems to round first and last value.
        see https://github.com/d3/d3-scale/blob/master/README.md#continuous_nice
        the old version did call nice(10) which isn't possible with vx at the moment.
      */
      .nice();

    return (
      <StyledLayout align={['start', 'start']}>
        <Svg
          innerRef={svgRef}
          width={width}
          height={height}
        >
          <Group top={margin.top} left={marginLeft}>
            <Axis
              orientation="left"
              scale={horizontal ? xScale : yScale}
              top={0}
              left={0}
              label={yLabel}
              numTicks={10}
              tickFormat={horizontal ? tickFormat : undefined}
            />
            <Axis
              orientation="bottom"
              scale={horizontal ? yScale : xScale}
              top={maxHeight}
              label={xLabel}
            />
            {data.map((d, i) => (
              <ToolTip
                key={i}
                content={d.toolTip}
              >
                {({targetRef, hide, show}) => (
                  <Group
                    onClick={isDefined(onDataClick) ?
                      () => onDataClick(d) : undefined}
                  >
                    <rect
                      ref={targetRef}
                      fill={d.color}
                      x={horizontal ? 1 : xScale(d.x)}
                      y={horizontal ? xScale(d.x) : yScale(d.y)}
                      height={
                        horizontal ?
                          xScale.bandwidth() :
                          maxHeight - yScale(d.y)
                      }
                      width={
                        horizontal ?
                          yScale(d.y) :
                          xScale.bandwidth()
                      }
                      onMouseEnter={show}
                      onMouseLeave={hide}
                    />
                  </Group>
                )}
              </ToolTip>
            ))}
          </Group>
        </Svg>
        {displayLegend && data.length > 0 &&
          <Legend
            innerRef={ref => this.legend = ref}
            data={data}
            onItemClick={onLegendItemClick}
          />
        }
      </StyledLayout>
    );
  }
}

BarChart.propTypes = {
  /*
    Required array structure for data:

    [{
      x: ...,
      y: ...,
      toolTip: ...,
      color: ...,
      label: ...,
    }]
  */
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.toString.isRequired,
    y: PropTypes.number.isRequired,
    label: PropTypes.any,
    color: PropTypes.toString.isRequired,
    toolTip: PropTypes.elementOrString,
  })).isRequired,
  displayLegend: PropTypes.bool,
  height: PropTypes.number.isRequired,
  horizontal: PropTypes.bool,
  svgRef: PropTypes.ref,
  width: PropTypes.number.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  onDataClick: PropTypes.func,
  onLegendItemClick: PropTypes.func,
};

export default BarChart;

// vim: set ts=2 sw=2 tw=80:
