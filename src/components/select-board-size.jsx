import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import "../styles/main-page.css";

export default function SelectBoardSize(props) {
  return (
    <div className="select-board">
      <FormControl disabled={props.disabled} fullWidth>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.value}
          label={props.label}
          onChange={props.callback}
        >
          {props.values.map((el, index) => {
            return (
              <MenuItem key={index} value={el}>
                {el}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
