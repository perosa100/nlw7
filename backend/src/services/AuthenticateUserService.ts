import axios from 'axios'
import { sign } from 'jsonwebtoken'
import prismaClient from '../prisma'

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string
  login: string
  id: number
  name: string
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token'

    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      })

    const response = await axios.get<IUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`
        }
      }
    )
    const { avatar_url, login, id, name } = response.data

    let userFind = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!userFind) {
      userFind = await prismaClient.user.create({
        data: {
          avatar_url,
          github_id: id,
          login,
          name
        }
      })
    }

    const token = sign(
      {
        user: {
          name: userFind.name,
          avatar_url: userFind.avatar_url,
          id: userFind.id
        }
      },
      process.env.JWT_ID_SECRET,
      { subject: userFind.id, expiresIn: '1d' }
    )

    return { token, userFind }
  }
}

export { AuthenticateUserService }

/* 
recebe code string
recuperar o axios token do github
verifica no db
   - se sim gera um token
   - se nao cria um usuario

return o token com as info do user
*/
