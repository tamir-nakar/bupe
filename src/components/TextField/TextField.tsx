import React, { ChangeEvent } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import { QueryColumn, QueryDataRow } from "../Table/Table";
import { constants } from "buffer";
const YellowOrangeTextField = styled(TextField)`
  background-color: #ffb74d; /* Yellow-Orange tone */
`;

const RedTextField = styled(TextField)`
  background-color: #ef5350; /* Red tone */
`;

const NoBackgroundTextField = styled(TextField)`
  padding: 10px;

  & input {
    background-color: transparent !important;
  }

  &:hover input {
    background-color: transparent !important;
  }
`;

interface BasicTextFieldProps {
  value: string;
  handlePairChange: any;
  type: QueryColumn["id"];
  row: QueryDataRow;
}

export const BasicTextField: React.FC<BasicTextFieldProps> = ({
  value,
  handlePairChange,
  type,
  row,
}) => {
  return (
    <NoBackgroundTextField
      variant="standard"
      fullWidth
      multiline
      onFocus={function (e:any) {
        const val = e.target.value;
        e.target.value = "";
        e.target.value = val;
      }}
      autoFocus={true}
      value={value}
      InputProps={{ disableUnderline: true }}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        handlePairChange(row, e.target.value, type, e)
      }
    />
  );
};

export const WarningTextField = () => {
  <YellowOrangeTextField id="filled-basic" variant="filled" />;
};
export const ErrorTextField = () => {
  <RedTextField id="filled-basic" variant="filled" />;
};
