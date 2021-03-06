// Direct request handlers for the API endpoints
import faker from 'faker'
import api from './api'
import {
  fakeFetch, buildStateFromFields, writeToLS, readFromLS, cleanupArray,
} from '../misc/helpers'
import config from '../config'

const genFakeUsers = () => {
  let users = []
  if (config.useFaker) {
    users = readFromLS('users') || []
    if (!users.length) {
      const total = config.numFakeUsers
      for (let i = 0; i < total; i += 1) {
        users.push({
          id: i + 1,
          avatar: faker.image.avatar(),
          username: faker.internet.userName(),
          fullName: faker.name.findName(),
          email: faker.internet.email(),
          groups: [],
        })
      }
      writeToLS('users', users)
    }
  }
  users = readFromLS('users') || []
  return {
    status: 'success',
    message: '',
    data: users,
  }
}

const createFakeDBUser = (jsonData) => {
  const fields = Object.keys(config.user.attrs)
  const userObj = buildStateFromFields(fields, config.user.attrs)
  const jsonKeys = Object.keys(jsonData)
  jsonKeys.forEach((key) => {
    userObj[key] = jsonData[key]
  })
  const users = readFromLS('users') || []
  userObj.id = users.length + 1
  users.push(userObj)
  writeToLS('users', users)
  return userObj
}

const addUserToFakeDBGroups = ({ id: userID, groups: userGroups } = {}) => {
  if (Array.isArray(userGroups) && userGroups.length) {
    const groups = readFromLS('groups') || []
    for (let pos = 0, N = groups.length; pos < N; pos++) {
      const { id: groupID } = groups[pos]
      if (!Array.isArray(groups[pos].members)) {
        groups[pos].members = []
      }
      // Remove user from groups the user is not anymore
      if (groups[pos].members.includes(userID) && !userGroups.includes(groupID)) {
        const userPos = groups[pos].members.findIndex((userInGroupID) => userInGroupID === userID)
        groups[pos].members.splice(userPos, 1)
      // Add user to groups the user is not in yet
      } else if (!groups[pos].members.includes(userID) && userGroups.includes(groupID)) {
        groups[pos].members.push(userID)
      }
      groups[pos].members = cleanupArray(groups[pos].members)
    }
    writeToLS('groups', groups)
  }
}

const removeUserFromFakeDBGroup = (userID) => {
  if (userID) {
    const groups = readFromLS('groups') || []
    for (let pos = 0, N = groups.length; pos < N; pos++) {
      if (!Array.isArray(groups[pos].members)) {
        groups[pos].members = []
      }
      if (groups[pos].members.includes(userID)) {
        const userPos = groups[pos].members.findIndex((userInGroupID) => userInGroupID === userID)
        groups[pos].members.splice(userPos, 1)
      }
      groups[pos].members = cleanupArray(groups[pos].members)
    }
    writeToLS('groups', groups)
  }
}

const createFakeUser = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.length) {
      const newUser = createFakeDBUser(jsonData)
      addUserToFakeDBGroups(newUser)
      return {
        status: 'success',
        message: '',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const editFakeDBUser = (userObj) => {
  if (userObj && userObj.id) {
    const users = readFromLS('users') || []
    const pos = users.findIndex((user) => user && user.id === userObj.id)
    if (pos > -1) {
      users[pos] = userObj
    }
    writeToLS('users', users)
  }
}

const editFakeUser = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.length) {
      editFakeDBUser(jsonData)
      addUserToFakeDBGroups(jsonData)
      return {
        status: 'success',
        message: '',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const deleteFakeDBUser = (userID) => {
  if (userID) {
    const users = readFromLS('users') || []
    if (users.length) {
      const pos = users.findIndex((user) => user && user.id === userID)
      if (pos > -1) {
        users.splice(pos, 1)
        writeToLS('users', users)
      }
    }
  }
}

const deleteFakeUser = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.includes('userID')) {
      const { userID } = jsonData
      deleteFakeDBUser(userID)
      removeUserFromFakeDBGroup(userID)
      return {
        status: 'success',
        message: '',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const genFakeGroups = () => {
  let groups = []
  if (config.useFaker) {
    groups = readFromLS('groups') || []
    if (!groups.length) {
      const total = config.numFakeGroups
      for (let i = 0; i < total; i += 1) {
        groups.push({
          id: i + 1,
          name: faker.name.jobType(),
          description: faker.lorem.sentence(),
          members: [],
        })
      }
      writeToLS('groups', groups)
    }
  }
  groups = readFromLS('groups') || []
  return {
    status: 'success',
    message: '',
    data: groups,
  }
}

const createFakeDBGroup = (jsonData) => {
  const fields = Object.keys(config.group.attrs)
  const groupObj = buildStateFromFields(fields, config.group.attrs)
  const jsonKeys = Object.keys(jsonData)
  jsonKeys.forEach((key) => {
    groupObj[key] = jsonData[key]
  })
  const groups = readFromLS('groups') || []
  groupObj.id = groups.length + 1
  groups.push(groupObj)
  writeToLS('groups', groups)
}

const createFakeGroup = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.length) {
      createFakeDBGroup(jsonData)
      return {
        status: 'success',
        message: '',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const editFakeDBGroup = (groupObj) => {
  if (groupObj && groupObj.id) {
    const groups = readFromLS('groups') || []
    const pos = groups.findIndex((group) => group && group.id === groupObj.id)
    if (pos > -1) {
      groups[pos] = groupObj
    }
    writeToLS('groups', groups)
  }
}

const editFakeGroup = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.length) {
      editFakeDBGroup(jsonData)
      return {
        status: 'success',
        message: '',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const deleteFakeDBGroup = (groupID) => {
  if (groupID) {
    const groups = readFromLS('groups') || []
    if (groups.length) {
      const pos = groups.findIndex((group) => group && group.id === groupID)
      if (pos > -1) {
        groups.splice(pos, 1)
        writeToLS('groups', groups)
      }
    }
  }
}

const deleteFakeGroup = (url, { body }) => {
  if (body) {
    const jsonData = JSON.parse(body)
    const jsonKeys = Object.keys(jsonData)
    if (jsonKeys.includes('id')) {
      const { id: groupID, members } = jsonData
      if (!members || (Array.isArray(members) && members.length === 0)) {
        deleteFakeDBGroup(groupID)
        return {
          status: 'success',
          message: '',
          data: [],
        }
      }
      return {
        status: 'error',
        message: 'can only delete groups without members',
        data: [],
      }
    }
  }
  return {
    status: 'error',
    message: 'no data received',
    data: [],
  }
}

const getUsers = () => fakeFetch(
  api.users.read.url, { ...api.users.read.opts, handlerFn: genFakeUsers },
)

const createUser = (data) => fakeFetch(
  api.users.create.url,
  { ...api.users.create.opts, handlerFn: createFakeUser, body: JSON.stringify(data) },
)

const editUser = (data) => fakeFetch(
  api.users.update.url,
  { ...api.users.update.opts, handlerFn: editFakeUser, body: JSON.stringify(data) },
)

const deleteUser = (data) => fakeFetch(
  api.users.delete.url,
  { ...api.users.delete.opts, handlerFn: deleteFakeUser, body: JSON.stringify(data) },
)

const getGroups = () => fakeFetch(
  api.groups.read.url, { ...api.groups.read.opts, handlerFn: genFakeGroups },
)

const createGroup = (data) => fakeFetch(
  api.groups.create.url,
  { ...api.groups.create.opts, handlerFn: createFakeGroup, body: JSON.stringify(data) },
)

const editGroup = (data) => fakeFetch(
  api.groups.update.url,
  { ...api.groups.update.opts, handlerFn: editFakeGroup, body: JSON.stringify(data) },
)

const deleteGroup = (data) => fakeFetch(
  api.groups.delete.url,
  { ...api.groups.delete.opts, handlerFn: deleteFakeGroup, body: JSON.stringify(data) },
)

export {
  getUsers, createUser, editUser, deleteUser,
  getGroups, createGroup, editGroup, deleteGroup,
}
