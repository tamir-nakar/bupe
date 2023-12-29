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

export default function Accordion() {
  const [expanded, setExpanded] = React.useState<string | false>("params");
  const [urlInfoDataRows, setUrlInfoDataRows] = React.useState<
    UrlInfoDataRow[]
  >([]);
  const [queryDataRows, setQueryDataRows] = React.useState<QueryDataRow[]>([]);

  const queryTableColumns: QueryColumn[] = [
    { id: "property", label: "property", minWidth: 200 },
    { id: "value", label: "value", minWidth: 200 },
  ];

  const urlInfoTableColumns: UrlInfoColumn[] = [
    { id: "element", label: "element", minWidth: 200 },
    { id: "details", label: "details", minWidth: 200 },
  ];

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
            <QueryTable columns={queryTableColumns} rows={queryDataRows} />
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
