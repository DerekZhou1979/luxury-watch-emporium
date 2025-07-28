import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Button, 
  Modal, 
  Descriptions, 
  Space, 
  Typography,
  Empty,
  Spin,
  message
} from 'antd';
import { 
  EyeOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  TruckOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../hooks/use-language';

const { Text, Title } = Typography;

// 订单状态枚举
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed', 
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// 订单接口
interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  customerInfo: CustomerInfo;
  customization?: CustomizationDetails;
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: CustomizationDetails;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface CustomizationDetails {
  configurations: Record<string, string>;
  finalPrice?: number;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  
  // 正确导入语言钩子
  const { t } = useLanguage();

  // 获取订单状态的中文描述
  const getStatusText = (status: OrderStatus): string => {
    const isChinese = t.userCenter?.title === '个人中心';
    
    switch (status) {
      case OrderStatus.PENDING:
        return isChinese ? '待确认' : 'Pending';
      case OrderStatus.CONFIRMED:
        return isChinese ? '已确认' : 'Confirmed';
      case OrderStatus.PROCESSING:
        return isChinese ? '处理中' : 'Processing';
      case OrderStatus.SHIPPED:
        return isChinese ? '已发货' : 'Shipped';
      case OrderStatus.DELIVERED:
        return isChinese ? '已送达' : 'Delivered';
      case OrderStatus.CANCELLED:
        return isChinese ? '已取消' : 'Cancelled';
      default:
        return isChinese ? '未知状态' : 'Unknown';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'orange';
      case OrderStatus.CONFIRMED:
        return 'blue';
      case OrderStatus.PROCESSING:
        return 'processing';
      case OrderStatus.SHIPPED:
        return 'cyan';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <ClockCircleOutlined />;
      case OrderStatus.CONFIRMED:
        return <CheckCircleOutlined />;
      case OrderStatus.PROCESSING:
        return <ExclamationCircleOutlined />;
      case OrderStatus.SHIPPED:
        return <TruckOutlined />;
      case OrderStatus.DELIVERED:
        return <CheckCircleOutlined />;
      case OrderStatus.CANCELLED:
        return <ExclamationCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  // 模拟获取订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            orderDate: '2024-01-15',
            status: OrderStatus.DELIVERED,
            totalAmount: 15800,
            items: [
              {
                id: '1',
                productId: 'seagull-1963-pilot',
                name: t.userCenter?.title === '个人中心' ? '海鸥1963飞行员腕表' : 'Seagull 1963 Pilot Watch',
                price: 15800,
                quantity: 1,
                image: '/images/seagull_product_1963pilot_main_01.png',
                customization: {
                  configurations: {
                    case: 'steel',
                    dial: 'white',
                    hands: 'classic',
                    secondHand: 'classic',
                    movement: 'automatic'
                  },
                  finalPrice: 15800
                }
              }
            ],
            shippingAddress: {
              name: t.userCenter?.title === '个人中心' ? '张三' : 'Zhang San',
              phone: '13800138000',
              address: t.userCenter?.title === '个人中心' ? '北京市朝阳区建国路88号' : '88 Jianguo Road, Chaoyang District, Beijing',
              city: t.userCenter?.title === '个人中心' ? '北京' : 'Beijing',
              postalCode: '100000'
            },
            customerInfo: {
              name: t.userCenter?.title === '个人中心' ? '张三' : 'Zhang San',
              email: 'zhangsan@example.com',
              phone: '13800138000'
            }
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            orderDate: '2024-01-20',
            status: OrderStatus.SHIPPED,
            totalAmount: 22800,
            items: [
              {
                id: '2',
                productId: 'seagull-tourbillon-skeleton',
                name: t.userCenter?.title === '个人中心' ? '海鸥陀飞轮镂空腕表' : 'Seagull Tourbillon Skeleton Watch',
                price: 22800,
                quantity: 1,
                image: '/images/seagull_product_tourbillon_skeleton_main.jpg'
              }
            ],
            shippingAddress: {
              name: t.userCenter?.title === '个人中心' ? '李四' : 'Li Si',
              phone: '13900139000',
              address: t.userCenter?.title === '个人中心' ? '上海市浦东新区陆家嘴金融区' : 'Lujiazui Financial District, Pudong New Area, Shanghai',
              city: t.userCenter?.title === '个人中心' ? '上海' : 'Shanghai',
              postalCode: '200000'
            },
            customerInfo: {
              name: t.userCenter?.title === '个人中心' ? '李四' : 'Li Si',
              email: 'lisi@example.com',
              phone: '13900139000'
            }
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        message.error(t.userCenter?.title === '个人中心' ? '获取订单失败' : 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [t.userCenter?.title]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

    return (
    <div className="my-orders">
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <span className="text-xl"></span>
            <span className="text-lg font-semibold">
              {t.userCenter?.title === '个人中心' ? '我的订单' : 'My Orders'}
            </span>
          </div>
        }
      >
        {orders.length === 0 ? (
          <Empty 
            description={t.userCenter?.title === '个人中心' ? '暂无订单' : 'No orders yet'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={orders}
            renderItem={(order) => (
              <List.Item
                key={order.id}
                actions={[
                  <Button 
                    type="primary" 
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(order)}
                  >
                    {t.userCenter?.title === '个人中心' ? '查看详情' : 'View Details'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {t.userCenter?.title === '个人中心' ? '订单号' : 'Order'}: {order.orderNumber}
                      </span>
                      <Tag 
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                      >
                        {getStatusText(order.status)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <div>
                        <Text type="secondary">
                          {t.userCenter?.title === '个人中心' ? '下单时间' : 'Order Date'}: {order.orderDate}
                        </Text>
                      </div>
                      <div>
                        <Text strong>
                          {t.userCenter?.title === '个人中心' ? '总金额' : 'Total Amount'}: ¥{order.totalAmount.toLocaleString()}
                        </Text>
                      </div>
                      <div>
          <Text type="secondary">
                          {t.userCenter?.title === '个人中心' ? '商品数量' : 'Items'}: {order.items.length}
          </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 订单详情弹窗 */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <span className="text-xl"></span>
            <span className="text-lg font-semibold">
              {t.userCenter?.title === '个人中心' ? '订单详情' : 'Order Details'}
            </span>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* 订单基本信息 */}
            <Card size="small" title={t.userCenter?.title === '个人中心' ? '订单信息' : 'Order Information'}>
              <Descriptions column={2}>
                <Descriptions.Item label={t.userCenter?.title === '个人中心' ? '订单号' : 'Order Number'}>
                  {selectedOrder.orderNumber}
                </Descriptions.Item>
                <Descriptions.Item label={t.userCenter?.title === '个人中心' ? '下单时间' : 'Order Date'}>
                  {selectedOrder.orderDate}
                </Descriptions.Item>
                <Descriptions.Item label={t.userCenter?.title === '个人中心' ? '订单状态' : 'Status'}>
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t.userCenter?.title === '个人中心' ? '总金额' : 'Total Amount'}>
                  <Text strong>¥{selectedOrder.totalAmount.toLocaleString()}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 商品信息 */}
            <Card size="small" title={t.userCenter?.title === '个人中心' ? '商品信息' : 'Product Information'}>
              <List
                dataSource={selectedOrder.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                        />
                      }
                      title={item.name}
                      description={
                        <div className="space-y-2">
                          <div>
                            <Text type="secondary">
                              {t.userCenter?.title === '个人中心' ? '单价' : 'Price'}: ¥{item.price.toLocaleString()}
                            </Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              {t.userCenter?.title === '个人中心' ? '数量' : 'Quantity'}: {item.quantity}
                            </Text>
                          </div>
                          {item.customization && (
        <div>
                              <Text type="secondary">
                                {t.userCenter?.title === '个人中心' ? '定制配置' : 'Customization'}:
                              </Text>
                              <div className="mt-1 space-y-1">
                                {Object.entries(item.customization.configurations).map(([key, value]) => (
                                  <div key={key} className="text-xs text-gray-600">
                                    {key}: {value}
            </div>
          ))}
                              </div>
                              {item.customization.finalPrice && (
                                <div className="mt-2">
                                  <Text strong className="text-blue-600">
                                    {t.userCenter?.title === '个人中心' ? '定制价格' : 'Custom Price'}: ¥{item.customization.finalPrice.toLocaleString()}
                                  </Text>
                                </div>
                              )}
          </div>
                          )}
        </div>
                      }
                    />
                  </List.Item>
                )}
              />
      </Card>

            {/* 收货地址 */}
            <Card size="small" title={t.userCenter?.title === '个人中心' ? '收货地址' : 'Shipping Address'}>
              <Space direction="vertical" size="small">
                <div className="flex items-center space-x-2">
                  <UserOutlined />
                  <Text strong>{selectedOrder.shippingAddress.name}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneOutlined />
                  <Text>{selectedOrder.shippingAddress.phone}</Text>
        </div>
                <div className="flex items-center space-x-2">
                  <EnvironmentOutlined />
                  <Text>
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}
          </Text>
        </div>
              </Space>
            </Card>
        </div>
      )}
      </Modal>
    </div>
  );
};

export default MyOrders; 