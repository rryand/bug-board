const Issue = ({ issue }) => {
  return (
    <div className='issue'>
      <div>
        <h3>{issue.title}</h3>
        <p>{issue.description}</p>
      </div>
      <button className='delete-btn'>
        Delete
      </button>
    </div>
  );
};

export default Issue
