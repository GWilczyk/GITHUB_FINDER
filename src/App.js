import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Layout/Navbar';
import Users from './Components/Users/Users';
import User from './Components/Users/User';
import Search from './Components/Users/Search';
import Alert from './Components/Layout/Alert';
import About from './Components/Pages/About';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Search Github users
  const searchUsers = async text => {
    setLoading(true);
    const response = await axios.get('https://api.github.com/search/users', {
      params: {
        q: `${text}`,
        client_id: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
        client_secret: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      }
    });
    setUsers(response.data.items);
    setLoading(false);
  };

  // Get single Github user
  const getUser = async username => {
    setLoading(true);
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        params: {
          client_id: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
          client_secret: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
        }
      }
    );
    setUser(response.data);
    setLoading(false);
  };

  // Get user's repos
  const getUserRepos = async username => {
    setLoading(true);
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: {
          per_page: '5',
          sort: 'created:asc',
          client_id: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
          client_secret: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
        }
      }
    );
    setRepos(response.data);
    setLoading(false);
  };

  // Clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  // Set alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='container'>
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path='/'
              render={props => (
                <Fragment>
                  <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    setAlert={showAlert}
                    showClear={users.length > 0}
                  />
                  <Users users={users} loading={loading} />
                </Fragment>
              )}
            />
            <Route exact path='/about' component={About} />
            <Route
              exact
              path='/user/:login'
              render={props => (
                <User
                  {...props}
                  user={user}
                  repos={repos}
                  loading={loading}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
