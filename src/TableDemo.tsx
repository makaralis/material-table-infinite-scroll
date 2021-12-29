import * as React from "react";

import { Button } from "@material-ui/core";
import { Table, TableStyleOverrides } from "./Table";
import { ITableColumn } from "./Table/Model/ITableColumn";
import { IContextMenuAction } from "./Table/Model/IContextMenuAction";
import { IRowAction } from "./Table/Model/IRowAction";
import { ITableOptions } from "./Table/Model/ITableOptions";
// tslint:disable
export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Location {
  street: string;
  city: string;
  state: string;
  postcode: number;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface Dob {
  date: Date;
  age: number;
}

export interface Registered {
  date: Date;
  age: number;
}

export interface Id {
  name: string;
  value: string;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface RootObject {
  gender: string;
  name: Name;
  location: Location;
  email: string;
  login: Login;
  dob: Dob;
  registered: Registered;
  phone: string;
  cell: string;
  id: Id;
  picture: Picture;
  nat: string;
}

export interface Info {
  page: number;
  results: number;
  seed: string;
  version: string;
}

export interface Root {
  results: RootObject[];
  info: Info;
}
export interface IUser {
  name: string;
  email: string;
}
export class UsersTable extends Table<IUser> {}

export const UserColumns: Array<ITableColumn<IUser>> = [
  {
    fieldName: "email",
    title: "Email"
  },
  {
    fieldName: "name",
    title: "Name"
  }
];

export const TableContextActions: IContextMenuAction[] = [
  { label: "Edit", iconName: "edit" },
  { label: "Send via Email" },
  { label: "Send on Workflow" },
  { label: "Send on Transmittal" },
  { label: "Produce file" },
  { label: "Import file" },
  { label: "Save as new" },
  { label: "Void" },
  { label: "Add to Favorites" },
  { label: "Add to Collection" },
  { label: "Add to Package" },
  { label: "Add Related to Collection" },
  { label: "Lock/Unlock (toggle icons)" },
  { label: "Export" },
  { label: "Print profile" },
  { label: "Multiple download" }
];

export const TableRowActions: IRowAction[] = [
  {
    icon: "account_circle",
    onClick: (event: any, data: any) => {
      console.log(data);
    },
    tooltip: "show user info"
  }
];

interface ITableDemoState {
  users: IUser[];
  hasMore: boolean;
}

class UsersTableDemo extends React.Component<any, ITableDemoState> {
  private reloadCount: number = 0;
  constructor(props) {
    super(props);

    this.state = {
      hasMore: true,
      users: []
    };
  }
  public async componentDidMount() {
    const results = await this.loadUsers();
    this.setState({
      users: [...this.state.users, ...results]
    });
  }

  public render() {
    TableStyleOverrides.table = {
      $nest: {
        "& .material-icons": {
          fontFamily: "Material Icons For IE11"
        }
      }
    };

    const options: ITableOptions = {
      canFilter: false,
      columnsButton: false,
      grouping: false,
      showHeader: true,
      showSearch: false,
      showSelectAllCheckbox: false,
      showSelection: false,
      showToolbar: false,

      // tslint:disable-next-line:object-literal-sort-keys
      showEmptyDataSourceMessage: true
    };

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.loadFilteredUsers}
        >
          Load data
        </Button>
        <UsersTable
          items={this.state.users}
          height={"400px"}
          columns={UserColumns}
          contextMenuActions={TableContextActions}
          onSelectionChange={(data) => {
            // tslint:disable
            console.log(data);
          }}
          height={"400px"}
          // headerText={`Showing ${this.state.users.length} results`}
          options={options}
          selectionIdProperty={""}
          hasMore={true}
          rowActions={TableRowActions}
          loadMoreItems={this.loadUsers}
          editable={false}
          editableActions={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              })
          }}
        />
      </div>
    );
  }

  loadFilteredUsers = async (): Promise<IUser[]> => {
    const users = await this.loadUsers();
    const filteredUsers = users.slice(0, 5);
    this.setState({
      users: [...filteredUsers]
    });

    return filteredUsers;
  };

  loadUsers = async (): Promise<IUser[]> => {
    const response: Response = await fetch(
      "https://randomuser.me/api/?results=10",
      {
        method: "GET"
      }
    );

    const data = await this.parseJSON<Root>(response);
    let users: IUser[] = [];
    data.results.map((user) => {
      users.push({
        name: user.name.first + " " + user.name.last,
        email: user.email
      });
    });

    this.reloadCount += 1;
    if (this.reloadCount === 3) {
      this.setState({ hasMore: false });
    }

    return users;
  };

  parseJSON = async function <T>(response: Response): Promise<T> {
    let json;
    try {
      json = await response.json();
    } catch {
      json = "{}";
    }

    return json;
  };
}

export default UsersTableDemo;
