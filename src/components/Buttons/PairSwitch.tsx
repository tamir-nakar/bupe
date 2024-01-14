import React from "react";
import Switch from "@mui/material/Switch";
import { QueryDataRow } from "../Table/Table";

interface PairSwitchProps {
  row: QueryDataRow;
  handlePairToggle: any;
}

const PairSwitch: React.FC<PairSwitchProps> = ({ row, handlePairToggle }) => {
  return (
    <Switch
      defaultChecked
      size="small"
      onChange={() => handlePairToggle(row)}
    />
  );
};

export default PairSwitch;
