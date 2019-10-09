// Imports
import React from 'react'
import PropTypes from 'prop-types'
import SmartDataTable from 'react-smart-data-table'
import { Image, Message } from 'semantic-ui-react'
import EditUser from './edit-user'
import DeleteUser from './delete-user'
import config from '../config'

const UsersTable = ({
  users, filterValue, perPage, getUserData,
}) => {
  const usersTableHeaders = {
    avatar: {
      transform: (value) => <Image src={value} avatar />,
    },
    groups: {
      transform: (value, index) => (Array.isArray(users[index].groups) ? `${users[index].groups.length}` : '-'),
    },
    tableActions: {
      text: 'Actions',
      invisible: false,
      sortable: false,
      filterable: false,
      transform: (value, index) => (
        <>
          <EditUser user={users[index]} getUserData={getUserData} />
          <DeleteUser userID={users[index].id} getUserData={getUserData} />
        </>
      ),
    },
  }

  return (
    <SmartDataTable
      data={users}
      headers={usersTableHeaders}
      name="users-table"
      parseImg={{
        className: 'ui avatar image',
      }}
      withLinks
      className="ui selectable table"
      emptyTable={(
        <Message content="There are no users available to display." />
      )}
      orderedHeaders={config.user.columns}
      hideUnordered
      sortable
      filterValue={filterValue}
      perPage={perPage}
    />
  )
}

/* Defines the type of data expected in each passed prop */
UsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  getUserData: PropTypes.func.isRequired,
  filterValue: PropTypes.string,
  perPage: PropTypes.number,
}

UsersTable.defaultProps = {
  filterValue: '',
  perPage: 0,
}

export default UsersTable