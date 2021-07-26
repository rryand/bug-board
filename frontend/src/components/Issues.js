import Issue from './Issue'

const Issues = ({ issues, type }) => {
  return (
    <div className='issues'>
      <h2>{type}</h2>
      {issues.length > 0 ? (
        issues.map((issue) => <Issue key={issue.id} issue={issue}/>)
        ) : (
        <p>No issues to show.</p>
      )}
    </div>
  );
};

export default Issues
