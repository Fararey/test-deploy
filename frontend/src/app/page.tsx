'use client'

import { useState } from 'react'

interface LoginResponse {
  success: boolean
  message: string
  user?: {
    name: string
    role: string
  }
}

export default function Home() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
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
      } else {
        console.log('не успешно аутентифицирован', data)
        setMessage({
          type: 'error',
          text: `❌ ${data.message}`,
        })
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
    </div>
  )
}
