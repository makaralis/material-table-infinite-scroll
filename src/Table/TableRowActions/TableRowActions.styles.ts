import { style } from "typestyle";

export let TableRowActionsStylesOverrides = {
  actionButton: {},
  actionMenuButton: {},
  actions: {},
  hiddenAction: {}
};

export const TableRowActionsStyles = {
  actionButton: style(
    {
      $nest: {
        "&:hover": {
          backgroundColor: "#f4f4f4"
        }
      },
      fontSize: "17px",
      padding: "0 5px"
    },
    TableRowActionsStylesOverrides.actionButton
  ),
  actionMenuButton: style(
    {
      $nest: {
        [`> svg`]: {
          fontSize: "1.7em"
        }
      },
      padding: 0
    },
    TableRowActionsStylesOverrides.actionMenuButton
  ),

  actions: style(
    {
      $nest: {
        "& .ms-DetailsRow": {
          borderBottom: "1px solid #b1bbc5"
        }
      },
      display: "flex",
      flexFlow: "row"
    },
    TableRowActionsStylesOverrides.actions
  ),

  hiddenAction: style(
    {
      visibility: "hidden"
    },
    TableRowActionsStylesOverrides.hiddenAction
  )
};
