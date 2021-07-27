import { useState } from 'react'

const AddIssue = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      alert('Please add title.')
      return;
    } else if (!description) {
      alert('Please add description.')
      return;
    }

    onAdd({ title, description });

    setTitle('');
    setDescription('');
  }

  return (
    <form className='form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Title:</label>
        <input
          type='text'
          placeholder='Add title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Description:</label>
        <input
          type='text'
          placeholder='Add description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <input className='btn submit-btn' type='submit' value='Save Issue' />
    </form>
  );
}

export default AddIssue
