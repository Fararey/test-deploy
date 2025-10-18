'use client'

import { useEffect, useState } from 'react'

interface LoginResponse {
  success: boolean
  message: string
  user?: {
    name: string
    role: string
  }
}

interface Log {
  id: number
  username: string
  success: boolean
  ipAddress: string
  userAgent: string
  timestamp: string
}

interface LogsResponse {
  success: boolean
  logs: Log[]
}

export default function Home() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<Log[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      console.log('пытаемся отправить запрос на /api/login', { name, password })
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3500/api'}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, password }),
        }
      )
      console.log('ответ от сервера', response)
      const data: LoginResponse = await response.json()

      if (data.success) {
        console.log('успешно аутентифицирован', data)
        setMessage({
          type: 'success',
          text: `✅ ${data.message} Добро пожаловать, ${data.user?.name}!`,
        })
        setName('')
        setPassword('')
        // Обновляем логи после успешного входа
        fetchLogs()
      } else {
        console.log('не успешно аутентифицирован', data)
        setMessage({
          type: 'error',
          text: `❌ ${data.message}`,
        })
        // Обновляем логи после неуспешной попытки
        fetchLogs()
      }
    } catch (error) {
      console.log('ошибка при аутентификации', error)
      setMessage({
        type: 'error',
        text: '❌ Ошибка соединения с сервером. Проверьте, что бэкенд запущен.',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    setLogsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3500/api'}/logs`
      )
      const data: LogsResponse = await response.json()

      if (data.success) {
        setLogs(data.logs)
      }
    } catch (error) {
      console.error('Ошибка при получении логов:', error)
    } finally {
      setLogsLoading(false)
    }
  }

  // Загружаем логи при загрузке компонента
  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className='container'>
      <h1 className='title'>🔐 Тестовая Аутентификация</h1>

      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='name' className='label'>
            Имя пользователя
          </label>
          <input
            id='name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input'
            placeholder='Введите имя'
            required
            disabled={loading}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password' className='label'>
            Пароль
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input'
            placeholder='Введите пароль'
            required
            disabled={loading}
          />
        </div>

        <button type='submit' className='button' disabled={loading}>
          {loading ? (
            <>
              <span className='loading'></span>
              Отправка...
            </>
          ) : (
            '🚀 Войти'
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className='credentials'>
        <h3>📋 Тестовые учетные данные:</h3>
        <p>
          <strong>Имя:</strong> admin
        </p>
        <p>
          <strong>Пароль:</strong> qwerty123
        </p>
      </div>

      <div className='logs-section'>
        <div className='logs-header'>
          <h3>📊 История попыток входа</h3>
          <button
            onClick={fetchLogs}
            className='button'
            disabled={logsLoading}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            {logsLoading ? '🔄' : '🔄'} Обновить
          </button>
        </div>

        {logsLoading ? (
          <div className='loading'>Загрузка логов...</div>
        ) : (
          <div className='logs-container'>
            {logs.length === 0 ? (
              <p>Логи пока отсутствуют</p>
            ) : (
              <div className='logs-list'>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`log-item ${log.success ? 'success' : 'error'}`}
                  >
                    <div className='log-header'>
                      <span className='log-username'>{log.username}</span>
                      <span
                        className={`log-status ${log.success ? 'success' : 'error'}`}
                      >
                        {log.success ? '✅ Успешно' : '❌ Неудачно'}
                      </span>
                      <span className='log-time'>
                        {new Date(log.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div className='log-details'>
                      <small>IP: {log.ipAddress}</small>
                      <small>
                        User Agent: {log.userAgent?.substring(0, 50)}...
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
