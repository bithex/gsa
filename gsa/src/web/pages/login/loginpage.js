/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
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

import {withRouter} from 'react-router-dom';

import styled from 'styled-components';

import _ from 'gmp/locale';

import logger from 'gmp/log';

import {isEmpty} from 'gmp/utils/string';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';
import withGmp from 'web/utils/withGmp';

import GBIcon from 'web/components/icon/greenboneicon';

import Layout from 'web/components/layout/layout';

import Footer from 'web/components/structure/footer';
import Header from 'web/components/structure/header';

import {
  setSessionTimeout,
  setUsername,
  updateTimezone,
} from 'web/store/usersettings/actions';

import LoginForm from './loginform';

const log = logger.getLogger('web.login');

const GreenboneIcon = styled(GBIcon)`
  width: 30vh;
  margin: 30px auto;
  position: sticky;
`;

const LoginLayout = styled(Layout)`
  height: 100%;
  width: 420px;
  margin: 0 auto;
  padding: 20px 20px 0px 20px;
`;

const StyledLayout = styled(Layout)`
  flex-direction: column;
  height: 100vh;
`;

const LoginHeader = styled(Header)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const MenuSpacer = styled.div`
  background: ${Theme.darkGray};
  position: absolute;
  top: 42px;
  left: 0;
  right: 0;
  height: 35px;
  zIndex: ${Theme.Layers.menu};
`;

const Wrapper = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
`;

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(username, password) {
    const {gmp} = this.props;

    gmp.login(username, password).then(data => {
      const {
        locale,
        timezone,
        sessionTimeout,
      } = data;

      const {location, history} = this.props;
      if (location && location.state && location.state.next &&
          location.state.next !== location.pathname) {
        history.replace(location.state.next);
      }
      else {
        history.replace('/');
      }

      this.props.setTimezone(timezone);
      this.props.setLocale(locale);
      this.props.setSessionTimeout(sessionTimeout);
      this.props.setUsername(username);
    }, rej => {
      log.error(rej);
      this.setState({error: rej});
    });
  }

  componentDidMount() {
    // reset token
    const {gmp} = this.props;
    gmp.clearToken();
  }

  render() {
    const {error} = this.state;
    let message;

    if (error) {
      if (isEmpty(error.message)) {
        message = _('Unknown error on login');
      }
      else {
        message = error.message;
      }
    }

    return (
      <StyledLayout>
        <LoginHeader/>
        <MenuSpacer/>
        <LoginLayout flex="column" className="login">
          <GreenboneIcon/>
          <Wrapper>
            <LoginForm
              error={message}
              onSubmit={this.handleSubmit}
            />
          </Wrapper>
        </LoginLayout>
        <Footer/>
      </StyledLayout>
    );
  }
}

LoginPage.propTypes = {
  gmp: PropTypes.gmp.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  setLocale: PropTypes.func.isRequired,
  setSessionTimeout: PropTypes.func.isRequired,
  setTimezone: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  setTimezone: timezone => dispatch(updateTimezone(gmp)(timezone)),
  setLocale: locale => gmp.setLocale(locale),
  setSessionTimeout: timeout => dispatch(setSessionTimeout(timeout)),
  setUsername: username => dispatch(setUsername(username)),
});

export default compose(
  withRouter,
  withGmp,
  connect(null, mapDispatchToProps),
)(LoginPage);

// vim: set ts=2 sw=2 tw=80:
