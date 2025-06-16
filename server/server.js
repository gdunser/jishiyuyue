const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

// 数据库连接配置
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'booking_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 测试数据库连接
async function testDbConnection() {
  try {
    const connection = await db.getConnection()
    console.log('数据库连接成功')
    connection.release()
  } catch (error) {
    console.error('数据库连接失败:', error)
  }
}

testDbConnection()

// 用户API
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM services')
    res.json(rows)
  } catch (error) {
    console.error('获取服务列表失败:', error)
    res.status(500).json({ error: '获取服务列表失败' })
  }
})

app.get('/api/time-slots/:serviceId/:date', async (req, res) => {
  try {
    const { serviceId, date } = req.params
    const [rows] = await db.execute(
      'SELECT * FROM time_slots WHERE service_id = ? AND date = ? AND is_booked = 0',
      [serviceId, date]
    )
    res.json(rows.map(row => row.time_slot))
  } catch (error) {
    console.error('获取时间段失败:', error)
    res.status(500).json({ error: '获取时间段失败' })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body
    
    // 检查用户是否已存在
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE telegram_id = ?',
      [telegramId]
    )
    
    if (existingUsers.length === 0) {
      // 创建新用户
      await db.execute(
        'INSERT INTO users (telegram_id, username, first_name, last_name) VALUES (?, ?, ?, ?)',
        [telegramId, username, firstName, lastName]
      )
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('创建/更新用户失败:', error)
    res.status(500).json({ error: '创建/更新用户失败' })
  }
})

// 管理员API
app.post('/api/admin/authorize', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body
    
    // 检查用户是否是授权管理员
    const [admins] = await db.execute(
      'SELECT * FROM admins WHERE telegram_id = ?',
      [telegramId]
    )
    
    const isAuthorized = admins.length > 0
    
    if (isAuthorized && admins[0].status !== 'active') {
      // 更新管理员状态为活跃
      await db.execute(
        'UPDATE admins SET username = ?, first_name = ?, last_name = ?, status = ?, last_login = NOW() WHERE id = ?',
        [username, firstName, lastName, 'active', admins[0].id]
      )
    } else if (isAuthorized) {
      // 更新最后登录时间
      await db.execute(
        'UPDATE admins SET last_login = NOW() WHERE id = ?',
        [admins[0].id]
      )
    }
    
    res.json({ authorized: isAuthorized })
  } catch (error) {
    console.error('管理员授权失败:', error)
    res.status(500).json({ error: '管理员授权失败' })
  }
})

app.get('/api/time-slots/:serviceId/:date', async (req, res) => {
  try {
    const { serviceId, date } = req.params
    const [rows] = await db.execute(
      'SELECT * FROM time_slots WHERE service_id = ? AND date = ? AND is_booked = 0',
      [serviceId, date]
    )
    res.json(rows.map(row => row.time_slot))
  } catch (error) {
    console.error('获取时间段失败:', error)
    res.status(500).json({ error: '获取时间段失败' })
  }
})

app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, serviceId, date, timeSlot } = req.body
    
    // 检查时间段是否可用
    const [timeSlotRows] = await db.execute(
      'SELECT * FROM time_slots WHERE service_id = ? AND date = ? AND time_slot = ? AND is_booked = 0',
      [serviceId, date, timeSlot]
    )
    
    if (timeSlotRows.length === 0) {
      return res.status(400).json({ error: '所选时间段已被预约' })
    }
    
    // 开始事务
    const connection = await db.getConnection()
    await connection.beginTransaction()
    
    try {
      // 创建预约
      await connection.execute(
        'INSERT INTO bookings (user_id, service_id, date, time_slot, status) VALUES (?, ?, ?, ?, ?)',
        [userId, serviceId, date, timeSlot, 'pending']
      )
      
      // 标记时间段为已预约
      await connection.execute(
        'UPDATE time_slots SET is_booked = 1 WHERE service_id = ? AND date = ? AND time_slot = ?',
        [serviceId, date, timeSlot]
      )
      
      // 提交事务
      await connection.commit()
      res.json({ success: true })
    } catch (error) {
      // 回滚事务
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('创建预约失败:', error)
    res.status(500).json({ error: '创建预约失败' })
  }
})

app.post('/api/payments', async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body
    
    // 模拟支付处理
    // 实际应用中应该与支付网关集成
    
    // 开始事务
    const connection = await db.getConnection()
    await connection.beginTransaction()
    
    try {
      // 创建支付记录
      await connection.execute(
        'INSERT INTO payments (booking_id, payment_method, amount, status) VALUES (?, ?, ?, ?)',
        [bookingId, paymentMethod, amount, 'success']
      )
      
      // 更新预约状态为已支付
      await connection.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        ['paid', bookingId]
      )
      
      // 提交事务
      await connection.commit()
      
      // 通知管理员
      sendAdminNotification(bookingId)
      
      res.json({ success: true })
    } catch (error) {
      // 回滚事务
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('处理支付失败:', error)
    res.status(500).json({ error: '处理支付失败' })
  }
})

// 管理员API
app.get('/api/admin/time-slots', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM time_slots')
    res.json(rows)
  } catch (error) {
    console.error('获取时间段列表失败:', error)
    res.status(500).json({ error: '获取时间段列表失败' })
  }
})

app.post('/api/admin/time-slots', async (req, res) => {
  try {
    const { serviceId, date, timeSlot } = req.body
    
    // 检查是否已存在相同的时间段
    const [existingRows] = await db.execute(
      'SELECT * FROM time_slots WHERE service_id = ? AND date = ? AND time_slot = ?',
      [serviceId, date, timeSlot]
    )
    
    if (existingRows.length > 0) {
      return res.status(400).json({ error: '该时间段已存在' })
    }
    
    await db.execute(
      'INSERT INTO time_slots (service_id, date, time_slot, is_booked) VALUES (?, ?, ?, ?)',
      [serviceId, date, timeSlot, 0]
    )
    
    res.json({ success: true })
  } catch (error) {
    console.error('添加时间段失败:', error)
    res.status(500).json({ error: '添加时间段失败' })
  }
})

app.delete('/api/admin/time-slots/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 检查是否已被预约
    const [timeSlotRows] = await db.execute('SELECT * FROM time_slots WHERE id = ?', [id])
    
    if (timeSlotRows.length === 0) {
      return res.status(404).json({ error: '时间段不存在' })
    }
    
    if (timeSlotRows[0].is_booked) {
      return res.status(400).json({ error: '已被预约的时间段不能删除' })
    }
    
    await db.execute('DELETE FROM time_slots WHERE id = ?', [id])
    res.json({ success: true })
  } catch (error) {
    console.error('删除时间段失败:', error)
    res.status(500).json({ error: '删除时间段失败' })
  }
})

// 通知管理员
function sendAdminNotification(bookingId) {
  // 实际应用中应该集成Telegram Bot API发送消息
  console.log(`通知管理员：预约 #${bookingId} 已支付成功`)
}

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`)
})  