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
import { Pair } from "../../models/models";

interface PairButtonGroupProps {
  pair: Pair;
  handlePairToggle: any
}

const PairButtonGroup: React.FC<PairButtonGroupProps> = ({pair, handlePairToggle}) => {
  const fontSize = "15px";

  const buttonData = [
    { label: "Delete", icon: <DeleteIcon />, action: "delete" },
    { label: "Copy", icon: <ContentCopyIcon />, action: "copy" },
    {
      label: "toggle prop",
      action: "Switch",
    },
    { label: "Encode", icon: <CodeIcon />, action: "encode" },
    { label: "Decode", icon: <CodeOffIcon />, action: "decode" },
  ];

  return (
    <ButtonGroup aria-label="small button group">
      {buttonData.map((button) => (
        <Tooltip key={button.action} title={button.label} placement="top" arrow>
          <Button>
            {button.action === "Switch" ? (
              <PairSwitch pair={pair} handlePairToggle={handlePairToggle}/>
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
