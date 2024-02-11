
interface Credentials {
  email: string
  password: string
}

interface SignupCredentials extends Credentials {
  username: string
}

interface User {
  created_at: string | Date
  email: string
  id: number
  username: string
}

interface FileType {
  lastModified: number
  name: string
  size: number 
  type: string
  webkitRelativePath: string
}

interface Post {
  created_at?: string | Date
  url: string 
  caption: string
  id?: number
  owner_id?: number
}

interface TimeLinePost extends Post {
  users: {username: string} | {username: string}[]
}

interface ProfileInfo {
  posts: number | null | undefined
  followers: number | null | undefined
  following: number | null | undefined
}

export type { Credentials, SignupCredentials, User, FileType, Post, ProfileInfo, TimeLinePost }
