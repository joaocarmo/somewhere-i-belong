// Imports
import React from 'react'
import {
  Divider, Dropdown, Header, Icon, Input, Message, Placeholder, Segment,
} from 'semantic-ui-react'
import UsersTable from './users-table'
import { getUsers } from '../api/actions'

class Users extends React.Component {
  constructor() {
    super()

    this.state = {
      users: [],
      filterValue: '',
      perPage: 10,
      isLoading: false,
      error: false,
      errorMessage: '',
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      getUsers().then(({ status, message, data }) => {
        if (status === 'success') {
          this.setState({
            users: data,
            isLoading: false,
            error: false,
            errorMessage: '',
          })
        } else {
          this.setState({
            users: [],
            isLoading: false,
            error: true,
            errorMessage: message,
          })
        }
      }).catch((errorMessage) => {
        this.setState({
          isLoading: false,
          error: true,
          errorMessage,
        })
      })
    })
  }

  render() {
    const {
      users, filterValue, perPage, isLoading, error, errorMessage,
    } = this.state
    return (
      <Segment>
        <Header as="h2" icon textAlign="center">
          <Icon name="user" circular />
          <Header.Content>Users</Header.Content>
          <Header.Subheader>
            Manage the users&apos; attributes and groups
          </Header.Subheader>
        </Header>
        <Divider />
        {error && errorMessage && (
          <Message error content={`ERROR: ${errorMessage}`} />
        )}
        {isLoading && (
          <Placeholder fluid>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        )}
        {users.length > 0 && (
          <>
            <div style={{ margin: '1em 0em' }}>
              <Input
                icon="search"
                placeholder="Filter..."
                onChange={(e, { value }) => this.setState({ filterValue: value })}
              />
              <span style={{ margin: '0em 0.5em' }} />
              <Dropdown
                compact
                selection
                value={perPage}
                options={[10, 25, 50, 100].map((value) => ({
                  key: value, text: value, value,
                }))}
                onChange={(e, { value }) => this.setState({ perPage: value })}
              />
            </div>
            <UsersTable
              users={users}
              filterValue={filterValue}
              perPage={perPage}
            />
          </>
        )}
      </Segment>
    )
  }
}

export default Users
