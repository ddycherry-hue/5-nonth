import React from 'react';
import { Card, Typography, Tag, Col } from 'antd';
import styles from './UserCard.module.scss';

const { Title, Text } = Typography;

export default function UserCard({ user }) {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Card className={styles.userCard} hoverable>
        <div className={styles.cardHeader}>
          <Title level={4} className={styles.userName}>
            {user.name}
          </Title>
          <Tag color="default">ID-{user.id}</Tag>
        </div>
        
        <div className={styles.cardBody}>
          <div className={styles.infoLine}>
            <Text type="secondary">Email:</Text>
            <Text ellipsis title={user.email}>
              {user.email}
            </Text>
          </div>
          <div className={styles.infoLine}>
            <Text type="secondary">Город:</Text>
            <Text>{user.address?.city || 'Не указан'}</Text>
          </div>
        </div>
      </Card>
    </Col>
  );
}
