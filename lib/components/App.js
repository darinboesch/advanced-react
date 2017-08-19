import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash.pickby';

import Timestamp from './Timestamp';
import SearchBar from './SearchBar';
import ArticleList from './ArticleList';

class App extends React.Component {
  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return {
      store: this.props.store
    };
  }

  state = this.props.store.getState();

  // setSearchTerm = (searchTerm) => {
  //   this.setState({ searchTerm });
  // };

  onStoreChange = () => {
    this.setState(this.props.store.getState());
  }

  componentDidMount() {
    this.subscriptionId = this.props.store.subscribe(this.onStoreChange);
    this.props.store.startClock();
  }

  componentWillUnmount() {
    this.props.store.unsubscribe(this.subscriptionId);
  }

  render() {
    let { articles, searchTerm } = this.state;
    const searchRE = new RegExp(searchTerm, 'i');
    if (searchTerm) {
      articles = pickBy(articles, (val) => {
        return val.title.match(searchRE) ||
               val.body.match(searchRE);
      });
    }

    return (
      <div>
        <Timestamp />
        <SearchBar />
        <ArticleList
          articles={articles}
        />
      </div>
    );
  }
}

export default App;
