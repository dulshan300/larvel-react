import React, { useEffect, useState, Fragment, useRef } from 'react'
import axiosClient from '../utils/axios';
import { useStateContext } from '../contexts/ContextProvider';
import Modal from '../components/Modal';
import useValidationError from '../components/hooks/useValidationError';
import parse from 'html-react-parser'
import useInput from '../components/hooks/useInput';


const Users = () => {

  const { setPageTitle,setNotification } = useStateContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setErrors, showErrors } = useValidationError()


  // for add new model
  let [isOpen, setIsOpen] = useState(false);

  // for delete confirm
  let [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [full_name, full_name_bind, full_name_reset] = useInput("");
  const [email, email_bind, email_reset] = useInput("");
  const [password, password_bind, password_reset] = useInput("");

  const [userID, setUserID] = useState();

  function closeModal() {
    setIsOpen(false)
    setUserID(null);
  }

  function openModal() {
    clearRef();
    setIsOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false)
    setUserID(null);
  }

  function openDeleteModal(userID) {
    clearRef();
    setUserID(userID);
    setIsDeleteOpen(true)
  }

  function openEditModal(userID) {
    clearRef();
    setLoading(true);
    setUserID(userID);

    axiosClient.get(`/users/${userID}`)
      .then(({ data }) => {

        const user = data.data;
        full_name_reset(user.name);
        email_reset(user.email);


      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      })


    setIsOpen(true)
  }

  function getUsers() {
    setLoading(true);
    axiosClient.get('/users')
      .then(({ data }) => {
        setUsers(data);
        console.log(data);
      })
      .catch(err => {

      })
      .finally(() => {
        setLoading(false);
      })

  }

  function clearRef() {

    full_name_reset();
    email_reset();
    password_reset();

    setErrors({})
  }

  const handleDelete = () => {
    axiosClient.delete(`/users/${userID}`)
      .then((res) => {
        getUsers();
        setIsDeleteOpen(false)
        setNotification('success',"User Deleted Successfully.")
      })
  }

  useEffect(() => {
    setPageTitle('Users')
  }, [])

  useEffect(() => {

    getUsers();

  }, [])

  const frm_add_new_user_submit = (e) => {
    e.preventDefault();
    console.log(userID);
    setErrors({});

    let payload = {
      'name': full_name,
      'email': email,
    }

    if (password != "") {
      payload['password'] = password;
      payload['password_confirmation'] = password;
    }

    if (userID) {
      payload['id'] = userID;
    }

    if (!userID) {
      axiosClient.post('/users', payload)
        .then(({ data }) => {
          getUsers();
          closeModal();
          setNotification('success',"New User Successfully added.")
        })
        .catch(err => {
          const response = err.response;
          setErrors(response.data.errors)
        })
    } else {
      axiosClient.put(`/users/${userID}`, payload)
        .then((data) => {
          getUsers();
          closeModal();
          setNotification('success',"User Updated Successfully")
        })
        .catch(err => {
          const response = err.response;
          setErrors(response.data.errors)
        })
    }



  }

  const paginate = (url) => {
    axiosClient.get(url)
      .then(({ data }) => {
        setUsers(data);
        console.log(data);
      })
      .catch(err => {

      })
      .finally(() => {
        setLoading(false);
      })

  }



  return (
    <div>

      <div className="flex justify-end mb-5">
        <button onClick={openModal} className='btn-primary'>Add New User</button>
      </div>


      <div className="">
        <table className='w-full rounded-md overflow-hidden'>
          <thead className='text-sm bg-gray-800 text-white text-left'>
            <tr>
              <th className='p-3'>Name</th>
              <th className='p-3'>Email</th>
              <th className='p-3'>Created At</th>
              <th className='p-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.data?.map((u, i) => (
              <tr key={i} className='even:bg-indigo-50'>
                <td className='py-2 px-3'>{u.name}</td>
                <td className='py-2 px-3'>{u.email}</td>
                <td className='py-2 px-3'>{u.created_at}</td>
                <td className='py-2 px-3'>
                  <div className="flex gap-3">

                    <button onClick={e => openEditModal(u.id)} className='text-blue-600 hover:text-blue-800'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>

                    <button onClick={e => openDeleteModal(u.id)} className='text-red-600 hover:text-red-800'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>


                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-8">
          <ul className='flex gap-2'>
            {users.meta?.links?.map((l, i) =>
              <li onClick={e => paginate(l.url)} className={`${l.active ? 'bg-indigo-600' : 'bg-indigo-400'} hover:bg-indigo-600 text-white px-2 py-1 rounded cursor-pointer ${!l.url ? 'hidden' : ''}`} key={i}>{parse(l.label)}</li>
            )}
          </ul>
        </div>
      </div>

      {/* add new model */}
      <Modal show={isOpen} onClose={closeModal} title={"Add New User"}>
        <form onSubmit={frm_add_new_user_submit} className='mt-4'>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-gray-900">
              Full Name
            </label>
            <div className="mt-2">
              <input {...full_name_bind}
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="full_name"
                placeholder='ex: Jon Kinston'
                className="form-input"
              />
            </div>
          </div>
          <div className='mt-4'>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input {...email_bind}
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder='ex: Jon@email.com'
                className="form-input"
              />
            </div>
          </div>
          <div className='mt-4'>
            <label htmlFor="passsword" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input {...password_bind}
                id="passsword"
                name="passsword"
                type="text"
                autoComplete="passsword"
                placeholder='ex: U7isJ%qE'
                className="form-input"
              />
            </div>
          </div>
          {/* show errors */}
          {showErrors}
          <div className="flex justify-end gap-3 mt-4">
            <button className='btn-primary'>Save</button>
            <button type='button' onClick={closeModal} className='btn-secondary'>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* delete confirm */}

      <Modal show={isDeleteOpen} onClose={closeDeleteModal} title={"Confirm Delete"}>
        <div className="">
          <p className='text-red-600 font-bold'>Are you sure you want to remove this user ?</p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleDelete} className='btn-primary'>Delete</button>
          <button type='button' onClick={closeDeleteModal} className='btn-secondary'>No</button>
        </div>

      </Modal>

    </div>
  )
}

export default Users