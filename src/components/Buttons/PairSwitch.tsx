import React from "react";
import Switch from "@mui/material/Switch";
import { Pair } from "../../models/models";

interface PairSwitchProps {
  pair: Pair;
  handlePairToggle: any;
}

const PairSwitch: React.FC<PairSwitchProps> = ({ pair, handlePairToggle }) => {
  return (
    <Switch
      defaultChecked
      size="small"
      onChange={() => handlePairToggle(pair)}
    />
  );
};

export default PairSwitch;
