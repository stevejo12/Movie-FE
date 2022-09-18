import React from 'react'

const TextArea = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <textarea 
        rows={props.rows}
        className="form-control"
        id={props.name}
        name={props.name}
        onChange={props.handleChange}
        value={props.value}
      />
    </div>
  )
}

export default TextArea