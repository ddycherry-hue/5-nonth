import { useEffect, useMemo, useState } from "react"
import { Alert, Card, Col, Empty, Input, Row, Select, Spin, Tag, Typography } from "antd"
import { Link } from "react-router-dom"
import styles from "./ProductsPage.module.scss"

const { Title, Text } = Typography

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("default")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((response) => {
        if (!response.ok) throw new Error("Не получилось загрузить товары")
        return response.json()
      })
      .then((data) => setProducts(data.products || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(products.map((product) => product.category))]
  const visibleProducts = useMemo(() => {
    const result = products.filter((product) => {
      const found = `${product.title} ${product.description}`.toLowerCase().includes(search.toLowerCase())
      return found && (category === "all" || product.category === category)
    })

    if (sort === "cheap") result.sort((a, b) => a.price - b.price)
    if (sort === "expensive") result.sort((a, b) => b.price - a.price)
    return result
  }, [products, search, category, sort])

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Text type="secondary">GEeks Shop</Text>
        <Title level={1}>Каталог товаров</Title>
        <Text>Выберите нужный товар и нажмите на карточку, чтобы посмотреть подробности.</Text>
      </div>

      <div className={styles.filters}>
        <Input.Search
          allowClear
          placeholder="Поиск товара"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select value={category} onChange={setCategory}>
          <Select.Option value="all">Все категории</Select.Option>
          {categories.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
        </Select>
        <Select value={sort} onChange={setSort}>
          <Select.Option value="default">Сначала популярные</Select.Option>
          <Select.Option value="cheap">Сначала дешевле</Select.Option>
          <Select.Option value="expensive">Сначала дороже</Select.Option>
        </Select>
      </div>

      {error && <Alert type="error" showIcon message={error} className={styles.error} />}
      {loading && <div className={styles.loading}><Spin size="large" /></div>}
      {!loading && !error && visibleProducts.length === 0 && <Empty description="Товары не найдены" />}

      {!loading && !error && visibleProducts.length > 0 && (
        <Row gutter={[16, 16]}>
          {visibleProducts.map((product) => (
            <Col key={product.id} xs={12} sm={8} md={6}>
              <Link to={`/products/${product.id}`} className={styles.productLink}>
                <Card hoverable cover={<img className={styles.productImage} src={product.thumbnail} alt={product.title} />}>
                  <Tag color="blue">{product.category}</Tag>
                  <Title level={5} ellipsis={{ rows: 2 }}>{product.title}</Title>
                  <div className={styles.cardBottom}>
                    <Text strong>${product.price.toFixed(2)}</Text>
                    <Text type="secondary">★ {product.rating}</Text>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default ProductsPage
