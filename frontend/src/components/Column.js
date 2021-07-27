import { Droppable } from 'react-beautiful-dnd'

import Issue from './Issue'

const Column = ({ columnId, title, issues, onDelete }) => {
  return (
    <div className='column'>
      <h2>{title}</h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {issues.map((issue, index) => issue &&
              (<Issue
                key={issue.id}
                issue={issue}
                index={index}
                onDelete={onDelete}
              />)
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column
