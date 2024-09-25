export const userColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'user',
        headerName: 'User',
        width: 230,
        renderCell: (params)=>{
            return(
                <div className="cellWithImg">
                    <img className="celling" src={params.row.img} alt="avatar"/>
                    {params.row.userName}
                </div>
            );
        },
      },
      {
        field: "email", headerName: 'Email', width: 250, 
      },
      {
        field: "age", headerName: 'Age', width: 120,
      },
      {
        field: "status", headerName: 'Status', width: 160,
        renderCell: (params)=>{
            return(
                <div className={`cellWithStatus ${params.row.status}`}>
                  {params.row.status}
                </div>
            );
        },
      },
];



export const userRows=[
    {
        id: 1,
        userName: "Jane Doe",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-boy-man-round-frame-vector-cartoon-flat-illustration_551425-19.jpg?w=2000",
        status: "active",
        email: "janedoe@gmail.com",
        age: 35,
    },
    {
        id: 2,
        userName: "Stark",
        img: "https://img.freepik.com/premium-vector/vector-illustration-boy-avatar-avatar-social-network-documents-redheaded-boy-with-freckles_469123-398.jpg?w=2000",
        status: "passive",
        email: "Stark@gmail.com",
        age: 24,
    },
    {
        id: 3,
        userName: "Arya",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfFmRffJzVDXdVJ5wZUivvH9CiUk3s1QESCe7oqwi4jkXzPrj5r8g4Sd793s7zKbYumMQ&usqp=CAU",
        status: "passive",
        email: "Arya@gmail.com",
        age: 32,
    },
    {
        id: 4,
        userName: "Harvey",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-kid-caucasian-boy-round-frame-vector-illustration-cartoon-flat-style_551425-43.jpg?w=2000",
        status: "active",
        email: "Harvey@gmail.com",
        age: 27,
    },
    {
        id: 5,
        userName: "Roxie",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa69_HGc_i3MXKCPZzCfAjBZC4bXJsn0rS0Ufe6H-ctZz5FbIVaPkd1jCPTpKwPruIT3Q&usqp=CAU",
        status: "passive",
        email: "Roxie@gmail.com",
        age: 31,
    },
    {
        id: 6,
        userName: "Snow",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-boy-man-round-frame-vector-cartoon-flat-illustration_551425-19.jpg?w=2000",
        status: "active",
        email: "Snow@gmail.com",
        age: 35,
    },
    {
        id: 7,
        userName: "Harvey",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-kid-caucasian-boy-round-frame-vector-illustration-cartoon-flat-style_551425-43.jpg?w=2000",
        status: "active",
        email: "Harvey@gmail.com",
        age: 27,
    },
    {
        id: 8,
        userName: "Roxie",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa69_HGc_i3MXKCPZzCfAjBZC4bXJsn0rS0Ufe6H-ctZz5FbIVaPkd1jCPTpKwPruIT3Q&usqp=CAU",
        status: "passive",
        email: "Roxie@gmail.com",
        age: 31,
    },
    {
        id: 9,
        userName: "Stark",
        img: "https://img.freepik.com/premium-vector/vector-illustration-boy-avatar-avatar-social-network-documents-redheaded-boy-with-freckles_469123-398.jpg?w=2000",
        status: "passive",
        email: "Stark@gmail.com",
        age: 24,
    },
    {
        id: 10,
        userName: "Snow",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-boy-man-round-frame-vector-cartoon-flat-illustration_551425-19.jpg?w=2000",
        status: "active",
        email: "Snow@gmail.com",
        age: 35,
    },
    {
        id: 11,
        userName: "Snow",
        img: "https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-boy-man-round-frame-vector-cartoon-flat-illustration_551425-19.jpg?w=2000",
        status: "active",
        email: "Snow@gmail.com",
        age: 35,
    },
];

