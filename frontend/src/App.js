import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import AddIssue from './components/AddIssue';
import Header from './components/Header'
import Column from './components/Column'

const API_URL = 'http://192.168.100.5:8000';

function App() {
  const [issues, setIssues] = useState({});
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const getIssues = async () => {
      const fetchedIssues = await fetchIssues();
      const reducedIssues = fetchedIssues.reduce((obj, issue) => {
        obj[issue.id] = issue;
        return obj;
      }, {});
      setIssues(reducedIssues);
    }

    const getColumns = async () => {
      const fetchedColumns = await fetchColumns();
      const reducedColumns = fetchedColumns.reduce((obj, column) => {
        obj[column.id] = column;
        return obj;
      }, {});
      setColumns(reducedColumns);
    }
  
    getIssues();
    getColumns();
  }, []);

  // Fetch Issues
  const fetchIssues = async () => {
    const res = await fetch(`${API_URL}/issues`);
    const data = await res.json();

    return data;
  };

  const addIssue = async (issue) => {
    const res = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    const data = await res.json();

    setIssues({
      ...issues,
      [data.id]: data,
    });

    const column = columns[data.status];
    const newColumn = {
      ...column,
      issueIds: [...column.issueIds, data.id],
    }
    setColumns({
      ...columns,
      [newColumn.id]: newColumn,
    });
  };

  const deleteIssue = (id) => {
    setIssues(issues.filter((issue) => issue.id !== id));
    // TODO: delete from column issueIds
  };

  const fetchColumns = async () => {
    const res = await fetch(`${API_URL}/columns`);
    const data = await res.json()

    return data
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
      destination.index === source.index)
    ) {
      return;
    }

    const column = columns[source.droppableId];
    const newIssueIds = Array.from(column.issueIds);
    newIssueIds.splice(source.index, 1);
    newIssueIds.splice(destination.index, 0, Number(draggableId));

    const newColumn = {
      ...column,
      issueIds: newIssueIds,
    };
    
    setColumns({
      ...columns,
      [newColumn.id]: newColumn,
    });
  };

  return (
    <div className="App">
      <Header />
      <AddIssue onAdd={addIssue} />
      <div className='issues-container'>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(columns).map((columnId) => {
            const column = columns[columnId];
            const columnIssues = column.issueIds.map((issueId) => issues[issueId]);
            return (
              <Column
                key={column.id}
                columnId={column.id}
                issues={columnIssues}
                onDelete={deleteIssue}
              />
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
