import React from 'react'

const BrandForm = ({handleSubmit, value, setValue, phone, setPhone, photo, setPhoto}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder='Enter New Brand' 
        value={value} 
        onChange={(e)=>setValue(e.target.value)
        }/>
      </div>
      <div className="mb-3">
        <input className="form-control" placeholder='Enter contact number' 
        value={phone} 
        onChange={(e)=>setPhone(e.target.value)
        }/>
      </div>
      <div className="mb-3">
        <label className="btn btn-outline-secondary col-md-12">
          {photo ? photo.name : "Upload Photo"}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            hidden
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>

      
    </>

  )
}

export default BrandForm
