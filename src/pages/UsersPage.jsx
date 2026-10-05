import { useLoaderData, useSearchParams, Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { Row, Input, Breadcrumb, Typography } from 'antd';
import UserCard from '../Components/Usercard'; 
import styles from './UsersPages.module.scss';

const { Text } = Typography;

export const usersLoader = async () => {
  try {
    // ИСПРАВЛЕНО: Теперь адрес абсолютно правильный и рабочий
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    throw new Response("Ошибка загрузки каталога пользователей", { status: 500 });
  }
};

const UsersPage = () => {
  const users = useLoaderData(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ q: value }); 
    } else {
      setSearchParams({}); 
    }
  };

  // Этот фильтр заработает только когда лоадер вернет настоящий массив пользователей
  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className={styles.page}>
      <Breadcrumb 
        className={styles.breadcrumbs}
        items={[
          { title: <Link to="/">Главная</Link> },
          { title: 'Каталог' }
        ]} 
      />

      <div className={styles.intro}>
        <h1>БАЗА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ</h1>
        <p>Выберите сотрудника или профиль для просмотра подробной информации.</p>
      </div>

      <div className={styles.searchSection}>
        <Input.Search
          placeholder="Поиск по имени сотрудника..."
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
          size="large"
        />
      </div>

      {filteredUsers.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </Row>
      ) : (
        <div className={styles.noResults}>
          <Text type="secondary">Ни один профиль не соответствует условиям поиска.</Text>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
