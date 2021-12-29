import { style, fontFace } from "typestyle";

fontFace({
  fontFamily: "Material Icons",
  fontStyle: "normal",
  fontWeight: 400,
  src:
    "url(https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2')"
});

export let TableStyleOverrides = {
  columnTypeRowIcon: {},
  iconButtonRoot: {},
  table: {},
  tableColumnRow: {},
  tableHeader: {},
  tableHeaderColumRow: {},
  tableHeaderWrapper: {}
};

const elementsColor = "#333333";

export const getTableStyles = () => ({
  columnTypeRowIcon: style(
    { color: elementsColor },
    TableStyleOverrides.columnTypeRowIcon
  ),
  detailsRow: style({
    $nest: {
      "& .ms-DetailsRow-check": {
        height: "100%"
      }
    }
  }),
  table: style(
    {
      $nest: {
        "& .is-checked": {
          $nest: {
            "&::before": {
              backgroundColor: elementsColor
            }
          }
        },
        "& .material-icons": {
          direction: "ltr",
          display: "inline-block",
          fontFamily: "Material Icons",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: "normal",
          letterSpacing: "normal",
          lineHeight: 1,
          textTransform: "none",
          verticalAlign: "middle",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          height: "1em",
          width: "1em"
        },
        "& .ms-Check": {
          $nest: {
            "&::before": {
              backgroundColor: elementsColor
            }
          }
        }
      }
    },
    TableStyleOverrides.table
  ),
  tableHeader: style(
    {
      fontSize: "12px",
      marginBottom: "10px"
    },
    TableStyleOverrides.tableHeader
  ),
  tableHeaderColumRow: style(
    {
      $nest: {
        [`i[class^="sortIcon"]`]: {
          color: elementsColor,
          fontSize: "12px",
          fontWeight: "bold"
        }
      },
      color: elementsColor,
      fontSize: "14px",
      fontWeight: 600,
      height: "100%",
      lineHeight: "50px"
    },
    TableStyleOverrides.tableHeaderColumRow
  ),
  tableHeaderWrapper: style(
    {
      $nest: {
        [`> div`]: {
          borderBottom: `1px solid ${elementsColor}`,
          borderTop: `1px solid ${elementsColor}`,
          color: elementsColor,
          height: "50px"
        }
      }
    },
    TableStyleOverrides.tableHeaderWrapper
  ),

  tableColumnRow: style(
    {
      $nest: {
        "&:first-child": { fontWeight: 600 },
        "&> svg": {
          height: "auto",
          width: "15px"
        }
      },
      color: elementsColor,
      fontSize: "12px",
      fontWeight: "normal",
      lineHeight: "35px"
    },
    TableStyleOverrides.tableColumnRow
  ),

  iconButtonRoot: style(
    { color: elementsColor, padding: 0 },
    TableStyleOverrides.iconButtonRoot
  ),

  actionColumn: {
    boxShadow: "-7px 0px 5px -1px rgba(0,0,0,0.13)",
    position: "sticky",
    right: 0,
    backgroundColor: "white",
    backgroundClip: "padding-box"
  },

  actionHeader: {
    position: "sticky",
    right: 0
  }
});
