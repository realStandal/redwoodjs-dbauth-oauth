import { db } from 'src/lib/db'
import { DbAuthHandler } from '@redwoodjs/api'

export const handler = async (event, context) => {
  const forgotPasswordOptions = {
    handler: (user) => {
      return user
    },

    expires: 60 * 60 * 24,

    errors: {
      usernameNotFound: 'Username not found',
      usernameRequired: 'Username is required',
    },
  }

  const loginOptions = {
    handler: (user) => {
      return user
    },

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      incorrectPassword: 'Incorrect password for ${username}',
    },

    expires: 60 * 60 * 24 * 365 * 10,
  }

  const resetPasswordOptions = {
    handler: (user) => {
      return user
    },

    allowReusedPassword: true,

    errors: {
      resetTokenExpired: 'resetToken is expired',
      resetTokenInvalid: 'resetToken is invalid',
      resetTokenRequired: 'resetToken is required',
      reusedPassword: 'Must choose a new password',
    },
  }

  const signupOptions = {
    handler: ({ username, hashedPassword, salt, userAttributes: _ }) => {
      return db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt,
          // name: userAttributes.name
        },
      })
    },

    errors: {
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    db: db,

    authModelAccessor: 'user',

    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  return await authHandler.invoke()
}
