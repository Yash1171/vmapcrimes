import "./table.scss"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function List() {
    const rows = [
        {
            id: 1,
            victim: "Carol",
            crime: "Murder",
            location: "Anand_Vihar",
            status: "Cleared",
        },
        {
            id: 2,
            victim: "Jack",
            crime: "Kidnapping",
            location: "Seemapur",
            status: "Not Cleared",
        }
      ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Victim</TableCell>
            <TableCell className="tableCell">Crime</TableCell>
            <TableCell className="tableCell">Location</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.victim}</TableCell>
              <TableCell className="tableCell">{row.crime}</TableCell>
              <TableCell className="tableCell">{row.location}</TableCell>
              <TableCell className="tableCell">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    
  )
}

export default List
