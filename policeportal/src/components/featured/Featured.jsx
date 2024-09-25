import "./featured.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
function Featured() {
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Cases</h1>

      </div>
      <div className="bottom">
        <div className="featuredChart">
            <CircularProgressbar value={75} text={"75%"} strokeWidth={5}  />
            <div className="reports">
              <span className="Crime">Crime rate<KeyboardArrowUpRoundedIcon className="icon"/></span>
              <span className="Crime">Last Week<KeyboardArrowUpRoundedIcon className="icon"/></span>
              <span className="Crime">Last Month<KeyboardArrowUpRoundedIcon className="icon"/></span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
