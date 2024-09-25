import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../newroles/newroles.scss"
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/userContext";
function Updateroles() {

  const { perms ,verifyAccess,isAuthenticated} = useContext(UserContext)
  const [updated, setUpdated] = useState(0)
  const [message, setMessage] = useState(false)
  const nav = useNavigate()
  const { roleId } = useParams()
  const [postData, setPostData] = useState({
    name: "",
    action_perms: [],
    read_perms: []
  })

  useEffect(() => {
    if(!isAuthenticated) {
      nav("/login",{replace: true})
  }
    const fetchRole = async () => {
      const options = {
        credentials: 'include'
      }
      var fetchedRole = await fetch(`http://localhost:5001/api/roles/fetchRole/${roleId}`, options)
      var fetchedRoleJSON = await fetchedRole.json()
      if (verifyAccess(fetchRole,fetchedRoleJSON)){

        setPostData(fetchedRoleJSON)

      }
    }
    fetchRole()

  },[])

  const onBtnClick = async (e) => {
    e.preventDefault()
    const options = {

      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(postData),
      headers: { "Content-Type": "application/json" }

    }

    var resp = await fetch("http://localhost:5001/api/roles/updateRole", options)
    var respJSON = await resp.json()
    if(verifyAccess(resp,respJSON)){
        setUpdated(1)
        
    }else { setUpdated(2) }
    setMessage(respJSON.message)
  }

  const handleChange = async (event) => {

    var newData = { ...postData }
    console.log('Event is'+event)
    console.log(`Checkbox ${event.target.id} checked : ${event.target.checked}`)
    if (event.target.checked) {
      switch (event.target.name) {
        case "actionPerms":
          newData["action_perms"].push(event.target.value);
          break
        case "readPerms":
          newData["read_perms"].push(event.target.value);
          break
        default:
          break;
      }
    } else {

      switch (event.target.name) {
        case "actionPerms":
          newData["action_perms"] = newData["action_perms"].filter((i) => { return i !== event.target.value });
          console.log(`Removed ${event.target.value} from newData: `, JSON.stringify(newData))
          break
        case "readPerms":
          newData["read_perms"] = newData["read_perms"].filter((i) => { return i !== event.target.value });
          console.log(`Removed ${event.target.value} from newData: `, JSON.stringify(newData))

          break;
        default:
          break;
      }


    }

    // newData.action_perms = newData.action_perms.filter((item, 
    //   index) => newData.action_perms.indexOf(item) === index);

    // newData.read_perms = newData.read_perms.filter((item, 
    // index) => newData.read_perms.indexOf(item) === index);

    console.log("Updating roles to " + JSON.stringify(newData))
    await setPostData({ name: newData.name, action_perms: newData.action_perms, read_perms: newData.read_perms });
    console.log("Data is now " + JSON.stringify(postData) + "  newData : " + JSON.stringify(newData))
  }
  return (
    <div className="newroles">
      <Sidebar />
      <div className="newrolescontainer">
        <Navbar />
        {isAuthenticated ?
          <>
            <div className="top">
              <h1>Update '{postData ? postData.name : "noRole"}' Role</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAAB5CAMAAABm4rHGAAAAXVBMVEXy8vJmZmbz8/NjY2P29vb9/f3l5eXu7u5gYGBbW1vMzMxxcXH5+fmJiYmNjY3b29t5eXmpqam+vr6CgoKjo6OTk5PExMSbm5uvr6+4uLhra2vV1dVSUlI/Pz9HR0dIprnbAAAFGklEQVR4nO2bgXKrKhCGERYQBUVRo8m59/0f86KmiSamISJm7hn/6UzbROHLv8uyVovQob9e+NsAb3UQ+usg9NdB6K+D0F8Hob8OQn8dhP46CP11EPrrIPTXQeivg9BfnxHirRSEECMAvpUkOE/8ASEkWmwlncjtCSGJ43QrCZLA5oRUiYKjjaJcCUW3J4xjBhutE8lIHICQELZVbcKMEOo42EH4Ytae0PVY51EPD18e6zzqAuGH+9fkxJ08lCjPuetE81l3IcSoTaPoXDPXzWF67h6EGGWCRFEkzvnniLsQypOIBpHz503mHoSYXwGti+WyiRjAfi3OsMdahuRGGJ8WBwFeaF0n8iVhYA+hvBNmS4MAO8eExKJb6lV393AhyhireEzTy0Kvukse4viWh0vNKK1+FlKEnt/eZU+R7RUh1guDQH63uHpBGLxiQ/UnjggReqFkY65JdPO4fIrzTnsKJCpNdbsQxHuxHOP89Bn22pcBM4aWqom96IomitWjift1X8u9DXARzSTah8/x7f4Q1/GckESXeZy/3GPT9sFCG+d0Xre/66EtNOSR8LHkfNVDjM0zYEREMiX6qoezQjNBPE9Lzjc9lMmCg0Ocs0nJ+WK1AR69IJxtLXsRYuDsYUd5KjRT3S8XdiIE2ZrUtNOZaLOYhNc4m1vd3iUPMTAtiO0cDMc/QwH7BdDG+VZydvEQuImvS+AnGQGpX2LcI/5sLbv02Ej/0IgMjxPL581kLpJe/d7BQ2DmbpfIhonhVaGZpGIt74SO864jxGCmdgllDcHy/JYw+jNeMQQntC30POGE4gD1mxiPLg4lJ3SUMc8eV0Sfi79VmjuhuhE6zruCEMA8L1mhgJa/r+Trga0M7SHwbMksUXNHRFtyghLiV/lmWwNZOgSaGB40yhirVxR2uTi5KGoazkPbyy+3f9epkXRZLiKBYB6CXMzBu4tuy+XMgnmI3tQ8x+USZywK5OEvIb4iui0X0oYhjN60LqM9yMnFMFF+2eDPXKyxk4thPHSSyIB2748N46ErIs/fHxWCMHVFjI1+eyhJt4+yW+8yTv8eUDTbP+eAcEvirURa54k/IZQs2Ups8TaLL+Fwl2kjfWLMJ4Rf0UHor9WEeKhns4SCFffCHSZaex472ct46GY3I52f5fpoppXnAfunk0hmkz/yy6qD24jbZc96Qm36qypLKOFa3KhFlrIvJhJjPLw81Cd7+Wl/Wevv6ijnddFAT8hP6jTEGicXWjSZunRZbV9oVZYD5EqVLUCSZWtTYD1hxoy0hLRueWP6ZQNVSaMTT/6UqKhpqVCjKdIXlGmaa85SvjuhTUJpPUw5gO5NhKKhmgFPqXWOJjlwi2Y/RW6oZbf2rjPRh/CSyTpnxi7pYcGMhJinNraZxBKXEW1OgJmidZfnVef8YOlWhGB56tx+R7JOZoQ9Pip0pWlZDYRZXRTFiudyPAkxNNUpzw08eWjfpMWpj3IzEtYXSVc/I+ZBiJExOdK2pEzycCRU1Ix5qOwvNg8bkO3OeWgXA0ay/DenpoFED2t5Rlh3shOA0hxOml4MZunKZwPX73qVPZXbtcsypYYUk11CTwzx2ga2krkxRd3Ri1aVktAZ8+LJpmCEtuPuT7YXbHbruLYMtjHttxHZ3wzqv+wGwxNqWe2PsLqtCNh9DUOb7rLavckw4YR5W3l2PME72PXhveov7rF300Hor4PQXwehvw5Cfx2E/vo/EG7zD24B9R/MW0weQ1XoGgAAAABJRU5ErkJggg=="
                  alt="profile"
                />
              </div>
              <div className="right">
                <form>
                  <div className="formInput">
                    <label htmlFor="file">
                      Role Icon: <DriveFolderUploadIcon className="icon" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} />
                  </div>
                  <div className="formInput">
                    <label><h3>Action Permissions:</h3></label>

                    {perms.ACTION_ROLES.map(item=>{return <label htmlFor=""><input type="checkbox" checked={ postData.action_perms.includes(item)} onChange={handleChange} name="actionPerms"  value={item}/>{item}</label>})}

                  </div>
                  <div className="formInput" >
                    <label><h3>Read Permissions:</h3></label>
                    {perms.READ_ROLES.map(item=>{return <label htmlFor=""><input type="checkbox" checked={postData.read_perms.includes(item)} onChange={handleChange} name="readPerms" value={item}/>{item}</label>})}

                   

                  </div>



                  <button onClick={onBtnClick} style={{ height: "20px !important",display:"inline-block !important" }}>UPDATE</button>
                  {updated? updated === 1 ? <p style={{color:"green",display:"inline !important"}}>{message}</p>:<p style={{color:"red"}}>{message}</p>:null}

                </form>
              </div>
            </div>
          </> : <h3> Please log in to use this functionality </h3>
        }


      </div>
    </div>
  )
}

export default Updateroles
