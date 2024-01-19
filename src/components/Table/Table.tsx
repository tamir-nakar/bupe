import Paper from "@mui/material/Paper";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Order } from "../Accordion/Accordion";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";

import {
  BasicTextField,
  WarningTextField,
  ErrorTextField,
} from "../TextField/TextField";
import PairButtonGroup from "../ButtonGroups/PairButtonGroup";
export interface QueryColumn {
  id: "property" | "value" | "toolbox";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export interface QueryDataRow extends Pair {
  isActive: boolean;
  toolbox: string;
  isError?: boolean;
  isWarning?: boolean;
}

export interface Pair {
  property: string; // property should be unique
  value: string;
}

export interface UrlInfoColumn {
  id: "element" | "details";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export interface UrlInfoDataRow {
  element: string;
  details: string;
}

interface QueryTableProps {
  columns: readonly QueryColumn[];
  rows: QueryDataRow[];
  handleSort: any;
  orderBy?: keyof QueryDataRow;
  order?: Order;
  handlePairToggle: any;
  handleDelete: any;
  handlePairChange: any;
}

interface UrlInfoTableProps {
  columns: readonly UrlInfoColumn[];
  rows: UrlInfoDataRow[];
}

export function QueryTable({
  columns,
  rows,
  orderBy,
  order,
  handleSort,
  handlePairToggle,
  handleDelete,
  handlePairChange,
}: QueryTableProps) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                return (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={(e) => {
                        return handleSort(e, column.id);
                      }}
                    >
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow hover tabIndex={-1} key={row.property+idx}>
                {columns.map((column, idx) => {
                  const value = row[column.id];
                  const additionalSx = row.isActive
                    ? {}
                    : { backgroundColor: "#bdbdbd" };
                  if (column.id !== "toolbox") {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          padding: 0,
                          paddingRight: "22px",
                          ...additionalSx,
                        }}
                      >
                        <BasicTextField
                          key={idx+row.property}
                          row={row}
                          value={value}
                          type={column.id}
                          handlePairChange={handlePairChange}
                        />
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ padding: 0, ...additionalSx }}
                      >
                        <PairButtonGroup
                          row={row}
                          handlePairToggle={handlePairToggle}
                          handleDelete={handleDelete}
                        />

                        {/* {column.format && typeof value === "number"
                      ? column.format(value)
                      : value} */}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}

export function UrlInfoTable({ columns, rows }: UrlInfoTableProps) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.element + row.details}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}
