import { useState } from 'react'

import Header from './components/Header'
import Issues from './components/Issues'

function App() {
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Bug 1',
      description: 'The first bug.',
      status: 'todo',
    },
    {
      id: 2,
      title: 'Bug 2',
      description: 'The second bug.',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Bug 3',
      description: 'The third bug.',
      status: 'todo',
    },
    {
      id: 4,
      title: 'Bug 4',
      description: 'The fourth bug.',
      status: 'in-progress',
    },
  ]);
  const issuesTodo = issues.filter((issue) => issue.status === 'todo');
  const issuesInProgress = issues.filter((issue) => issue.status === 'in-progress');
  const issuesDone = issues.filter((issue) => issue.status === 'done');

  return (
    <div className="App">
      <Header />
      <div className='issues-container'>
        <Issues issues={issuesTodo} type='To Do' />
        <Issues issues={issuesInProgress} type='In Progress' />
        <Issues issues={issuesDone} type='Done' />
      </div>
    </div>
  );
}

export default App;
