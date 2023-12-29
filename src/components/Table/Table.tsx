import * as React from 'react';
import Paper from '@mui/material/Paper';
import {Table as MuiTable} from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export interface QueryColumn {
  id: 'property'|'value';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface QueryDataRow {
  property: string;
  value: string;
}

export interface UrlInfoColumn {
  id: 'element'|'details';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface UrlInfoDataRow {
  element: string;
  details: string;
}

interface QueryTableProps {
  columns: readonly QueryColumn[];
  rows: QueryDataRow[];
}

interface UrlInfoTableProps {
  columns: readonly UrlInfoColumn[];
  rows: UrlInfoDataRow[];
}

export function QueryTable({ columns, rows }: QueryTableProps) {

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
            {rows
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.property+row.value}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
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



export function UrlInfoTable({ columns, rows }: UrlInfoTableProps) {

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
            {rows
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.element+row.details}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
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

