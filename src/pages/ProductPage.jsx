import { useEffect, useState } from "react"
import { Alert, Breadcrumb, Button, Card, Col, Descriptions, Image, Rate, Row, Space, Spin, Tag, Typography } from "antd"
import { Link, useParams } from "react-router-dom"
import styles from "./ProductPage.module.scss"

const { Title, Paragraph, Text } = Typography

function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Товар не найден")
        return response.json()
      })
      .then((data) => {
        setProduct(data)
        setError("")
        setLoadedId(id)
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setProduct(null)
          setError(requestError.message)
          setLoadedId(id)
        }
      })

    return () => controller.abort()
  }, [id])

  if (loadedId !== id) return <div className={styles.loading}><Spin size="large" /></div>

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Alert type="error" showIcon message={error || "Товар не найден"} />
        <Button type="primary" className={styles.backButton}><Link to="/products">Вернуться в каталог</Link></Button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb className={styles.breadcrumbs} items={[
        { title: <Link to="/">Главная</Link> },
        { title: <Link to="/products">Каталог</Link> },
        { title: product.title },
      ]} />

      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          <Card className={styles.imageCard}>
            <Image src={product.thumbnail} alt={product.title} />
          </Card>
          {product.images?.length > 1 && (
            <Space wrap className={styles.gallery}>
              {product.images.slice(0, 5).map((image) => <Image key={image} src={image} alt={product.title} width={72} />)}
            </Space>
          )}
        </Col>

        <Col xs={24} md={12}>
          <Space wrap>
            <Tag color="blue">{product.category}</Tag>
            {product.brand && <Tag>{product.brand}</Tag>}
          </Space>
          <Title level={2} className={styles.title}>{product.title}</Title>
          <Space>
            <Rate disabled allowHalf value={product.rating} />
            <Text type="secondary">{product.rating} из 5</Text>
          </Space>
          <Paragraph className={styles.description}>{product.description}</Paragraph>

          <Card className={styles.infoCard}>
            <Title level={3} className={styles.price}>${product.price.toFixed(2)}</Title>
            {product.discountPercentage > 0 && <Text type="secondary">Скидка {Math.round(product.discountPercentage)}%</Text>}
            <div><Tag color={product.stock > 0 ? "green" : "red"}>{product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}</Tag></div>
            <Button type="primary" size="large" block disabled={product.stock <= 0} className={styles.buyButton}>
              {product.stock > 0 ? "Добавить в корзину" : "Нет в наличии"}
            </Button>
          </Card>

          <Descriptions bordered size="small" column={1} className={styles.details}>
            <Descriptions.Item label="Категория">{product.category}</Descriptions.Item>
            <Descriptions.Item label="Бренд">{product.brand || "Не указан"}</Descriptions.Item>
            <Descriptions.Item label="Артикул">GS-{product.id}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  )
}

export default ProductPage
