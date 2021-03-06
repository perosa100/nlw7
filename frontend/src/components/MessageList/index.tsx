import styles from './styles.module.scss'
import LogoImg from '../../assets/logo.svg'
import { api } from '../../services/api'
import { useEffect, useState } from 'react'

type MessageResponse = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

export const MessageList = () => {
  const [messages, setMessages] = useState<MessageResponse[]>([])

  useEffect(() => {
    api.get<MessageResponse[]>('messages/last3').then((response) => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={LogoImg} alt="Logo" />

      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
