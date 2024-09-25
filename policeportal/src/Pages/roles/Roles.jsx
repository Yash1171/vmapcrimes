import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar"
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import UserContext from "../../context/userContext";
import "./roles.scss"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
function Roles() {

  const { logUserOut, verifyAccess, isAuthenticated } = useContext(UserContext)
  const [roles, setRoles] = useState([])
  const [deleted, setDeleted] = useState(false)
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

  const handleDelete = async (event) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const id = event.target.id;
      const options = {
        method: "DELETE",
        credentials: 'include'
      }
      var res = await fetch(`http://localhost:5001/api/roles/deleteRole/${id}`, options);
      var resJson = await res.json();
      if (verifyAccess(res,resJson)) {
        deleted ? setDeleted(false) : setDeleted(true)
      }
    }
  }

  useEffect(() => {
    if(!isAuthenticated) {
        nav("/login",{replace: true})
    }
    const fetchUsers = async () => {
      const options = {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      }

      const response = await fetch(`http://localhost:5001/api/roles/fetchAllRoles?q=${makeid(7)}`, options);
      let res = await response.json()
     if(verifyAccess(response,res)){

        console.log("roles are " + Array.isArray(res.roles))
        setRoles(res.roles)
        console.log("Roles are fetched " + roles)
      }
    }
    fetchUsers()

  }, [deleted,isAuthenticated])
  return (
    
    <div className="Roles">
      <Sidebar />
      <div className="rolesContainer">
        <Navbar />
        <div className="title">
          <div className="manage">Access Control</div>
          {verifyAccess({ ACTION_PERMS: ["ADD_ROLE"] }) ?
            <Link to="/newroles" style={{ textDecoration: "none" }}>
              <div className="addrole">
                <p>+Add Roles</p>
              </div>
            </Link> : null
          }
        </div>

        <div className="contentbox">

          <div className="content">

            <div className="left">

              {(roles && Array.isArray(roles) && roles.length) ?
                roles.map((item) => {
                  return <span key={item._id}>
                    <div className="spancontent">
                      <SupervisorAccountOutlinedIcon className="icon" />
                      {item.name}
                    </div>
                  </span>
                })
                : !verifyAccess({ READ_PERMS: ["READ_ALL_ROLES"] }) ? "You don't have permissions to view roles" : isAuthenticated ? "No Rows" : "Login to view roles"}
            </div>
            <div className="right">
              {roles ? roles.map((item) => {
                return <div className="rightcontent" key={item._id}>
                  {verifyAccess({ ACTION_PERMS: ["DELETE_ROLE"] }) ? <div className="delete" id={item._id} onClick={handleDelete}>Delete</div> : null}

                  {verifyAccess({ ACTION_PERMS: ["EDIT_ROLE"] }) ? <Link to={`update/${item._id}`} style={{ textDecoration: "none" }}><div className="edit">Edit</div></Link> : null}
                </div>
              }) : null}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roles
