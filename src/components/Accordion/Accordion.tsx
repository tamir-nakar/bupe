import React, { useEffect } from "react";
import MuiAccordion from "@mui/material/Accordion"; // Aliasing Accordion as MuiAccordion
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  UrlInfoColumn,
  UrlInfoDataRow,
  QueryDataRow,
  QueryColumn,
  QueryTable,
  UrlInfoTable,
} from "../Table/Table";
import { getActiveTabUrl } from "../../chromeUtils";

export type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
export default function Accordion() {
  const [expanded, setExpanded] = React.useState<string | false>("params");
  const [urlInfoDataRows, setUrlInfoDataRows] = React.useState<
    UrlInfoDataRow[]
  >([]);
  const [queryDataRows, setQueryDataRows] = React.useState<QueryDataRow[]>([]);
  const [order, setOrder] = React.useState<Order>();
  const [orderBy, setOrderBy] = React.useState<keyof QueryDataRow>(); // order by property or value

  const queryTableColumns: QueryColumn[] = [
    { id: "property", label: "property", minWidth: 120 },
    { id: "value", label: "value", minWidth: 200 },
    { id: "toolbox", label: "toolbox", minWidth: 100 },
  ];

  const urlInfoTableColumns: UrlInfoColumn[] = [
    { id: "element", label: "element", minWidth: 200 },
    { id: "details", label: "details", minWidth: 200 },
  ];

  const handleSort = (
    event: React.MouseEvent<unknown>,
    property: keyof QueryDataRow
  ) => {
    const isAsc = !order || order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log("in handle request sort");
  };

  useEffect(() => {
    const prepareInfo = async () => {
      const url = await getActiveTabUrl();
      if (url) {
        const urlParsed = new URL(url);
        setUrlInfoDataRows((prevRows) => [
          ...prevRows,
          {
            element: "host name",
            details: urlParsed.hostname,
          },
          {
            element: "protocol",
            details: urlParsed.protocol,
          },
          {
            element: "path",
            details: urlParsed.pathname,
          },
        ]);

        const searchParamsArray = Array.from(
          urlParsed.searchParams.entries()
        ).map(([key, value]) => ({
          property: key,
          value: value,
          toolbox: "dd",
        }));

        // Update the state with the new array
        setQueryDataRows((prevRows) => [...prevRows, ...searchParamsArray]);
      }
    };

    prepareInfo();

    return () => {
      // Cleanup logic goes here will be active as the component unmounts
    };
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {/* Accordion 1️⃣ ---------------------------------------------------------------- */}
      <MuiAccordion
        expanded={expanded === "params"}
        onChange={handleChange("params")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Params</Typography>
          {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <QueryTable
              columns={queryTableColumns}
              rows={
                order && orderBy
                  ? queryDataRows.sort(
                      getComparator<keyof QueryDataRow>(order, orderBy)
                    )
                  : queryDataRows
              }
              orderBy={orderBy}
              order={order}
              handleSort={handleSort}
            />
          </Typography>
        </AccordionDetails>
      </MuiAccordion>
      {/* Accordion 2️⃣ ---------------------------------------------------------------- */}
      <MuiAccordion
        expanded={expanded === "URL info"}
        onChange={handleChange("URL info")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>URL Info</Typography>
          {/* <Typography sx={{ color: 'text.secondary' }}>
          Text of panel 2
          </Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <UrlInfoTable columns={urlInfoTableColumns} rows={urlInfoDataRows} />
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
