import React, { useState, useEffect } from 'react';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3500/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Форма для добавления/редактирования компании
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    logo: '',
    status: 'active'
  });

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meta/companies`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        fetchCompanies();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/meta/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setMessage({ type: 'success', text: 'Вход выполнен успешно!' });
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка соединения с сервером' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Простое удаление куки (в реальном проекте нужен logout endpoint)
    document.cookie = 'isLogged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
    setCompanies([]);
    setMessage(null);
  };

  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/meta/companies`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setCompanies(data.companies);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при получении компаний' });
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/meta/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Компания создана успешно!' });
        setFormData({ name: '', domain: '', description: '', logo: '', status: 'active' });
        setShowAddForm(false);
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при создании компании' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/meta/companies/${editingCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Компания обновлена успешно!' });
        setFormData({ name: '', domain: '', description: '', logo: '', status: 'active' });
        setEditingCompany(null);
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при обновлении компании' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту компанию?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/meta/companies/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Компания удалена успешно!' });
        fetchCompanies();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при удалении компании' });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      domain: company.domain,
      description: company.description,
      logo: company.logo,
      status: company.status
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingCompany(null);
    setFormData({ name: '', domain: '', description: '', logo: '', status: 'active' });
    setShowAddForm(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="login-form">
          <h1>🔐 Meta Admin Login</h1>
          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Логин:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <strong>Тестовые данные:</strong><br />
            Логин: admin<br />
            Пароль: qwerty
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏢 Meta Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти
        </button>
        <div style={{ clear: 'both' }}></div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {showAddForm && (
        <div className="add-company-form">
          <h2>{editingCompany ? 'Редактировать компанию' : 'Добавить новую компанию'}</h2>
          <form onSubmit={editingCompany ? handleEditCompany : handleAddCompany}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Название компании:</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="domain">Домен:</label>
                <input
                  type="text"
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Описание:</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="logo">Логотип (URL):</label>
              <input
                type="url"
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Статус:</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                disabled={loading}
              >
                <option value="active">Активна</option>
                <option value="inactive">Неактивна</option>
                <option value="suspended">Приостановлена</option>
              </select>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success btn-small" disabled={loading}>
                {loading ? 'Сохранение...' : (editingCompany ? 'Обновить' : 'Создать')}
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={cancelEdit} disabled={loading}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            className="btn btn-success" 
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            ➕ Добавить компанию
          </button>
        </div>
      )}

      <div className="companies-grid">
        {companiesLoading ? (
          <div className="loading">Загрузка компаний...</div>
        ) : companies.length === 0 ? (
          <div className="loading">Компании не найдены</div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="company-card">
              <h3>{company.name}</h3>
              <p><strong>Домен:</strong> {company.domain}</p>
              {company.description && (
                <p><strong>Описание:</strong> {company.description}</p>
              )}
              <p>
                <strong>Статус:</strong> 
                <span className={`status ${company.status}`}>
                  {company.status === 'active' ? 'Активна' : 
                   company.status === 'inactive' ? 'Неактивна' : 'Приостановлена'}
                </span>
              </p>
              <p><strong>Создана:</strong> {new Date(company.createdAt).toLocaleDateString('ru-RU')}</p>
              <div className="btn-group">
                <button 
                  className="btn btn-small" 
                  onClick={() => startEdit(company)}
                  disabled={loading}
                >
                  ✏️ Редактировать
                </button>
                <button 
                  className="btn btn-danger btn-small" 
                  onClick={() => handleDeleteCompany(company.id)}
                  disabled={loading}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
