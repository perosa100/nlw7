import styles from './styles.module.scss'
import { VscGithubInverted } from 'react-icons/vsc'
import { useEffect } from 'react'
import { api } from '../../services/api'

type AuthResponse = {
  token: string
  user: {
    id: string
    avatar_url: string
    nome: string
    login: string
  }
}

export const LoginBox = () => {
  let id = 'f8c03d56ebc60b88e8f0'
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${id}`

  async function signIn(githubCode: string) {
    await api
      .post<AuthResponse>('authenticate', {
        code: githubCode
      })
      .then((response) => {
        const { token, user } = response.data

        localStorage.setItem('@@NLW2021', token)
      })
  }

  useEffect(() => {
    const url = window.location.href

    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithout, githubCode] = url.split('?code=')
      window.history.pushState({}, '', urlWithout)
      signIn(githubCode)
    }
  }, [])

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size={24} /> Entrar com Github
      </a>
    </div>
  )
}
