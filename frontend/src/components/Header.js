import PropTypes from 'prop-types'

const Header = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
      <button>Add</button>
    </header>
  );
};

Header.defaultProps = {
  title: 'Bug Board',
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Header
