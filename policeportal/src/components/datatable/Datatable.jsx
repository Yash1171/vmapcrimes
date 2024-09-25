import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/userContext";

function Datatable() {
  const {   isAuthenticated, verifyAccess } = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [deleted,setDeleted] = useState(false)
  const nav = useNavigate()
  const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }


  useEffect(() => {
    
    if(!isAuthenticated) {
        nav("/login",{replace:true})
    }
    const fetchUsers = async () => {

      
      const options = {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      }

      const response = await fetch(`http://localhost:5001/api/users/fetchAllUsers?q=${makeid(7)}`, options);
      let res = await response.json()
      
        if(verifyAccess(response,res)){
        setUsers(res.users)
      }
    }
    if (isAuthenticated) {
      fetchUsers()
    }
    // eslint-disable-next-line
  },[deleted,isAuthenticated])




  const handleDelete = async (e) => {
    
    if (window.confirm("Are you sure you want to delete this item?")){
      const id = e.target.id;
      const options = {
        method: "DELETE",
        credentials: 'include'
      }
      var res = await fetch(`http://localhost:5001/api/users/deleteUser/${id}`, options);
      var resJson = await res.json();
      if(resJson.status!=="failure") {
        deleted?setDeleted(false):setDeleted(true)
      }
    }

  }

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 250 },
    {
      field: 'user',
      headerName: 'User',
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            {/* <img className="celling" src={params.row.img} alt="avatar"/> */}
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "role", headerName: 'Role', width: 200,
    },
    {



      field: "action", headerName: 'Action', width: 200,
      renderCell: (params) => {
        return (
          <>
          <div className="cellAction">
            {verifyAccess({READ_PERMS:["READ_FULL_USER"]}) ?
              
                <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton" >View</div>
                </Link>
               : null}
            {verifyAccess({ACTION_PERMS:["DELETE_USER"]}) ?
              <div className="deleteButton" id={params.row.id} onClick={handleDelete}>Delete</div> : null}
              </div>
          </>
        )
      }

    }


  ];


  return (

    <div className="datatable" style={{ height: 540, width: '95%' }}>
      {  verifyAccess({ACTION_PERMS:['CREATE_USER']}) ?
      
        <Link to="/users/new" style={{ textDecoration: "none" }} className="link">
          Add New
        </Link>
     :null }
      <div className="datatableTitle">
        App Users
      </div>
      <DataGrid
        className="datagrid"
        rows={users}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        style={{ border: "1.5px solid lightgray" }}
        localeText={{ noRowsLabel: isAuthenticated ? "No rows" : "Please login to view users" }}
      />
    </div>

  )
}

export default Datatable
