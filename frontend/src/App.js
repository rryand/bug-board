import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import AddIssue from './components/AddIssue';
import Header from './components/Header'
import Column from './components/Column'
import api from './utils/api'

function App() {
  const [issues, setIssues] = useState({});
  const [columns, setColumns] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const getIssues = async () => {
      const fetchedIssues = await api.get('/issues');
      const reducedIssues = fetchedIssues.reduce((obj, issue) => {
        obj[issue.id] = issue;
        return obj;
      }, {});
      setIssues(reducedIssues);
    }

    const getColumns = async () => {
      const fetchedColumns = await api.get('/statuses');
      const reducedColumns = fetchedColumns.reduce((obj, column) => {
        obj[column.id] = column;
        return obj;
      }, {});
      setColumns(reducedColumns);
    }
  
    getIssues();
    getColumns();
  }, []);

  const addIssue = async (issue) => {
    const data = await api.post('/issues', issue);

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
  }

  const onDragEnd = async (result) => {
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

    await api.patch(`/statuses/${source.droppableId}`, {
      issueIds: newIssueIds
    });

    setColumns({
      ...columns,
      [newColumn.id]: newColumn,
    });
  };

  return (
    <div className="App">
      <Header onAddButtonClick={() => setIsAddOpen(!isAddOpen)} isAddOpen={isAddOpen}/>
      <AddIssue onAdd={addIssue} isAddOpen={isAddOpen} />
      <div className='issues-container'>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(columns).map((columnId) => {
            const column = columns[columnId];
            const columnIssues = column.issueIds.map((issueId) => issues[issueId]);
            return (
              <Column
                key={column.id}
                columnId={column.id}
                title={column.title}
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
