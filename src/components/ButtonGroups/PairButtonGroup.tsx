import React from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CodeIcon from "@mui/icons-material/Code";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import PairSwitch from "../Buttons/PairSwitch";
import { QueryDataRow } from "../Table/Table";

interface PairButtonGroupProps {
  row: QueryDataRow;
  handlePairToggle: any,
  handleDelete: any
}

const PairButtonGroup: React.FC<PairButtonGroupProps> = ({row, handlePairToggle, handleDelete}) => {
  const fontSize = "15px";

  const buttonData = [
    { label: "Delete", icon: <DeleteIcon />, action: "delete", actionFunction: handleDelete },
    { label: "Copy", icon: <ContentCopyIcon />, action: "copy", actionFunction: ()=>{} },
    {
      label: "toggle prop",
      action: "Switch",
    },
    { label: "Encode", icon: <CodeIcon />, action: "encode", actionFunction: ()=>{} },
    { label: "Decode", icon: <CodeOffIcon />, action: "decode", actionFunction: ()=>{} },
  ];

  return (
    <ButtonGroup aria-label="small button group">
      {buttonData.map((button) => (
        <Tooltip key={button.action} title={button.label} placement="top" arrow>
          <Button onClick={()=>button.actionFunction(row)}>
            {button.action === "Switch" ? (
              <PairSwitch row={row} handlePairToggle={handlePairToggle}/>
            ) : (
              <IconButton
                aria-label={button.action}
                color="primary"
                sx={{ padding: 0, "& svg": { fontSize } }}
              >
                {button.icon}
              </IconButton>
            )}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};

export default PairButtonGroup;
