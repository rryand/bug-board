import { Draggable } from 'react-beautiful-dnd'

const Issue = ({ issue, index, onDelete }) => {
  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided) => (
        <div
          className='issue'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
          </div>
          <button className='delete-btn' onClick={() => onDelete(issue.id)}>
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Issue
