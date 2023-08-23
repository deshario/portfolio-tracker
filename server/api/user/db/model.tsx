import mongoose, { Schema, Document } from 'mongoose'
import crypto from 'crypto'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  provider: string
  credentials: {
    key: string
    secret: string
  }
  salt: string
  token: string
  rtoken: string
  ftoken: string
  profile: any
  payload4Sign: any
  createdAt: any
  updatedAt: any
  authenticate: (
    password: any,
    callback?: (err: any, status?: boolean) => boolean,
  ) => any
  encryptPassword: (
    password: string,
    callback?: (err: any, pwdGen: string) => boolean,
  ) => any
}

const authTypes: Array<string> = ['github', 'twitter', 'facebook', 'google']

const UserSchema = new Schema<IUser & Document>(
  {
    name: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required(this: IUser): boolean {
        if (authTypes.indexOf(this.provider) === -1) {
          return true
        } else {
          return false
        }
      },
    },
    provider: {
      type: String,
      default: 'local',
    },
    credentials: {
      key: {
        type: String,
        trim: true,
      },
      secret: {
        type: String,
        trim: true,
      },
    },
    salt: String,
    rtoken: String,
    ftoken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Virtual Properties
UserSchema.virtual('profile').get(function (this: IUser): any {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    provider: this.provider,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
})

UserSchema.virtual('payload4Sign').get(function (this: IUser): any {
  return {
    _id: this._id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
})

UserSchema.pre<IUser & Document>('save', function (this: any, next: any): any {
  if (!this.name && this.email) {
    this.name = this.email.slice(0, this.email.indexOf('@'))
  }

  if (!this.isModified('password')) {
    return next()
  }
  this.makeSalt((saltErr: any, salt: string) => {
    if (saltErr) return next(saltErr)
    this.salt = salt
    const encryptCallback = (encryptErr: any, hashedPassword: any) => {
      if (encryptErr) return next(encryptErr)
      this.password = hashedPassword
      return next()
    }
    this.encryptPassword(this.password, encryptCallback)
  })
})

UserSchema.methods = {
  authenticate(
    password: any,
    callback: (err: any, status?: boolean) => boolean,
  ): any {
    if (!callback) {
      return this.password === this.encryptPassword(password)
    }
    this.encryptPassword(password, (err: any, pwdGen: string) => {
      if (err) {
        return callback(err)
      }
      if (this.password === pwdGen) {
        return callback(undefined, true)
      } else {
        return callback(undefined, false)
      }
    })
  },

  makeSalt(saltErr: any, salt: string): any {
    let byteSize: number | undefined
    let callback: (err: any, salt?: string) => string
    const defaultByteSize = 16
    if (typeof saltErr === 'function') {
      callback = saltErr
      byteSize = defaultByteSize
    } else if (typeof salt === 'function') {
      callback = salt
    } else {
      throw new Error('Missing Callback')
    }
    if (!byteSize) {
      byteSize = defaultByteSize
    }
    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err)
      } else {
        return callback(undefined, salt.toString('base64'))
      }
    })
  },

  encryptPassword(
    password: string,
    callback: (err: any, value?: string) => boolean,
  ): any {
    const defaultIterations = 10000
    const defaultKeyLength = 64
    const salt = Buffer.from(this.salt, 'base64')

    if (!password || !this.salt) {
      if (!callback) {
        return undefined
      } else {
        return callback('Missing password or salt')
      }
    }

    if (!callback) {
      return crypto
        .pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')
        .toString('base64')
    }

    return crypto.pbkdf2(
      password,
      salt,
      defaultIterations,
      defaultKeyLength,
      'sha1',
      (err, key) => {
        if (err) {
          return callback(err)
        } else {
          return callback(undefined, key.toString('base64'))
        }
      },
    )
  },
}

const User = mongoose.model<IUser>('User', UserSchema)

export default User
