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

import State from '../../utils/state.js';
import PropTypes from '../../utils/proptypes.js';

import Dialog from '../dialog/dialog.js';
import DialogContent from '../dialog/content.js';
import DialogError from '../dialog/error.js';
import DialogFooter from '../dialog/footer.js';
import DialogTitle from '../dialog/title.js';
import ScrollableContent from '../dialog/scrollablecontent.js';

class SaveDialogContent extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      loading: false,
    };

    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleErrorClose = this.handleErrorClose.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.error !== state.prevError) {
      return {
        error: props.error,
        prevError: props.error,
        loading: false,
      };
    }
    return null;
  }

  handleSaveClick(state) {
    const {onSave} = this.props;

    if (onSave && !this.state.loading) {
      const promise = onSave(state);
      if (isDefined(promise)) {
        this.setState({loading: true});

        promise.catch(error => this.setError(error));
      }
    }
  }

  handleErrorClose() {
    const {onErrorClose} = this.props;
    if (isDefined(onErrorClose)) {
      onErrorClose();
    }
    else {
      this.setState({error: undefined});
    }
  }

  setError(error) {
    this.setState({
      error: error.message,
      loading: false,
    });
  }

  render() {
    const {
      buttonTitle,
      children,
      close,
      defaultValues,
      moveProps,
      heightProps,
      title,
      values,
    } = this.props;
    const {
      error,
    } = this.state;
    return (
      <State {...defaultValues}>
        {({
          state,
          onValueChange,
        }) => {
          const childValues = {...state, ...values};
          return (
            <DialogContent>
              <DialogTitle
                title={title}
                onCloseClick={close}
                {...moveProps}
              />
              {error &&
                <DialogError
                  error={error}
                  onCloseClick={this.handleErrorClose}
                />
              }
              <ScrollableContent
                {...heightProps}
              >
                {children({
                  values: childValues,
                  onValueChange,
                })}
              </ScrollableContent>
              <DialogFooter
                title={buttonTitle}
                loading={this.state.loading}
                onClick={() => this.handleSaveClick(childValues)}
              />
            </DialogContent>
          );
         }}
      </State>
    );
  }
}

SaveDialogContent.propTypes = {
  buttonTitle: PropTypes.string,
  close: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  error: PropTypes.string,
  heightProps: PropTypes.object,
  moveProps: PropTypes.object,
  title: PropTypes.string.isRequired,
  values: PropTypes.object,
  onErrorClose: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onValueChange: PropTypes.func,
};

const SaveDialog = ({
  buttonTitle = _('Save'),
  children,
  defaultValues,
  error,
  minHeight,
  minWidth,
  title,
  values,
  width,
  onClose,
  onErrorClose,
  onSave,
}) => {
  return (
    <Dialog
      width={width}
      minHeight={minHeight}
      minWidth={minWidth}
      onClose={onClose}
    >
      {({
        close,
        moveProps,
        heightProps,
      }) => (
        <SaveDialogContent
          buttonTitle={buttonTitle}
          close={close}
          defaultValues={defaultValues}
          error={error}
          moveProps={moveProps}
          heightProps={heightProps}
          title={title}
          values={values}
          onErrorClose={onErrorClose}
          onSave={onSave}
        >
          {children}
        </SaveDialogContent>
      )}
    </Dialog>
  );
};

SaveDialog.propTypes = {
  buttonTitle: PropTypes.string,
  defaultValues: PropTypes.object, // default values for uncontrolled values
  error: PropTypes.string, // for errors controlled from parent (onErrorClose must be used if set)
  minHeight: PropTypes.numberOrNumberString,
  minWidth: PropTypes.numberOrNumberString,
  title: PropTypes.string.isRequired,
  values: PropTypes.object, // should be used for controlled values
  width: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onErrorClose: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

export default SaveDialog;

// vim: set ts=2 sw=2 tw=80:
