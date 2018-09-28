import { connect } from '../lib/database'
import debugFactory from 'debug';
import { inviteUserToSalon } from '../sagas/invite-user-to-salon'
import { getSalonUsers } from '../sagas/get-salon-users'
import { updateSalonUserProperties } from '../sagas/update-salon-user-properties';
import { removeSalonUser } from '../sagas/remove-salon-user'

const debug = debugFactory('controller:schedule');

export async function getUserDetails(ctx) {
  const getUserName = require('../utils/get-user-name')
  const getUserRole = require('../utils/get-user-role')
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/user-details.html'
  const viewLocal = {
    error: null,
    details: {}
  }

  try {
    const salonUsers = await getSalonUsers(client, salonId)
    const salonUser = salonUsers.find(v => v.user_id === userId);

    if (!salonUser) throw new Error('User doe\'s not exist');
    
    viewLocal.details = {
      name: getUserName(salonUser.user),
      email: salonUser.user.email,
      role: getUserRole(salonUser)
    }
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}

export async function updateUserDetails(ctx) {
  const userDetails = ctx.request.body
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/invite-user.html'
  const viewLocal = {
    salonId,
    error: null,
    salonUsers: []
  }

  try {
    await updateSalonUserProperties(client, salonId, userId, userDetails)

    viewLocal.salonUsers = await getSalonUsers(client, salonId)
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}


export async function removeUser(ctx) {
  const salonId = parseInt(ctx.params.salonId)
  const userId = parseInt(ctx.params.userId)
  const client = await connect()
  const viewPath = 'schedule/invite-user.html'
  const viewLocal = {
    salonId,
    error: null,
    salonUsers: []
  }

  try {
    await removeSalonUser(client, salonId, userId)

    viewLocal.salonUsers = await getSalonUsers(client, salonId)
  }
  catch(e) {
    viewLocal.error = (e.message || 'Something went wrong. Please try later');
  }

  ctx.render(viewPath, viewLocal);

  client.release()
}
