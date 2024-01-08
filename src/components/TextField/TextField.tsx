import React from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";

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
}

export const BasicTextField: React.FC<BasicTextFieldProps> = ({ value }) => {
  return (
    <NoBackgroundTextField
      id="filled-basic"
      variant="standard"
      fullWidth
      multiline
      value={value}
      InputProps={{ disableUnderline: true }}
    />
  );
};

export const WarningTextField = () => {
  <YellowOrangeTextField id="filled-basic" variant="filled" />;
};
export const ErrorTextField = () => {
  <RedTextField id="filled-basic" variant="filled" />;
};
