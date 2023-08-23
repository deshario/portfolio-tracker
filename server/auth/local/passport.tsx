import passport from 'passport'
import { Strategy } from 'passport-local'

interface CallbackType {
  (error: any, user: any, message: any): void
}

const Authenticate = async (
  User: any,
  email: string,
  password: string,
  done: CallbackType,
) => {
  try {
    const user = await User.findOne({ email })
    if (!user) return done(undefined, false, { message: 'E-mail not found!' })
    user.authenticate(password, (authError: any, authenticated: any) => {
      if (authError)
        return done(authError, false, {
          message: 'Something went wrong, please try again.',
        })
      if (!authenticated)
        return done(undefined, false, {
          message: 'Invalid credentials, please try again.',
        })
      return done(undefined, user, null)
    })
  } catch (err: any) {
    return done(err, false, {
      message: 'Something went wrong, please try again.',
    })
  }
}

export const setupLocalStrategy = (User: any): void => {
  passport.use(
    new Strategy(
      { usernameField: 'email', passwordField: 'password' },
      function (email: string, password: string, done: CallbackType) {
        return Authenticate(User, email, password, done)
      },
    ),
  )
}
