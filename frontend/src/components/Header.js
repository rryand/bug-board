import PropTypes from 'prop-types'

const Header = ({ title, onAddButtonClick, isAddOpen }) => {
  return (
    <header>
      <h1>{title}</h1>
      <button
        className={isAddOpen ? 'btn red' : 'btn'}
        onClick={onAddButtonClick}
      >
        {isAddOpen ? 'Close' : 'Add'}
      </button>
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
