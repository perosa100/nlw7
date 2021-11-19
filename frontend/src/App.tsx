import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'
import styles from './styles/App.module.scss'

export default function App() {
  
  return (
    <div className={styles.contentWrapper}>
      <MessageList />
      <LoginBox />
    </div>
  )
}
