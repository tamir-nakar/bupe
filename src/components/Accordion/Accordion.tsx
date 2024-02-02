import React, { useEffect, ChangeEvent } from "react";
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
  Pair,
} from "../Table/Table";
import { getActiveTabUrl, getLocalData, setLocalData } from "../../chromeUtils";

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

function getComparator<Key extends keyof QueryDataRow>(
  order: Order,
  orderBy: Key
): (a: QueryDataRow, b: QueryDataRow) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const queryTableColumns: QueryColumn[] = [
  { id: "property", label: "property", minWidth: 120 },
  { id: "value", label: "value", minWidth: 200 },
  { id: "toolbox", label: "toolbox", minWidth: 100 },
];

const urlInfoTableColumns: UrlInfoColumn[] = [
  { id: "element", label: "element", minWidth: 200 },
  { id: "details", label: "details", minWidth: 200 },
];

export default function Accordion() {
  const [expanded, setExpanded] = React.useState<string | false>("params");
  const [urlInfoDataRows, setUrlInfoDataRows] = React.useState<
    UrlInfoDataRow[]
  >([]);
  const [queryDataRowsMap, setQueryDataRowsMap] = React.useState<{
    [key: string]: QueryDataRow;
  }>({});
  const [toggledOffDataRows, setToggledOffDataRows] = React.useState<string[]>(
    []
  );
  const [order, setOrder] = React.useState<Order>();
  const [orderBy, setOrderBy] = React.useState<keyof QueryDataRow>(); // order by property or value
  const [currentUrl, setCurrentUrl] = React.useState<string>();
  const [originalUrl, setOriginalUrl] = React.useState<string>(); // original url on session start

  const handleSort = (
    event: React.MouseEvent<unknown>,
    property: keyof QueryDataRow
  ) => {
    const isAsc = !order || order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function getQueryDataRows() {
    console.log("drawing:");
    console.log(queryDataRowsMap);
    return Object.values(queryDataRowsMap);
  }

  const updateQueryDataRow = (updates: [string, any][]) => {
    setQueryDataRowsMap((prevMap) => {
      const updatedMap = { ...prevMap };

      updates.forEach(([key, value]) => {
        if (updatedMap[key]) {
          // Update the specified property with the new value

          updatedMap[key] = { ...updatedMap[key], ...value };
        }
      });

      return updatedMap;
    });
  };

  const deleteQueryDataRow = (keyToDel: string) => {
    setQueryDataRowsMap((prevMap) => {
      const updatedMap = { ...prevMap };

      if (updatedMap[keyToDel]) {
        // Update the specified property with the new value

        delete updatedMap[keyToDel];
      }

      return updatedMap;
    });
  };

  // on first load
  useEffect(() => {
    const prepareInfo = async () => {
      const url = await getActiveTabUrl();
      if (url) {
        const urlParsed = new URL(url);
        setCurrentUrl(url);
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

        const newQueryDataRowsMap: { [key: string]: QueryDataRow } = {};
        urlParsed.searchParams.forEach((value, key) => {
          newQueryDataRowsMap[key] = {
            property: key,
            value,
            toolbox: "",
            isActive: true,
          };
        });

        console.log("queryDataRowsMap 🗺");
        console.log(newQueryDataRowsMap);

        const toggledOffDataRows =
          (await getLocalData("toggled_off_data_rows")) || {};

        for (let key in toggledOffDataRows) {
          newQueryDataRowsMap[key] = {
            property: key,
            value: toggledOffDataRows[key],
            toolbox: "",
            isActive: false,
          };
        }

        // Update the state with the new array
        setQueryDataRowsMap(newQueryDataRowsMap);
      }
      // TODO: if not url - present a nice message of OOPS...
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

  const updateProperty = (
    url: URL,
    keyToDelete: string,
    keyToAdd: string,
    valueToAdd: string
  ) => {
    // Get the query parameters as an array of key-value pairs
    //@ts-ignore
    const queryParamsArray = [...url.searchParams.entries()];

    // Find the index of the parameter to delete
    const indexToDelete = queryParamsArray.findIndex(
      ([key]) => key === keyToDelete
    );

    if (indexToDelete !== -1) {
      // Replace the parameter at the same index with the new key-value pair
      queryParamsArray.splice(indexToDelete, 1, [keyToAdd, valueToAdd]);

      // Reconstruct the URL with the updated parameters
      url.search = new URLSearchParams(queryParamsArray).toString();
    }

    return url;
  };
  const handlePairToggle = async (row: QueryDataRow) => {
    const oldActiveState = row.isActive;
    updateQueryDataRow([[row.property, { isActive: !oldActiveState }]]);

    let url = new URL(currentUrl!);
    const toggledOffDataRows: { [key: string]: Pair } =
      (await getLocalData("toggled_off_data_rows")) || {};
    if (!oldActiveState) {
      // off -> on
      url.searchParams.set(row.property, row.value);
      delete toggledOffDataRows[row.property];
      await setLocalData({
        toggled_off_data_rows: toggledOffDataRows,
      });
    } else {
      // on -> off
      url.searchParams.delete(row.property);
      await setLocalData({
        toggled_off_data_rows: {
          ...toggledOffDataRows,
          [row.property]: row.value,
        },
      });
    }

    chrome.runtime.sendMessage({ type: "updateUrl", value: url.toString() });
    setCurrentUrl(url.toString());
  };

  const handleDelete = async (row: QueryDataRow) => {
    let url = new URL(currentUrl!);
    const toggledOffDataRows: { [key: string]: Pair } =
      (await getLocalData("toggled_off_data_rows")) || {};
    deleteQueryDataRow(row.property);
    url.searchParams.delete(row.property);
    delete toggledOffDataRows[row.property];
    await setLocalData({
      toggled_off_data_rows: toggledOffDataRows,
    });

    chrome.runtime.sendMessage({ type: "updateUrl", value: url.toString() });
    setCurrentUrl(url.toString());
  };

  const handlePairChange = async (
    row: QueryDataRow,
    newValue: string,
    changedElement: QueryColumn["id"],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    //clearFocus()
    let url = new URL(currentUrl!);
    // console.log('after clear focus')
    //console.log(queryDataRowsMap)
    if (changedElement === "property") {
      setQueryDataRowsMap((prevMap) => {
        const updatedMap = { ...prevMap };

        delete updatedMap[row.property];
        updatedMap[newValue] = { ...row, property: newValue};
        return updatedMap;
      });

      url = updateProperty(url, row.property, newValue, row.value);
      console.log(url);
      // url.searchParams.delete(row.property);
      // url.searchParams.set(newValue, row.value);
    } else if (changedElement === "value") {
      setQueryDataRowsMap((prevMap) => {
        const updatedMap = { ...prevMap };

        updatedMap[row.property] = {
          ...updatedMap[row.property],
          value: newValue,
        };
        return updatedMap;
      });

      url.searchParams.set(row.property, newValue);
    }

    setOrder(undefined); // we must disable the sort. otherwise, value may move to another textInput, but focus will remain at the same one
    chrome.runtime.sendMessage({ type: "updateUrl", value: url.toString() });
    setCurrentUrl(url.toString());
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
                  ? getQueryDataRows().sort(
                      getComparator<keyof QueryDataRow>(order, orderBy)
                    )
                  : getQueryDataRows()
              }
              orderBy={orderBy}
              order={order}
              handleSort={handleSort}
              handlePairToggle={handlePairToggle}
              handleDelete={handleDelete}
              handlePairChange={handlePairChange}
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
