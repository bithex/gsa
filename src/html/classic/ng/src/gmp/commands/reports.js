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

import logger from '../log.js';

import {EntitiesCommand, EntityCommand, register_command} from '../command.js';

import Report from '../models/report.js';

const log = logger.getLogger('gmp.commands.reports');

export class ReportsCommand extends EntitiesCommand {

  constructor(http) {
    super(http, 'report', Report);
  }

  getEntitiesResponse(root) {
    return root.get_reports.get_reports_response;
  }
}

export class ReportCommand extends EntityCommand {

  constructor(http) {
    super(http, 'report', Report);
  }

  import(args) {
    let {task_id, in_assets = 1, xml_file} = args;
    log.debug('Importing report', args);
    return this.httpPost({
      cmd: 'import_report',
      next: 'get_report',
      task_id,
      in_assets,
      xml_file,
    });
  }
}

register_command('report', ReportCommand);
register_command('reports', ReportsCommand);

// vim: set ts=2 sw=2 tw=80:
